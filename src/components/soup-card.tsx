'use client';

import { cn } from '@/lib/utils';
import type { Soup } from '@/lib/types';

const TAG_STYLES: Record<string, string> = {
  '本格': 'tag-benige',
  '变格': 'biange',
  '新本格': 'biange',
  '清汤': 'tag-qingtang',
  '红汤': 'tag-hongtang',
  '黑汤': 'tag-heitang',
  '逻辑汤': 'tag-default',
  '脑洞汤': 'tag-default',
  '荒诞汤': 'tag-default',
  '情感汤': 'tag-default',
  '日常汤': 'tag-default',
  '连环汤': 'tag-default',
  '卷轴汤': 'tag-default',
  '套娃汤': 'tag-default',
};

export function TagBadge({ tag }: { tag: string }) {
  const style = TAG_STYLES[tag] || 'tag-default';
  return (
    <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs', style)}>
      {tag}
    </span>
  );
}

export function SoupCard({ soup }: { soup: Soup }) {
  return (
    <div className="group rounded-lg border border-border/50 bg-card p-5 transition-all duration-200 hover:border-border hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-serif-display text-lg font-semibold text-foreground">
          {soup.title}
        </h3>
        <div className="flex shrink-0 flex-wrap gap-1 justify-end">
          {soup.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
      <p className="mb-4 font-serif-display text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {soup.soup}
      </p>
      <a
        href={`/game/${soup.id}`}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
      >
        开始推理
      </a>
    </div>
  );
}
