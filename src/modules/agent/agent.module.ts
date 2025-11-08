import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { ChatModelService } from './core/chatModel';
import { AgentFactory } from './core/agent';
import { ToolsService } from './core/tools';
import { ShopifyModule } from '../shopify/shopify.module';
import { MetaModule } from '../meta/meta.module';

@Module({
  imports: [ShopifyModule, MetaModule],
  controllers: [AgentController],
  providers: [
    ChatModelService,
    ToolsService,
    AgentFactory,
    AgentService,
  ],
})
export class AgentModule {}
