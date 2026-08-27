import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const SOUPS_FILE = path.join(process.cwd(), 'src', 'data', 'soups.json');

interface SoupData {
  version: string;
  soups: Array<{
    id: string;
    title: string;
    soup: string;
    truth: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }>;
}

function readSoups(): SoupData {
  if (!existsSync(SOUPS_FILE)) {
    return { version: '1.0', soups: [] };
  }
  const content = readFileSync(SOUPS_FILE, 'utf-8');
  return JSON.parse(content);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readSoups();
    const soup = data.soups.find((s) => s.id === id);

    if (!soup) {
      return NextResponse.json({ error: '题目不存在' }, { status: 404 });
    }

    return NextResponse.json(soup);
  } catch (error) {
    const message = error instanceof Error ? error.message : '读取题目失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
