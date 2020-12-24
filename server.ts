import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';

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

app.get('/data/1', (req: Request, res: Response) => {
  res.json({
    id: 1,
    name: 'pepper',
    age: 26,
    job: 'developer',
  });
});

app.get('/data/2', (req: Request, res: Response) => {
  res.json({
    id: 2,
    name: 'kelly',
    age: 21,
    job: 'student',
  });
});

const schema = buildSchema(`

type Query {
  articles: [Article]
  article(id: Int): Article
}

type Mutation {
  create_article(input: ArticleInput): [Article]
}

type Article {
  id: Int,
  title: String,
  datetime: String,
  thumbnailUrl: String
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
  articles: () => {
    return memDB;
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
