export interface Score {
  name: string,
  score: number,
  date: string;
}

export interface User {
  name: string,
  token: string,
}

export interface GameplayHistoryEntry {
  timestamp: Date;
  action: string;
}
