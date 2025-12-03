export enum Testament {
  OLD = "Old Testament",
  NEW = "New Testament",
}

export interface BookData {
  name: string;
  zhName: string;
  chapters: number;
  testament: Testament;
  category: string;
}

export type ProgressMap = Record<string, boolean>;

export interface AIInsight {
  summary: string;
  keyVerse: string;
}