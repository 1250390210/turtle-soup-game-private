'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Eye, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TagBadge } from '@/components/soup-card';
import type { ChatMessage, Soup } from '@/lib/types';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const soupId = params.id as string;

  const [soup, setSoup] = useState<Soup | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTruth, setShowTruth] = useState(false);
  const [copied, setCopied] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [apiProvider, setApiProvider] = useState('openai');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/soups/${soupId}`)
      .then((res) => {
        if (!res.ok) throw new Error('题目不存在');
        return res.json();
      })
      .then((data) => {
        setSoup(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [soupId]);

  useEffect(() => {
    const key = localStorage.getItem('apiKey') || '';
    const provider = localStorage.getItem('apiProvider') || 'openai';
    const baseUrl = localStorage.getItem('apiBaseUrl') || '';
    const model = localStorage.getItem('modelName') || '';
    setApiKey(key);
    setApiProvider(provider);
    setApiBaseUrl(baseUrl);
    setModelName(model);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildSystemPrompt = useCallback(() => {
    if (!soup) return '';
    return `你是一个海龟汤（情境推理游戏）的铁面主持人。

规则：
1. 玩家会看到一段悬疑描述（汤面），通过提问来推理出完整真相（汤底）。
2. 你只能回答："是"、"否"或"与此无关"，绝对不能额外提示或解释。
3. 每次回答后在括号里标注当前是第几个问题，格式如："是。（第N问）"
4. 当玩家推理接近真相时，可以追加一句"很接近了"。
5. 当玩家完整说出真相时，确认并宣布游戏结束。
6. 任何情况下都不能直接泄露汤底内容。
7. 如果玩家的问题模糊不清，回答"请更具体地描述你的问题"。

当前汤面：${soup.soup}
当前汤底（仅供你判断对错，绝不能泄露）：${soup.truth}`;
  }, [soup]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: input.trim() },
        {
          role: 'assistant',
          content: '请先在设置页面配置 API Key 才能开始推理。',
        },
      ]);
      setInput('');
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatMessages = [
        { role: 'system' as const, content: buildSystemPrompt() },
        ...messages,
        userMessage,
      ];

      const baseUrl = apiBaseUrl || getDefaultBaseUrl(apiProvider);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          apiKey,
          apiProvider,
          baseUrl,
          modelName,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `请求失败 (${response.status})`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content || '无法获取回复',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : '请求出错';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `出错了：${errMsg}。请检查 API 设置。` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySoup = async () => {
    if (!soup) return;
    const text = `【海龟汤】${soup.title}\n\n${soup.soup}\n\n请扮演海龟汤主持人，我只能问是/否的问题，你只能回答"是"、"否"或"与此无关"。汤底是：${soup.truth}。请不要主动泄露汤底。`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        加载题目中...
      </div>
    );
  }

  if (!soup) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">题目不存在</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          返回题库
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      {/* Soup Header */}
      <div className="shrink-0 border-b border-border/50 pb-4">
        <button
          onClick={() => router.push('/')}
          className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回题库
        </button>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-serif-display text-xl font-bold">{soup.title}</h1>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {soup.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
          <button
            onClick={handleCopySoup}
            className="flex shrink-0 items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? '已复制' : '复制汤面'}
          </button>
        </div>
        <p className="mt-3 font-serif-display text-sm leading-relaxed text-muted-foreground">
          {soup.soup}
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <MessageCircleIcon />
            </div>
            <p className="text-sm text-muted-foreground">
              向主持人提问吧！只能问可以用"是"或"否"回答的问题
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              例如："他是自杀的吗？" "这件事发生在室内吗？"
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'animate-fade-in-up flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-3.5 py-2 text-sm',
                    msg.role === 'user'
                      ? 'bg-primary/15 text-foreground'
                      : 'bg-secondary text-foreground'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="rounded-lg bg-secondary px-3.5 py-2 text-sm text-muted-foreground">
                  思考中...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Truth Reveal */}
      <div className="shrink-0 border-t border-border/50 py-2">
        {!showTruth ? (
          <button
            onClick={() => {
              if (confirm('确定要揭晓汤底吗？揭晓后将无法撤回。')) {
                setShowTruth(true);
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary/50 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            <Eye className="h-4 w-4" />
            揭晓汤底
          </button>
        ) : (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 animate-fade-in-up">
            <p className="mb-1 text-xs font-medium text-primary">汤底</p>
            <p className="font-serif-display text-sm leading-relaxed text-foreground">
              {soup.truth}
            </p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border/50 pt-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="向主持人提问..."
            disabled={isLoading}
            className="flex-1 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {questionCount > 0 && (
          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            已提问 {questionCount} 次
          </p>
        )}
      </div>
    </div>
  );
}

function MessageCircleIcon() {
  return (
    <svg
      className="h-6 w-6 text-muted-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.18 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </svg>
  );
}

function getDefaultBaseUrl(provider: string): string {
  switch (provider) {
    case 'openai':
      return 'https://api.openai.com/v1';
    case 'deepseek':
      return 'https://api.deepseek.com/v1';
    case 'moonshot':
      return 'https://api.moonshot.cn/v1';
    default:
      return 'https://api.openai.com/v1';
  }
}
