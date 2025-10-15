export interface IArticle {
  id: string;
  title: string;
  authors: string[];
  date: string;
  abstract: string;
  pmid: string;
}

export interface IAnalyzedArticle {
  id: string;
  title: string;
  processed: string;
  summary: string;
}

export type IFullAnalyzedArticle = IArticle & {
  processed: string;
  summary: string;
};

export interface IAnalyzeResponse {
  articles: IFullAnalyzedArticle[];
  general_summary: string;
}
