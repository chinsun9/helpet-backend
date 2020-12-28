import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

type Article = {
  aidx: number;
  title: string;
  content: string;
  summary: string;
  thumbnail: string;
  use_flag: string;
  count_view: number;
  count_like: number;
  insert_date: string;
  update_date: string;
  insert_uidx: number;
  category_code: string;
};

type ArticlePreview = {
  title: string;
  summary: string;
  thumbnail: string;
  insert_date: string;
};

type ArticlePreview2 = ArticlePreview & { url: string };

const getArticlePreview = async () => {
  const baseurl = 'https://mypetlife.co.kr/category/%ec%83%9d%ed%99%9c/page/';
  //   const baseurl = 'https://mypetlife.co.kr/category/catlab/page/';
  //   const baseurl = 'https://mypetlife.co.kr/category/doglab/page/';
  let url = [];
  let range = 5;

  const imagesHaveLoaded = () => {
    return Array.from(document.images).every((i) => i.complete);
  };

  for (let index = 1; index < range; index++) {
    url.push(baseurl + index);
  }

  const browser = await puppeteer.launch();
  let articleData: ArticlePreview2[] = [];

  const promiseArr: Promise<ArticlePreview2[]>[] = [];

  url.forEach((urlItem, idx) => {
    const tmp = async () => {
      const page = await browser.newPage();
      console.log(urlItem);
      await page.goto(urlItem, {
        waitUntil: 'networkidle2',
      });
      await page.waitForFunction(imagesHaveLoaded);

      const html = await page.content();
      //   fs.writeFileSync(pathHere('origin' + idx + '.html'), html);

      return getArticleData(html);
    };

    promiseArr.push(tmp());
  });

  await (await Promise.all(promiseArr)).forEach((item) => {
    articleData = articleData.concat(item);
  });

  fs.writeFileSync(
    pathHere(`result-${new Date().getTime()}.json`),
    JSON.stringify(articleData, null, 2)
  );

  await browser.close();
};

/**
 * rename using current file path
 * @param name file name
 */
const pathHere = (name: string) => {
  return path.join(__dirname, name);
};

/**
 * get article data from html stirng
 * @param data html string
 * @returns article preview data ; title, summary, insert_data, thumbnail, url
 */
const getArticleData = (data: string): ArticlePreview2[] => {
  const $ = cheerio.load(data);
  let articlePreview: ArticlePreview2[] = [];

  $('#posts-container')
    .children('li')
    .each((i, el) => {
      console.log(
        i,
        $('.post-thumb img', el).attr('data-lazy-src')?.toString()
      );
      articlePreview.push({
        title: $('.post-title', el).text(),
        summary: $('.post-excerpt', el).text(),
        insert_date: $('.date', el).text(),
        thumbnail: $('.post-thumb img', el).attr('data-lazy-src') as string,
        url: $('.post-title > a', el).attr('href') as string,
      });
    });
  return articlePreview;
};

/**
 * html from file system
 */
const test = async () => {
  // origin.html 파일 읽어서 파싱하는 것 연습
  const html = fs.readFileSync(path.join(__dirname, 'origin.html'), 'utf-8');

  const postData = getArticleData(html);

  fs.writeFileSync(
    path.join(__dirname, 'result.json'),
    JSON.stringify(postData)
  );
};

getArticlePreview();
