import mysql2 from 'mysql2/promise';
import rdsSecret from './rdsSecret';
import arrData from './resultContent-result-1609144541085.json}.json';
import { ArticlePreview2 } from './types';

type Content = {
  id: string;
  result: string;
};

const pool = mysql2.createPool(rdsSecret);

const convertArray2Map = (arr: any[]) => {
  const resultMap = arr.reduce((map, cur: Content) => {
    map[cur.id] = cur.result;
    return map;
  }, {});

  return resultMap;
};

const CategoryTable = {
  category_code: 'category_code',
  title: 'title',
};

const insertInitialCetegoryData = async () => {
  const queryString =
    "INSERT INTO `helpet`.`category` (`category_code`, `title`) VALUES ('?', '?')";

  // 건강 행동 음식 훈련
  let data = new Map([
    [100, '강아지'],
    [101, '강아지 건강'],
    [102, '강아지 음식'],
    [103, '강아지 훈련'],
    [200, '고양이'],
    [201, '고양이 건강'],
    [202, '고양이 음식'],
    [203, '고양이 훈련'],
  ]);

  let promiseArr = [];

  data.forEach((value, key) => {
    console.log(queryString.replace('?', key.toString()).replace('?', value));
  });

  // const result = await pool.query(queryString);
  // console.log(result);
};

const insertInitialUserData = async () => {
  const queryString =
    "INSERT INTO `helpet`.`user` (`uid`, `upass`, `uname`, `uemail`, `uaddr`, `uaccount`, `uphone`, `ustate`) VALUES ('?', '?', '?', '?', '?', '?', '?', '?');";
};

const insertInitialArticleData = async () => {
  const queryString =
    "INSERT INTO `helpet`.`article` (`title`, `content`, `summary`, `thumbnail`, `use_flag`, `count_view`, `count_like`, `insert_uidx`, `category_code`) VALUES ('?', '?', '?', '?', 'Y', '0', '0', '1', '?');";

  const insertDog = () => {
    // 강아지 글 load
    const data = require('./result-1609144541085.json');
    const contentData = require('./resultContent-result-1609144541085.json}.json');
    const contentDataMap = convertArray2Map(contentData);

    data.forEach((element: ArticlePreview2) => {
      const { insert_date, summary, thumbnail, title, url } = element;

      const con;
    });

    console.log(data);
  };

  insertDog();
};

// insertInitialCetegoryData();
insertInitialArticleData();
