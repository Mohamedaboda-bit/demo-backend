import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from "@langchain/openai";

@Injectable()
export class ChatModelService {
    private chatModel: ChatOpenAI;

    constructor(private configService: ConfigService) {
        this.chatModel = new ChatOpenAI({
            model: this.configService.get<string>('OPENAI_MODEL') ,
            temperature: 0.4,
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    getChatModel(): ChatOpenAI {
        return this.chatModel;
    }
}


