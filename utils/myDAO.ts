import mysql2 from 'mysql2/promise';
import rdsSecret from './rdsSecret';

const pool = mysql2.createPool(rdsSecret);

const selectArticleList = async (
  page = 1,
  category_code = '%',
  keyword = '%',
  size = 10
) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();
    console.log(page, category_code, keyword, size);

    const query = `SELECT aidx, title, summary, thumbnail, count_view, count_like, insert_date, update_date, insert_uidx, category_code  FROM helpet.article WHERE category_code LIKE ? AND title LIKE ? ORDER BY aidx DESC LIMIT ?, ?`;
    const queryArgs = [category_code, `%${keyword}%`, size * (page - 1), size];

    const result = ((await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[][])[0];
    console.log(result);

    await connection.release();

    resolve(result);
  });
};

const selectArticle = async (aidx: number) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const query = `SELECT aidx, title, summary, content, thumbnail, count_view, count_like, insert_date, update_date, insert_uidx, category_code  FROM helpet.article WHERE aidx = ?`;
    const queryArgs = [aidx];

    const result = ((await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[][])[0][0];
    console.log(result);

    await connection.release();

    resolve({ ...result, insert_date: result.insert_date.toString() });
  });
};

const signin = async (email: string, password: string) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const query = `SELECT uidx FROM helpet.user where uid=? and upass=?`;
    const queryArgs = [email, password];

    const result = ((await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[][])[0][0];
    console.log(result);

    await connection.release();

    resolve(result);
  });
};

export { pool, selectArticle, selectArticleList, signin };
