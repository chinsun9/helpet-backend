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

type OldArticlePreview = {
  title: string;
  summary: string;
  thumbnail: string;
  insert_date: string;
};

type ArticlePreview = {
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

type ArticlePreview2 = OldArticlePreview & { url: string };

export { ArticlePreview2, OldArticlePreview, Article, ArticlePreview };
