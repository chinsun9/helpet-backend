import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { ArticlePreview2 } from './types';

// const fileName = 'result-1613436847800.json'; // 입양 정보
// const fileName = 'result-1613436847800-copy.json'; // 입양 정보 에러난것
const fileName = 'result-1613439167135.json'; // 입양 후기

const pathHere = (name: string) => {
  return path.join(__dirname, name);
};

const readArticleUrl = () => {
  // origin.html 파일 읽어서 파싱하는 것 연습
  const jsonString = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');

  const articleArr = JSON.parse(jsonString) as ArticlePreview2[];

  const urls = articleArr.map((article) => {
    return article.url;
  });

  return urls;
};

const testGetOneArticleContent = async () => {
  //   const urls = readArticleUrl();
  const urlItem =
    'https://mypetlife.co.kr/wiki/%ea%b0%95%ec%95%84%ec%a7%80-%ec%83%90%eb%9f%ac%eb%a6%ac-%eb%a8%b9%ec%96%b4%eb%8f%84-%eb%90%98%eb%82%98%ec%9a%94-%ec%9e%8e%ec%9d%80-%eb%a8%b9%ec%9d%b4%eb%a9%b4-%ec%95%88-%eb%8f%bc%ec%9a%94/';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(urlItem, {
    waitUntil: 'networkidle2',
  });

  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html);

  const result = $('.entry-content').html();

  console.log(result);
};

const getArticlesContent = async () => {
  const urls = readArticleUrl();
  const browser = await puppeteer.launch();

  let promiseArr: Promise<{ id: string; result: string | null }>[] = [];

  urls.forEach((url) => {
    const getContentPromise = async () => {
      const page = await browser.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      const html = await page.content();

      let $ = cheerio.load(html);
      $ = cheerio.load($('.board-content-wrap').html() as string);

      const rawHTML = $('.board-content').html() as string;
      // 전처리 필요없는 태그 제거
      const result = rawHTML.trim().split('<!-- content end -->')[0].trim();

      return { id: url, result: result };
    };

    promiseArr.push(getContentPromise());
  });

  const result = await Promise.all(promiseArr);
  await browser.close();

  fs.writeFileSync(
    pathHere(`resultContent-${fileName}`),
    JSON.stringify(result, null, 2)
  );
};

// testGetOneArticleContent();
getArticlesContent();
