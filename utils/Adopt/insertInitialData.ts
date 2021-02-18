import mysql2 from 'mysql2/promise';
import rdsSecret from './../rdsSecret';
import { ArticlePreview2 } from './types';
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

  // 입양 정보 사이트 카테코리 추가
  let data = new Map([
    [300, '입양 정보'],
    [400, '입양 후기'],
  ]);

  const a = Array.from(data).map(([key, value]) => {
    return queryString.replace('?', key.toString()).replace('?', value);
  });

  const databaseConnection = await mysql2.createPool(rdsSecret).getConnection();

  for (const insertQuery of a) {
    console.log(insertQuery);
    const result = await databaseConnection.query(insertQuery);
    console.log(result);
  }
  databaseConnection.end();
};

const insertInitialArticleData = async () => {
  const queryString =
    "INSERT INTO `helpet`.`article` (`title`, `content`, `summary`, `thumbnail`, `use_flag`, `count_view`, `count_like`, `insert_uidx`, `category_code`,`insert_date`) VALUES (?, ?, ?, ?, 'Y', '0', '0', '1', ?, ?)";

  const insertData = async (category_code: number, dataFilePath: string) => {
    // 강아지 글 load
    const data = require('./' + dataFilePath) as ArticlePreview2[];
    const contentData = require('./resultContent-' + dataFilePath);
    const contentDataMap = convertArray2Map(contentData);

    const databaseConnection = await mysql2
      .createPool(rdsSecret)
      .getConnection();

    for (const element of data) {
      const { insert_date, summary, thumbnail, title, url } = element;
      const content = contentDataMap.get(url);

      let mySqlDate = '';

      // rds는 utc기준
      mySqlDate = moment(insert_date, 'YYYY.MM.DD')
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');

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
    }

    databaseConnection.release();
    databaseConnection.end();

    return 1;
  };

  // 입양정보 삽입
  // const result = await insertData(300, 'result-1613436847800.json');

  // 입양후기 삽입
  const result = await insertData(400, 'result-1613439167135.json');
  console.log('Rmx', result);
};

/**
 * -----------------------------------------------------------------------------------
 * 코드 실행
 * -----------------------------------------------------------------------------------
 */

// insertInitialCetegoryData();
insertInitialArticleData();
