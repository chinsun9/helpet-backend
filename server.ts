import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import { selectArticleList, selectArticle } from './utils/myDAO';
import mysql2 from 'mysql2';

const PORT = process.env.PORT || 5000;

class App {
  public application: express.Application;
  constructor() {
    this.application = express();
  }
}

const app = new App().application;
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('server testing ok');
});

app.get('/helpetuser2', (req: Request, res: Response) => {
  try {
    const pool = mysql2.createPool({
      host: 'rds.cmnkfayymxyz.ap-northeast-2.rds.amazonaws.com',
      user: 'helpetuser2',
      password: '5uperhelpet!',
      database: 'helpet',
    });
  } catch (error) {
    res.send('fail');
  }

  res.send('server testing ok');
});

const schema = buildSchema(`

type Query {
  articles: [ArticlePreview]
  article(aidx: Int): Article
}

type Mutation {
  create_article(input: ArticleInput): [Article]
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

input ArticleInput {
  title: String,
  datetime: String,
  thumbnailUrl: String
}
`);

type Article = {
  id: number;
  title: string;
  datetime: string;
  thumbnailUrl: string;
};

type ArticleInput = {
  title: string;
  datetime: string;
  thumbnailUrl: string;
};

let memDB: Article[] = [
  {
    id: 0,
    title: '0번 타이틀',
    datetime: '2020.12.24',
    thumbnailUrl: 'asdf',
  },
  {
    id: 1,
    title: '1번 타이틀',
    datetime: '2020.12.24',
    thumbnailUrl: 'asdf',
  },
  {
    id: 2,
    title: '2번 타이틀',
    datetime: '2020.12.24',
    thumbnailUrl: 'asdf',
  },
];

const resolver = {
  articles: async () => {
    const result = (await selectArticleList(1)) as any;

    return result.map((item: any) => {
      return { ...item, insert_date: item.insert_date.toString() };
    });
  },
  article: async (input: { aidx: number }) => {
    const { aidx } = input;

    const result = selectArticle(aidx);

    return result;
  },
  create_article: (input: { input: ArticleInput }) => {
    const newIdx = memDB.length + 1;
    const { title, datetime, thumbnailUrl } = input.input;
    console.log({ title, datetime, thumbnailUrl });
    memDB.push({
      id: newIdx,
      title: title,
      datetime: datetime,
      thumbnailUrl: thumbnailUrl,
    });
    return memDB;
  },
};

app.get('/test', (req: Request, res: Response) => {
  res.json({
    id: 2,
    name: 'kelly',
    age: 21,
    job: 'student',
  });
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
  })
);

app.listen(PORT, () => {
  console.log('server running...');
  console.log(`http://localhost:5000/`);
});
