import { Controller, Post, Body, Res, Headers } from '@nestjs/common';
import { Response } from 'express';
import { AgentService } from './agent.service';

interface MessageBody {
  message: string;
  threadId?: string;
}

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('stream')
  async streamAgent(
    @Body() body: MessageBody,
    @Res() response: Response,
    @Headers() headers: Record<string, string>
  ): Promise<void> {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    const inferredThreadId = body.threadId || headers['x-thread-id'] || headers['x-session-id'] || 'default';
    const subscription = this.agentService.StreamAgent(body.message, inferredThreadId).subscribe({
      next: (event) => {
        response.write(`data: ${JSON.stringify(event.data)}\n\n`);
      },
      complete: () => {
        response.end();
      },
      error: (err) => {
        response.write(`data: ${JSON.stringify({ 
          node: 'system',
          content: err.message || 'Stream error',
          type: 'error'
        })}\n\n`);
        response.end();
      },
    });

    response.on('close', () => {
      subscription.unsubscribe();
    });
  }
}
