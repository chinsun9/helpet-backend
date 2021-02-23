export type Article = {
  aidx: number;
  title: string;
  content: string;
  summary: string;
  thumbnail: string;
  use_flag: string;
  count_view: number;
  count_like: number;
  insert_date: string;
  update_date: string;
  insert_uidx: number;
  category_code: string;
};

export type OldArticlePreview = {
  title: string;
  summary: string;
  thumbnail: string;
  insert_date: string;
};

export type ArticlePreview = {
  aidx: string;
  title: string;
  summary: string;
  thumbnail: string;
  count_view: string;
  count_like: string;
  insert_date: string;
  update_date: string;
  insert_uidx: string;
  category_code: string;
};

export type ArticlePreview2 = OldArticlePreview & { url: string };

export type ArticleSimple = {
  id: number;
  title: string;
  datetime: string;
  thumbnailUrl: string;
};

export type ArticleInput = {
  title: string;
  datetime: string;
  thumbnailUrl: string;
};

export type UserInput = {
  email: String;
  password: String;
  cookie: String;
};

export type User = {
  id: Number;
  email: String;
  password: String;
  cookie: String;
};
