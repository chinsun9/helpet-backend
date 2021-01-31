import fs from 'fs';

const config = {
  host: 'rdsinstance.cmnkfayymxyz.ap-northeast-2.rds.amazonaws.com',
  user: 'helpetuser2',
  password: '5uperhelpet!',
  database: 'helpet',
  ssl: {
    ca: fs.readFileSync(process.cwd() + '/rds-ca-2019-root.pem', 'utf-8'),
  },
};

export default config;
