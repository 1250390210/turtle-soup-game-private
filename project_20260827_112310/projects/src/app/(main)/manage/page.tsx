'use client';

import { useState, useEffect } from 'react';
import type { Soup } from '@/lib/types';

export default function ManagePage() {
  const [soups, setSoups] = useState<Soup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/soups')
      .then((res) => res.json())
      .then((data) => {
        setSoups(data.soups || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        加载题库中...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-2xl font-bold">题库列表</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          共 {soups.length} 道题目
        </p>
      </div>

      <div className="space-y-3">
        {soups.map((soup) => (
          <div
            key={soup.id}
            className="rounded-lg border border-border/50 bg-card p-4"
          >
            <h3 className="font-serif-display text-base font-semibold">
              {soup.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {soup.soup}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {soup.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {soups.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <p>题库为空</p>
        </div>
      )}
    </div>
  );
}
