import mysql2 from 'mysql2/promise';
import rdsSecret from './rdsSecret';
import { ArticlePreview } from './types';

const pool = mysql2.createPool(rdsSecret);

const selectArticleList = async (
  page: number,
  category_code = '%',
  keyword = '%'
) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();
    console.log(page, category_code);

    const query = `SELECT aidx, title, summary, thumbnail, count_view, count_like, insert_date, update_date, insert_uidx, category_code  FROM helpet.article WHERE category_code LIKE ? AND title LIKE ? ORDER BY aidx DESC LIMIT ?, ?`;
    const queryArgs = [category_code, keyword, 10 * (page - 1), 3];

    const result = ((await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[][])[0];
    console.log(result);

    await connection.release();

    resolve(result);
  });
};

const selectArticle = (aidx: number) => {
  const query = `SELECT * FROM helpet.article WHERE aidx = ?`;
  const queryArgs = [aidx];

  //   return databaseConnection.query(query, queryArgs);
};

export { pool, selectArticle, selectArticleList };
