import mysql2, { ResultSetHeader } from 'mysql2/promise';
import rdsSecret from './rdsSecret';
import { RSselectQna, RsSignin } from './types';

const pool = mysql2.createPool(rdsSecret);

const Rs2Obj = (rs: any) => {
  return JSON.parse(JSON.stringify(rs));
};

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

const signin = async (email: string, password: string): Promise<RsSignin> => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const query = `SELECT uidx FROM helpet.user where uid=? and upass=?`;
    const queryArgs = [email, password];

    const [result] = (await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[];
    console.log(result);

    await connection.release();

    resolve(JSON.parse(JSON.stringify(result[0])));
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

const selectQna = async (page = 1, uidx = '%'): Promise<RSselectQna> => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const query = `SELECT * FROM helpet.article WHERE category_code = "500" and insert_uidx like ? LIMIT ?, 10`;
    const queryArgs = [uidx ?? '%', page - 1];
    console.log(queryArgs);
    const [result] = (await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[];
    console.log(result);

    await connection.release();

    resolve(JSON.parse(JSON.stringify(result)));
  });
};

const insertQna = async (input: {
  title: string;
  content: string;
  uidx: string;
}): Promise<ResultSetHeader> => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const { title, content, uidx } = input;

    const query =
      'INSERT INTO `helpet`.`article` ' +
      '(`title`, `content`, `summary`, `thumbnail`, `use_flag`, `count_view`, `count_like`, `insert_uidx`, `category_code`) ' +
      "VALUES (?, ?, '-', '-', 'y', '0', '0', ?, '500')";
    const queryArgs = [title, content, uidx];

    const [result] = (await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[];

    const result2 = JSON.parse(JSON.stringify(result)) as ResultSetHeader;

    console.log(result2);

    await connection.release();

    resolve(result2);
  });
};

const deleteQna = async (
  aidx: string,
  uidx: string
): Promise<ResultSetHeader> => {
  return await new Promise(async (resolve) => {
    const connection = await pool.getConnection();

    const query =
      'DELETE FROM `helpet`.`article` WHERE (`aidx` = ?) and insert_uidx=?';
    const queryArgs = [aidx, uidx];

    const [result] = (await connection.query(
      query,
      queryArgs
    )) as mysql2.RowDataPacket[];

    console.log(result);

    const result2 = Rs2Obj(result) as ResultSetHeader;

    await connection.release();

    resolve(result2);
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
