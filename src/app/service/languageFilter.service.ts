import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { bad_words } from '../data/strong_language';
import { hinglish_words } from '../data/hinglish';
import { TYPES } from '../../core/inversify.types';
import { ResponseService } from './shared/response.service';
import { IGuild } from '../interface/shared.interface';
import { REPLY } from '../enum/reply';
import { LoggerService } from './logger.service';
import { VIOLATIONS } from '../enum/violations';
import { middleware, WhiteListService } from './shared/whitelist.service';
require('dotenv/config');

@injectable()
export class LanguageFilter {
	constructor(
		@inject(TYPES.ResponseService) private readonly responseService: ResponseService,
		@inject(TYPES.LoggerService) private readonly LoggerService: LoggerService,
		@inject(TYPES.WhiteListService) private readonly whiteListService: WhiteListService
	) { }
    
	///Non-English Detection
	@middleware()
	async non_english_detection(guild: IGuild): Promise<boolean>{
		this.whiteListService.validate();
		let {messageContent} = guild;
		messageContent = messageContent.toLowerCase().trim();
		const messageChunk = messageContent.split(' ');
		let isNonEnglish = false;
		
		messageChunk.map((e) => {
			if (hinglish_words.includes(e)) isNonEnglish = true;
		});

		if (isNonEnglish) {
			
			await this.responseService.respond({
				type: REPLY.addReaction,
				guild,
				body: {
					emoji: '%E2%9A%A0%EF%B8%8F'
				}
			});

			///Log Violation
			await this.LoggerService.violation_logger(guild, VIOLATIONS.non_english);
		}

		
		return isNonEnglish;
	}

	///Strong Language Detection
	async strong_language_detection(guild: IGuild): Promise<boolean> {
		let { messageContent } = guild;
		messageContent = messageContent.toLowerCase().trim();
		const messageChunk: string[] = messageContent.split(' ');
		let isStrongLanguage = false;

		messageChunk.map((e) => {
			if (bad_words.includes(e)) isStrongLanguage = true;
		});

		if (isStrongLanguage) {
			await this.responseService.respond({
				type: REPLY.addReaction,
				guild,
				body: {
					emoji: '%E2%9A%A0%EF%B8%8F'
				}
			});

			///Log Violation
			await this.LoggerService.violation_logger(guild, VIOLATIONS.strong_language);
		}
		
		return isStrongLanguage;
	}

}