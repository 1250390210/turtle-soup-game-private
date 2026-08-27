import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '海龟汤题库',
  description: '一个专属的海龟汤（情境推理游戏）题库，支持 AI 主持人互动推理',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
