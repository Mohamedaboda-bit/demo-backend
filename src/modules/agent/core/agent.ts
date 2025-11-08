import { Injectable, Options } from '@nestjs/common';
import { createAgent } from "langchain";
import { ChatModelService } from "./chatModel";
import { ToolsService } from "./tools";
import { MemorySaver } from "@langchain/langgraph";

@Injectable()
export class AgentFactory {
    private agent: any;

    constructor(
        private chatModelService: ChatModelService,
        private toolsService: ToolsService
    ) {
        const checkpointer = new MemorySaver();
        this.agent = createAgent({
            model: this.chatModelService.getChatModel(),
            tools: this.toolsService.getTools(),
            checkpointer,
            systemPrompt: "When asking about date,time or any periods for the tools, consider that we are in the year 2025, also i want you to give insights for the data you are gettig from the tools after passing it"
        });
    }

    getAgent() {
        return this.agent;
    }
}

