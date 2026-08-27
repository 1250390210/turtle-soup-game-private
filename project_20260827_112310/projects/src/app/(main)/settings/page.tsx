'use client';

import { useState, useEffect } from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI', placeholder: 'https://api.openai.com/v1' },
  { value: 'deepseek', label: 'DeepSeek', placeholder: 'https://api.deepseek.com/v1' },
  { value: 'moonshot', label: 'Moonshot (Kimi)', placeholder: 'https://api.moonshot.cn/v1' },
  { value: 'custom', label: '自定义 (OpenAI 兼容)', placeholder: 'https://your-api.com/v1' },
];

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiProvider, setApiProvider] = useState('openai');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [modelName, setModelName] = useState('');
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setApiKey(localStorage.getItem('apiKey') || '');
    setApiProvider(localStorage.getItem('apiProvider') || 'openai');
    setApiBaseUrl(localStorage.getItem('apiBaseUrl') || '');
    setModelName(localStorage.getItem('modelName') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('apiProvider', apiProvider);
    localStorage.setItem('apiBaseUrl', apiBaseUrl);
    localStorage.setItem('modelName', modelName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectedProvider = PROVIDERS.find((p) => p.value === apiProvider);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-1 font-serif-display text-2xl font-bold">设置</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        配置你的大模型 API，用于 AI 主持人功能
      </p>

      <div className="space-y-5">
        {/* Provider */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            API 服务商
          </label>
          <select
            value={apiProvider}
            onChange={(e) => {
              setApiProvider(e.target.value);
              const provider = PROVIDERS.find((p) => p.value === e.target.value);
              if (provider && provider.value !== 'custom') {
                setApiBaseUrl(provider.placeholder);
              }
            }}
            className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Base URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            API Base URL
          </label>
          <input
            type="text"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            placeholder={selectedProvider?.placeholder || ''}
            className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            一般不需要修改，使用默认值即可
          </p>
        </div>

        {/* Model Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            模型名称（可选）
          </label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="留空使用默认模型，如 gpt-4o-mini / deepseek-chat"
            className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>

        {/* API Key */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {showKey ? '隐藏' : '显示'}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Key 仅存储在你的浏览器本地，不会上传到服务器
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              已保存
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              保存设置
            </>
          )}
        </button>

        {/* Help Section */}
        <div className="rounded-lg border border-border/50 bg-card p-4">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <AlertCircle className="h-4 w-4 text-accent" />
            如何获取 API Key？
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>
              <strong>OpenAI</strong>：访问 platform.openai.com，注册后在 API Keys 页面创建
            </li>
            <li>
              <strong>DeepSeek</strong>：访问 platform.deepseek.com，注册后获取 API Key
            </li>
            <li>
              <strong>Moonshot</strong>：访问 platform.moonshot.cn，注册后获取 API Key
            </li>
            <li>
              费用极低，一局推理约 0.001~0.005 元，1 元可玩数百局
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
