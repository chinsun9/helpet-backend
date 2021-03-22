import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import {
  selectUser,
  signin,
  selectQna,
  insertQna,
  deleteQna,
  updateQna,
  countArticles,
} from './utils/myDAO';
import chkSession from './middleware/chkSession';
import graphqlBuildSchema from './utils/graphqlBuildSchema';
import graphqlResolver from './utils/graphqlResolver';
const PORT = process.env.PORT || 5005;

class App {
  public application: express.Application;
  constructor() {
    this.application = express();
  }
}

// 세션 데이터 커스텀
declare module 'express-session' {
  interface SessionData {
    user: {
      uidx: number;
    };
  }
}
const app = new App().application;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
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
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlBuildSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('server testing ok');
});

app.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ msg: 'fail' });
  }

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

    req.session.user = result;

    res.json({
      msg: 'good',
      ...result,
      session: req.session,
    });
  });
});

app.get('/sessionChk', (req: Request, res: Response) => {
  if (req.session.user) {
    res.json({
      msg: 'good',
      session: req.session,
    });
    return;
  }

  res.json({
    msg: 'no session',
    session: req.session,
  });
});

app.post('/signout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  res.json({
    msg: 'bye',
    session: req.session,
  });
});

/**
 * qna
 */

app.get('/qna/', async (req: Request, res: Response) => {
  let { page, uidx } = req.query;
  console.log(req.query);
  page = (page ?? 1) as string;
  uidx = (uidx ?? '%') as string;
  const result = await selectQna(+page, uidx);

  res.json({
    result: result,
  });
});

/**
 * 카테고리별 글 개수 가져오기
 */

app.get('/articleTotalCount', async (req: Request, res: Response) => {
  let { category_code } = req.query;
  console.log(req.query);
  const result = await countArticles(category_code as string);

  res.json({
    result,
  });
});

/**
 * 아래 api 부터는
 * session 있는 사람만 api 사용 가능
 */

app.use(chkSession); // session check middleware

app.get('/user', async (req: Request, res: Response) => {
  const uidx = req.session.user?.uidx as number;

  const result = await selectUser(uidx);

  if (!result) {
    res.json({
      msg: 'fail',
    });
    return;
  }

  res.json({
    msg: 'good',
    user: result,
  });
});

// qna

app.post('/qna/', async (req: Request, res: Response) => {
  const { input } = req.body;
  input.uidx = `${req.session.user?.uidx}`;

  const { title, content, uidx } = input;
  if (!title || !content || !uidx) {
    return res.json({ msg: 'fail' });
  }

  const result = await insertQna(input);

  res.json({
    msg: result.affectedRows > 0 ? 'good' : 'fail',
    result: result,
  });
});

app.delete('/qna/', async (req: Request, res: Response) => {
  const { aidx } = req.body;

  const uidx = req.session.user?.uidx + '';

  if (!aidx || !uidx) {
    return res.json({ msg: 'fail' });
  }

  const result = await deleteQna(aidx, uidx);

  res.json({
    msg: result.affectedRows > 0 ? 'good' : 'fail',
    result: result,
  });
});

app.put('/qna/', async (req: Request, res: Response) => {
  const { input } = req.body;
  const uidx = req.session.user?.uidx + '';

  input.uidx = uidx;

  const { aidx, content, title } = input as {
    title: string;
    content: string;
    uidx: string;
    aidx: number;
  };

  if (!title || !content || !aidx) {
    return res.json({ msg: 'fail' });
  }

  const result = await updateQna(input);

  res.json({
    msg: result.affectedRows > 0 ? 'good' : 'fail',
    result: result,
  });
});

/**
 * 서버 실행
 */

app.listen(PORT, () => {
  console.log('server running...');
  console.log(`http://localhost:${PORT}/`);
});
