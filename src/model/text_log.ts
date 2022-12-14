import { model, Schema } from 'mongoose';


export interface TextLog{
	userId: string
	avatar: string
	username: string
	guildId: string
	channelId: string
    count: number
}

const TextLog: Schema = new Schema({
	userId: String,
	avatar: String,
	username: String,
	guildId: String,
	channelId: String,
	count: {
		type: Number,
		default: 1
	}
});

export default model<TextLog>('text_log', TextLog);