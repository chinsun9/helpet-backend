import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import { selectArticleList, selectArticle, signin } from './utils/myDAO';
import mysql2 from 'mysql2/promise';
import fs from 'fs';

const PORT = process.env.PORT || 5000;

var corsOptions = {
  origin: true, // Allow-origin-access-origin
  credentials: true, // Allow-origin-access-credential
};

class App {
  public application: express.Application;
  constructor() {
    this.application = express();
  }
}

const app = new App().application;

let sess;

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: '@#@secret@#@',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('server testing ok');
  sess = req.session;

  console.log('Session is here >>>', sess);
});

app.get('/helpetuser2', async (req: Request, res: Response) => {
  let r = '';
  try {
    const pool = await mysql2.createPool({
      host: 'rds.cmnkfayymxyz.ap-northeast-2.rds.amazonaws.com',
      user: 'helpetuser2',
      password: '5uperhelpet!',
      database: 'helpet',
      ssl: {
        ca: fs.readFileSync(__dirname + '/rds-ca-2019-root.pem', 'utf-8'),
      },
    });
    await pool.getConnection();
    r = ' superpower';
  } catch (error) {
    res.send('fail' + error);
  }

  res.send('server testing ok123123' + r);
});

const schema = buildSchema(`

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

type UserInput = {
  email: String;
  password: String;
  cookie: String;
};

type User = {
  id: Number;
  email: String;
  password: String;
  cookie: String;
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

let userDB: User[] = [];

const resolver = {
  articles: async () => {
    const result = (await selectArticleList(1)) as any;

    return result.map((item: any) => {
      return { ...item, insert_date: item.insert_date.toString() };
    });
  },
  articlesv2: async (input: {
    keyword?: string;
    category_code?: string;
    page?: number;
    size?: number;
  }) => {
    const { keyword, category_code, page, size } = input;

    const result = (await selectArticleList(
      page,
      category_code,
      keyword,
      size
    )) as any;

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
  user: () => {
    return {
      id: '1',
      email: 'test@naver.com',
      password: '1234',
    };
  },
  create_user: (input: { input: UserInput }) => {
    const newIdx = userDB.length + 1;
    const { email, password, cookie } = input.input;
    console.log({ email, password, cookie });
    userDB.push({
      id: newIdx,
      email: email,
      password: password,
      cookie: cookie,
    });
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

app.post('/login', (req: Request, res: Response) => {
  sess = req.session;

  res.cookie('choco', '1');

  console.log('SESSION >>', req.session);
  console.log('BODY >>', req.body);
  console.log('COOKIE >>', req.cookies);

  res.send('cookie');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
  })
);

app.post('/signin', async (req: Request, res: Response) => {
  console.log(req.body);

  const { email, password } = req.body;

  const result = await signin(email, password);

  if (!result) {
    res.json({
      msg: 'fail',
    });
    return;
  }

  console.log(req.session.id);
  const prevSID = req.session.id;

  // 세션 갱신
  req.session.regenerate((err) => {
    if (err) {
      console.log(err);
      return;
    }

    (req.session as any).user = result;

    res.json({
      msg: 'good',
      ...(result as Object),
      session: req.session,
      pSID: prevSID,
    });
  });
});

app.get('/user', (req: Request, res: Response) => {
  res.json({
    msg: 'good',
    session: req.session.id,
  });
});

app.get('/sessionChk', (req: Request, res: Response) => {
  if ((req.session as any).user) {
    res.json({
      msg: 'good',
      session: req.session.id,
    });
    return;
  }

  res.json({
    msg: 'no session',
    session: req.session.id,
  });
});

app.get('/sessionGet', (req: Request, res: Response) => {
  req.session.regenerate((err) => {
    if (err) {
      console.log(err);
      return;
    }

    (req.session as any).user = { uidx: 99999 };

    res.json({
      msg: 'good',
      session: req.session,
    });
  });
});

app.get('/signout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  res.json({
    msg: 'good',
    session: req.session.id,
  });
});

app.listen(PORT, () => {
  console.log('server running...');
  console.log(`http://localhost:5000/`);
});
