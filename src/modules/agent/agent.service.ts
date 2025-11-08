import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AgentFactory } from './core/agent';

export interface StreamEvent {
  data: {
    node: string;
    content: string;
    type: 'token' | 'done' | 'error';
  };
}

@Injectable()
export class AgentService {
  constructor(private agentFactory: AgentFactory) {}

  StreamAgent(message: string, threadId?: string): Observable<StreamEvent> {
    return new Observable((subscriber) => {
      (async () => {
        try {
          const agent = this.agentFactory.getAgent();
          const stream = await agent.stream(
            { messages: [{ role: "user", content: message }] },
            { streamMode: "messages", configurable: { thread_id: 'default' } }
          );

          for await (const [token, metadata] of stream) {
            const content = token.contentBlocks?.[0]?.text;
            const nodeName = metadata.langgraph_node;

            // Skip tool invocation nodes - only stream agent responses
            if (nodeName === 'tools') {
              continue;
            }

            subscriber.next({
              data: {
                node: nodeName,
                content: content,
                type: 'token',
              },
            });
          }

          subscriber.complete();
          
        } catch (error) {
          subscriber.next({
            data: {
              node: 'system',
              content: error.message || 'An error occurred',
              type: 'error',
            },
          });
          subscriber.error(error);
        }
      })();
    });
  }
}
