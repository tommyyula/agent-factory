/**
 * Sandbox Chat Component
 * Chat interface for agent interaction with message history and input
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Bot, Code, Database, CheckCircle, AlertCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AgentSession, ChatMessage } from '@/stores/agentRuntimeStore';
import { useAgentRuntimeStore } from '@/stores/agentRuntimeStore';
import { cn } from '@/lib/utils';

interface SandboxChatProps {
  session: AgentSession;
}

export function SandboxChat({ session }: SandboxChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { sendMessage } = useAgentRuntimeStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isSubmitting) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsSubmitting(true);

    try {
      await sendMessage(session.id, message);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {session.messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium mb-2">开始与 {session.agentName} 对话</p>
              <p className="text-sm text-muted-foreground mb-4">
                您可以向智能体提问或下达指令，它会基于 {session.domain.toUpperCase()} 域的知识进行响应
              </p>
              <div className="grid gap-2 max-w-md mx-auto">
                <SuggestionChip 
                  onClick={() => setInputMessage('查询当前库存状态')}
                  text="查询当前库存状态" 
                />
                <SuggestionChip 
                  onClick={() => setInputMessage('分析本月的订单趋势')}
                  text="分析本月的订单趋势" 
                />
                <SuggestionChip 
                  onClick={() => setInputMessage('处理新的入库任务')}
                  text="处理新的入库任务" 
                />
              </div>
            </div>
          ) : (
            session.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          
          {/* Typing indicator */}
          {session.status === 'running' && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{session.agentName} 正在思考...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2 max-w-4xl mx-auto">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`向 ${session.agentName} 发送消息...`}
              disabled={isSubmitting}
              className="text-sm"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || isSubmitting}
            size="sm"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 max-w-4xl mx-auto">
          <span>按 Enter 发送，Shift + Enter 换行</span>
          <div className="flex items-center space-x-3">
            <span>{session.messages.length} 条消息</span>
            <span>{session.metrics.totalTokens} tokens</span>
            <span>{Math.round(session.metrics.executionTime / 1000)}s 执行时间</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  
  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex space-x-3 max-w-[80%]",
        isUser && "flex-row-reverse space-x-reverse"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
          isUser ? "bg-primary" : isSystem ? "bg-gray-500" : "bg-green-500"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <div className={cn(
          "flex flex-col space-y-1",
          isUser ? "items-end" : "items-start"
        )}>
          {/* Message Header */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>{isUser ? '您' : '智能体'}</span>
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            {message.metadata?.executionTime && (
              <>
                <span>•</span>
                <span>{message.metadata.executionTime}ms</span>
              </>
            )}
          </div>

          {/* Message Body */}
          <Card className={cn(
            "max-w-none",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <CardContent className="p-3">
              {message.type === 'thinking' ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm italic">{message.content}</span>
                </div>
              ) : message.type === 'tool_call' ? (
                <ToolCallDisplay data={message.data} />
              ) : message.type === 'tool_result' ? (
                <ToolResultDisplay data={message.data} />
              ) : (
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              )}

              {/* Message Metadata */}
              {message.metadata && !isUser && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {message.metadata.tokenCount && (
                    <Badge variant="outline" className="text-xs">
                      <Code className="h-3 w-3 mr-1" />
                      {message.metadata.tokenCount} tokens
                    </Badge>
                  )}
                  {message.metadata.tablesAccessed && message.metadata.tablesAccessed.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      {message.metadata.tablesAccessed.length} 表
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface ToolCallDisplayProps {
  data: any;
}

function ToolCallDisplay({ data }: ToolCallDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Code className="h-4 w-4" />
        <span className="font-medium text-sm">工具调用: {data.name}</span>
      </div>
      {data.parameters && (
        <div className="bg-background/50 rounded p-2 text-xs font-mono">
          <pre>{JSON.stringify(data.parameters, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

interface ToolResultDisplayProps {
  data: any;
}

function ToolResultDisplay({ data }: ToolResultDisplayProps) {
  const isSuccess = data.success !== false;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {isSuccess ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}
        <span className="font-medium text-sm">工具执行结果</span>
        {data.executionTime && (
          <Badge variant="outline" className="text-xs">
            <Timer className="h-3 w-3 mr-1" />
            {data.executionTime}ms
          </Badge>
        )}
      </div>
      
      {data.rowCount && (
        <div className="text-sm">
          <span className="text-muted-foreground">查询结果:</span> {data.rowCount} 条记录
        </div>
      )}
      
      {data.message && (
        <div className="text-sm">{data.message}</div>
      )}
      
      {data.data && (
        <div className="bg-background/50 rounded p-2 text-xs">
          {Array.isArray(data.data) ? (
            <div className="space-y-1">
              {data.data.slice(0, 3).map((row: any, index: number) => (
                <div key={index} className="font-mono">
                  {typeof row === 'object' ? JSON.stringify(row) : String(row)}
                </div>
              ))}
              {data.data.length > 3 && (
                <div className="text-muted-foreground">... 还有 {data.data.length - 3} 条记录</div>
              )}
            </div>
          ) : typeof data.data === 'object' ? (
            <pre>{JSON.stringify(data.data, null, 2)}</pre>
          ) : (
            <span>{String(data.data)}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
}

function SuggestionChip({ text, onClick }: SuggestionChipProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="justify-start text-left h-auto py-2 px-3 whitespace-normal"
      onClick={onClick}
    >
      {text}
    </Button>
  );
}