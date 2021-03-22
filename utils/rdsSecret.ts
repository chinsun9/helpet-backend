import fs from 'fs';

const config = {
  host: 'rdsname.asdf.ap-northeast-2.rds.amazonaws.com',
  user: 'username',
  password: 'password',
  database: 'helpet',
  ssl: {
    ca: fs.readFileSync(process.cwd() + '/rds-ca-2019-root.pem', 'utf-8'),
  },
};

export default config;
