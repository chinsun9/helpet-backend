import { buildSchema } from 'graphql';

export default buildSchema(`
type Query {
  articles: [ArticlePreview]
  articlesv2(keyword: String, category_code: String, size: Int, page: Int): [ArticlePreview]
  article(aidx: Int): Article
  user: User
}

type Mutation {
  create_article(input: ArticleInput): [Article]
  create_user(input: UserInput): User
}

type ArticlePreview { 
  aidx: Int
  title: String
  summary: String
  thumbnail: String
  use_flag: String
  count_view: Int
  count_like: Int
  insert_date: String
  update_date: String
  insert_uidx: Int
  category_code: String 
}

type Article {
  aidx: Int
  title: String
  summary: String
  content: String
  thumbnail: String
  use_flag: String
  count_view: Int
  count_like: Int
  insert_date: String
  update_date: String
  insert_uidx: Int
  category_code: String 
}

type User {
  id: Int
  email: String
  password: String
  cookie: String
}

input ArticleInput {
  title: String,
  datetime: String,
  thumbnailUrl: String
}

input UserInput {
  email: String
  password: String
  cookie: String
}
`);
