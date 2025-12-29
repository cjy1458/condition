export type PageView = 'home' | 'games' | 'penalty' | 'test';

export interface GameItem {
  id: number;
  type: 'brain' | 'tension' | 'quiet' | 'active';
  title: string;
  desc: string;
  tags: string[];
}

export interface PenaltyResult {
  who: string;
  action: string;
  amount: string;
  desc: string;
}

export type AlcoholType = '소주' | '맥주' | '소맥' | '막걸리' | '와인';
export type AlcoholLevel = 'baby' | 'normal' | 'pro' | 'heavy' | 'monster';

export interface LevelOption {
  id: AlcoholLevel;
  label: string;
  sub: string;
}