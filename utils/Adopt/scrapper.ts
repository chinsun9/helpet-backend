import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { ArticlePreview2 } from './types';

/**
 *
 */
const getArticlePreview = async () => {
  // http://saac.kr/?act=board&bbs_code=sub2_1&bbs_mode=list&page=2

  const baseurl =
    'http://saac.kr/?act=board&bbs_code=sub2_1&bbs_mode=list&page=';
  let url = [];
  let range = 3;

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

  $('#subContents > div.content-wrap > div.webzine-list')
    .children('div')
    .each((i, el) => {
      console.log(i);
      articlePreview.push({
        title: $('div.webzine-content-right > h3 > a', el).text(),
        summary: $('div.webzine-content-right > p > a', el).text(),
        insert_date: $('div.webzine-content-right > div', el)
          .text()
          .split(' | ')[1],
        thumbnail: (`http://saac.kr` +
          $('div.webzine-content-left.text-center > a > img', el).attr(
            'src'
          )) as string,
        url: (`http://saac.kr` +
          $('div.webzine-content-right > p > a', el).attr('href')) as string,
      });
    });
  return articlePreview;
};

getArticlePreview();
