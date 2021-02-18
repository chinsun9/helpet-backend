import mysql2 from 'mysql2/promise';
import rdsSecret from '../../rdsSecret';
import { ArticlePreview2 } from '../../types';
import moment from 'moment';

type Content = {
  id: string;
  result: string;
};

const convertArray2Map = (arr: any[]) => {
  return new Map(
    arr.map((cur: Content) => {
      return [cur.id, cur.result];
    })
  );
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
    "INSERT INTO `helpet`.`article` (`title`, `content`, `summary`, `thumbnail`, `use_flag`, `count_view`, `count_like`, `insert_uidx`, `category_code`,`insert_date`) VALUES (?, ?, ?, ?, 'Y', '0', '0', '1', ?, ?)";

  const insertDog = async () => {
    // 강아지 글 load
    const data = require('./result-1609144541085.json') as ArticlePreview2[];
    const contentData = require('./resultContent-result-1609144541085.json}.json');
    const contentDataMap = convertArray2Map(contentData);

    function getRandomArbitrary(min: number, max: number) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    const databaseConnection = await mysql2
      .createPool(rdsSecret)
      .getConnection();

    for (const element of data) {
      const { insert_date, summary, thumbnail, title, url } = element;
      const category_code = `10${getRandomArbitrary(0, 4)}`;
      const content = contentDataMap.get(url);

      let mySqlDate = '';
      // rds는 utc기준
      if (insert_date.length < 11) {
        mySqlDate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      } else {
        mySqlDate = moment(insert_date, 'YYYY년 MM월 DD일')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss');
      }

      // console.info(category_code, mySqlDate);

      try {
        const a = await databaseConnection.query(queryString, [
          title,
          content,
          summary,
          thumbnail,
          category_code.toString(),
          mySqlDate,
        ]);
        console.log('ok');
      } catch (error) {
        console.log('fail', [
          title,
          content,
          summary,
          thumbnail,
          category_code.toString(),
          mySqlDate,
        ]);
      }

      // console.log([title, content, summary, category_code]);
    }

    return 1;
  };

  const result = await insertDog();
  console.log('Rmx', result);
};

// insertInitialCetegoryData();
insertInitialArticleData();
