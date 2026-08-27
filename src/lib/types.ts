export interface Soup {
  id: string;
  title: string;
  soup: string;
  truth: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SoupCollection {
  soups: Soup[];
  version: string;
}

export type TagCategory = {
  name: string;
  tags: string[];
};

export const TAG_CATEGORIES: TagCategory[] = [
  {
    name: '现实逻辑',
    tags: ['本格', '变格', '新本格'],
  },
  {
    name: '恐怖程度',
    tags: ['清汤', '红汤', '黑汤'],
  },
  {
    name: '故事风格',
    tags: ['逻辑汤', '脑洞汤', '荒诞汤', '情感汤', '日常汤'],
  },
  {
    name: '特殊设定',
    tags: ['连环汤', '卷轴汤', '套娃汤'],
  },
];

export const ALL_TAGS = TAG_CATEGORIES.flatMap((c) => c.tags);

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GameSession {
  soupId: string;
  messages: ChatMessage[];
  questionCount: number;
  isFinished: boolean;
}
