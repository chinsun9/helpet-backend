import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import { selectUser, signin } from './utils/myDAO';
import chkSession from './middleware/chkSession';
import graphqlBuildSchema from './utils/graphqlBuildSchema';
import graphqlResolver from './utils/graphqlResolver';
const PORT = process.env.PORT || 5000;

class App {
  public application: express.Application;
  constructor() {
    this.application = express();
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

app.get('/', (res: Response) => {
  res.send('server testing ok');
});

app.post('/signin', async (req: Request, res: Response) => {
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

/**
 * 아래 api 부터는
 * session 있는 사람만 api 사용 가능
 */

app.use(chkSession); // session check middleware

app.get('/user', async (req: Request, res: Response) => {
  const { uidx } = (req.session as any).user;

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

/**
 * 서버 실행
 */

app.listen(PORT, () => {
  console.log('server running...');
  console.log(`http://localhost:${PORT}/`);
});
