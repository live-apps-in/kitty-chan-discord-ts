import { Request } from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { REPLY } from '../../app/enum/reply';
import { IGuild } from '../../app/interface/shared.interface';
import { ResponseService } from '../../app/service/shared/response.service';
import { TYPES } from '../../core/inversify.types';

@controller('/client')
export class TextController{
	constructor(
        @inject(TYPES.ResponseService) private readonly responseService: ResponseService
	) { }
    
    @httpPost('/text')
	async sendText(req: Request) {
		const { message, channelId } = req.body;
		const guild: IGuild = {
			channelId
		};
        
		await this.responseService.respond({
            	type: REPLY.sendMessage,
			guild,
			body: {
				content: message
			}
		});
		return {
			message: 'Message sent'
		};
	}

}