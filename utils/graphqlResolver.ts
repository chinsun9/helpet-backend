import { selectArticle, selectArticleList } from './myDAO';

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

export default {
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
