type Article = {
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

type ArticlePreview = {
  title: string;
  summary: string;
  thumbnail: string;
  insert_date: string;
};

type ArticlePreview2 = ArticlePreview & { url: string };

export { ArticlePreview2, ArticlePreview, Article };
