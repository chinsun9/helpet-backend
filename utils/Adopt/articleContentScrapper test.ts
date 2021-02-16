import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { ArticlePreview2 } from './types';

const getContentPromise = async () => {
  const html = `	<div class="board-content line-b">
  <br><div style="text-align: center;"><img style="width: 960px; height: 1280px;" alt="KakaoTalk_20191106_184117280.jpg" src="http://saac.kr/data/file/iywHWob4AJ.jpg"></div><div style="text-align: center;">입양자분이 앙꼬 입양날을 생일로 정하셨다네요~</div><div style="text-align: center;">생일상을 받는 앙꼬 표정이 너무 뿌듯해 보여요^^</div><br><!-- content end -->													<div>
          <div style="margin-top:50px;text-align:right;">
              <a href="javascript:;" onclick="sendTwitter('초코는 앙꼬가 되어서 살고 있어요^^', '');" title="트위터"><img src="/images/default/common/icon_twitter.gif" title="트위터"></a>
              <a href="javascript:;" onclick="sendFaceBook('초코는 앙꼬가 되어서 살고 있어요^^', '');" title="페이스북"><img src="/images/default/common/icon_facebook.gif" title="페이스북"></a>						
          </div>
      </div>
                      </div>
                      <div class="file-wrap">
      <div class="file-th">
          <span>첨부파일</span>
      </div>
      <div class="file-td">
          <ol class="file-list">
                                                      <li>
                      <a href="/?act=common.download_act&amp;file_path=DWhXbl0zU3IFMQUoA3lcKFI2ATUGWVZgXiQDGlY0AD9WMAc%2BCVIDMQA8UTgJXwQ3UWdQZwE4UWVSNlMxAjcBCg07VzldZlMxBWQFMAM4XGVSZAEpBmxWI15s&amp;bbs_seq=BzICbQg1" target="download">KakaoTalk_20191106_184117280.jpg</a>
                      <span class="file-download-cnt"><font class="fs_11">다운로드횟수[146]</font><span>
                  </span></span></li>
                                              
      </ol></div>
  </div>`;

  const $ = cheerio.load(html);
  const result = $('.board-content').html() as string;
  console.log(result);

  console.log('--------------------------');
  console.log($('div:last-child').remove());

  console.log($('.board-content').html());

  // 전처리 필요없는 태그 제거
  //   console.log(result);

  //   return { id: url, result: result };
};

getContentPromise();
