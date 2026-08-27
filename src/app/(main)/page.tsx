'use client';

import { useState, useEffect, useMemo } from 'react';
import { SoupCard } from '@/components/soup-card';
import { TAG_CATEGORIES, type Soup } from '@/lib/types';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [soups, setSoups] = useState<Soup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetch('/api/soups')
      .then((res) => res.json())
      .then((data) => {
        setSoups(data.soups || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredSoups = useMemo(() => {
    return soups.filter((soup) => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => soup.tags.includes(tag));
      const matchesSearch =
        !searchQuery ||
        soup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        soup.soup.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTags && matchesSearch;
    });
  }, [soups, selectedTags, searchQuery]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        加载题库中...
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="font-serif-display text-3xl font-bold tracking-wide text-foreground">
          海龟汤题库
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          每一碗汤，都是一个等待揭开的谜
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索汤面或标题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors',
              showFilter
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground'
            )}
          >
            <Filter className="h-4 w-4" />
            筛选
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="rounded-lg border border-border bg-card p-4 animate-fade-in-up">
            {TAG_CATEGORIES.map((category) => (
              <div key={category.name} className="mb-3 last:mb-0">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {category.name}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {category.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs transition-colors',
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
                清除筛选
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs text-muted-foreground">
        共 {filteredSoups.length} 道题目
        {selectedTags.length > 0 && (
          <span className="ml-2">
            (已筛选: {selectedTags.join(', ')})
          </span>
        )}
      </div>

      {/* Soup Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredSoups.map((soup) => (
          <SoupCard key={soup.id} soup={soup} />
        ))}
      </div>

      {filteredSoups.length === 0 && !loading && (
        <div className="py-16 text-center text-muted-foreground">
          <p>没有找到匹配的题目</p>
          <p className="mt-1 text-sm">试试调整筛选条件或搜索关键词</p>
        </div>
      )}
    </div>
  );
}
