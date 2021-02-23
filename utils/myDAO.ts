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

const selectUser = async (uidx: number) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM helpet.user where uidx=?`;
    const queryArgs = [uidx];

    const result = ((await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[][])[0][0];
    console.log(result);

    await connection.release();

    resolve(result);
  });
};

const selectQna = async (page?: number) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM helpet.article WHERE category_code = "500" LIMIT 0, 10;`;

    const result = ((await connection.query(
      query
    )) as mysql2.RowDataPacket[][])[0][0];
    console.log(result);

    await connection.release();

    resolve(result);
  });
};

const insertQna = async (input: any) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const { title, content, uidx } = input;

    const query =
      'INSERT INTO `helpet`.`article` ' +
      '(`title`, `content`, `summary`, `thumbnail`, `use_flag`, `count_view`, `count_like`, `insert_uidx`, `category_code`) ' +
      "VALUES (?, ?, '-', '-', 'y', '0', '0', ?, '500')";
    const queryArgs = [title, content, uidx];

    const result = ((await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[][])[0];

    console.log(result);

    await connection.release();

    resolve(result);
  });
};

const deleteQna = async (aidx: any) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const query = 'DELETE FROM `helpet`.`article` WHERE (`aidx` = ?)';
    const queryArgs = [aidx];

    const result = ((await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[][])[0];

    console.log(result);

    await connection.release();

    resolve(result);
  });
};

const updateQna = async (input: any) => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const { title, content, aidx } = input;
    console.log(input);
    const query =
      'UPDATE `helpet`.`article` SET `title` = ?, `content` = ? WHERE (`aidx` = ?)';
    const queryArgs = [title, content, aidx];

    const result = ((await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[][])[0];

    console.log(result);

    await connection.release();

    resolve(result);
  });
};

export {
  pool,
  selectArticle,
  selectArticleList,
  signin,
  selectUser,
  selectQna,
  insertQna,
  deleteQna,
  updateQna,
};
