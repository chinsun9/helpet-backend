# helpet backend

- https://krpeppermint100.medium.com/devops-react-express-%EC%95%B1-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-netlify-heroku-b238e057d920 따라하기

## 개요

- express typescript
- Heroku 와 Netlify 를 사용해 무료 배포
- Heroku ; backend 배포시
- Netlify ; frontend 배포시

## setup

### node

```
// 패키지 설치
yarn add express cors
yarn add -D @types/express @types/cors ts-node typescript

// name, version 등 package.json 정보 추가
yarn init -y

// tsconfig.json ; 타입스크립트 설정 파일 추가
npx tsc --init
```

### Heroku CLI install

- https://devcenter.heroku.com/articles/heroku-cli
- 위 링크에서 자신의 OS에 맞게 설치파일 설치 및 실행

* 윈도우 64bit
  - https://cli-assets.heroku.com/heroku-x64.exe

### Netlify CLI install

- https://docs.netlify.com/cli/get-started/
- npm 명령으로 다운 받을 수 있다.

```
// netlify cli 전역설치
npm install netlify-cli -g

// 로그인
netlify login
```

### Heroku setup

- https://dashboard.heroku.com/apps
- 대시 보드 접속

* Create new app
* 리전은 `US`으로 선택

- 완료하면 아래와같이 cli 명령이 나오는데 앞으로 참고한다.

```
$ heroku login
Create a new Git repository
Initialize a git repository in a new or existing directory

$ cd my-project/
$ git init
$ heroku git:remote -a helpet-backend
Deploy your application
Commit your code to the repository and deploy it to Heroku using Git.

$ git add .
$ git commit -am "make it better"
$ git push heroku master
```

터미널 명령어

```
// heroku cli login
// q를 제외한 아무 키나 입력하면 브라우저가 열리면서 로그인하면 성공
heroku login

// 위에 헤로쿠 사이트에서 알려준 터미널 명령으 참고해서 작성한다
// heroku 리모트 설정
heroku git:remote -a helpet-backend

// heroku commit
git commit -am "make it better"

// heroku push (deploy)
// 푸쉬하면 url을 준다.
// https://helpet-backend.herokuapp.com/
git push heroku master

// 근데 Application error 화면을 보게될 것이다.
// 에러로그를 확인하니까 ts-node 등 devdependencies를 참조하지 못하면서 생기는 에러 였다.
// heroku config NPM_CONFIG_PRODUCTION 를 false로 설정한다.
// 참고; https://ko.nuxtjs.org/faq/heroku-deployment/
heroku config:set NPM_CONFIG_PRODUCTION=false
```

## graphQL 사용해보기

- https://www.youtube.com/watch?v=EkWI6Ru8lFQ

### setup

```
// 조회하기
{
    articles {
        id,
        title,
      },
}

{
    article(aidx: 112) {
        aidx,
        title,
      },
}


// 생성하기
mutation {
  create_article (input: {
    title: "new번 타이틀",
    datetime: "2020.12.24",
    thumbnailUrl: "asdf",
  })
}

```

## ERD

![erd 2](/docs/erd/2.png)

- https://aquerytool.com/
- tag 스키마 짤 때 참고 ; https://stackoverflow.com/questions/20856/recommended-sql-database-design-for-tags-or-tagging

## RDS 셋업

```sql
-- 데이터베이스 생성
CREATE DATABASE helpet;

-- 유저 생성
-- DROP user 'helpetuser'@'%'  ;
CREATE USER 'helpetuser' @'%' IDENTIFIED BY '5uperhelpet!';
GRANT ALL PRIVILEGES ON helpet.* TO 'helpetuser' @'%' WITH GRANT OPTION;
SHOW GRANTS FOR 'helpetuser' @'%';

-- 수정사항 반영
FLUSH PRIVILEGES;
```

```sql setup.sql

-- 테이블 순서는 관계를 고려하여 한 번에 실행해도 에러가 발생하지 않게 정렬되었습니다.

-- user Table Create SQL
CREATE TABLE user
(
    `uidx`           INT            NOT NULL    AUTO_INCREMENT COMMENT '유저 인덱스',
    `uid`            VARCHAR(20)    NOT NULL    COMMENT '아이디',
    `upass`          VARCHAR(20)    NOT NULL    COMMENT '비밀번호',
    `uname`          VARCHAR(30)    NOT NULL    COMMENT '이름',
    `uemail`         VARCHAR(30)    NOT NULL    COMMENT '이메일',
    `uaddr`          VARCHAR(50)    NULL        COMMENT '주소',
    `uaccount`       VARCHAR(20)    NULL        COMMENT '계좌',
    `uphone`         VARCHAR(15)    NULL        COMMENT '전화번호',
    `ustate`         CHAR(1)        NULL        COMMENT '유저 타입, 탈퇴 여부 등',
    `u_insert_date`  TIMESTAMP      NULL        DEFAULT CURRENT_TIMESTAMP   COMMENT '회원가입일',
    PRIMARY KEY (uidx)
);

ALTER TABLE user
    ADD CONSTRAINT UC_uid UNIQUE (uid);


-- user Table Create SQL
CREATE TABLE product
(
    `pidx`        INT             NOT NULL    AUTO_INCREMENT COMMENT '상품 인덱스',
    `pname`       VARCHAR(150)    NOT NULL    COMMENT '상품명',
    `content`     TEXT            NOT NULL    COMMENT '내용',
    `summary`     VARCHAR(150)    NOT NULL    COMMENT '개요',
    `thumbnail`   VARCHAR(100)    NULL        COMMENT '썸네일',
    `use_flag`    CHAR(1)         NOT NULL    COMMENT '사용 플래그',
    `count_view`  INT             NOT NULL    COMMENT '조회수',
    `price`       INT             NOT NULL    COMMENT '가격',
    `uidx`        INT             NOT NULL    COMMENT '유저 인덱스',
    PRIMARY KEY (pidx)
);

ALTER TABLE product
    ADD CONSTRAINT FK_product_uidx_user_uidx FOREIGN KEY (uidx)
        REFERENCES user (uidx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- user Table Create SQL
CREATE TABLE article
(
    `aidx`         INT             NOT NULL    AUTO_INCREMENT COMMENT '글 인덱스',
    `title`        VARCHAR(150)    NOT NULL    COMMENT '제목',
    `content`      TEXT            NOT NULL    COMMENT '내용',
    `summary`      VARCHAR(150)    NOT NULL    COMMENT '개요',
    `thumbnail`    VARCHAR(100)    NULL        COMMENT '썸네일',
    `use_flag`     CHAR(1)         NOT NULL    COMMENT '사용 플래그',
    `count_view`   INT             NOT NULL    COMMENT '조회수',
    `count_like`   INT             NOT NULL    COMMENT '좋아요수',
    `insert_date`  TIMESTAMP       NOT NULL    DEFAULT CURRENT_TIMESTAMP    COMMENT '등록일',
    `update_date`  TIMESTAMP       NOT NULL    DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP  COMMENT '수정일',
    `insert_uidx`  INT             NOT NULL    COMMENT '유저 인덱스',
    PRIMARY KEY (aidx)
);

ALTER TABLE article
    ADD CONSTRAINT FK_article_insert_uidx_user_uidx FOREIGN KEY (insert_uidx)
        REFERENCES user (uidx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- user Table Create SQL
CREATE TABLE `order`
(
    `oidx`         INT            NOT NULL    AUTO_INCREMENT COMMENT '주문 인덱스',
    `insert_date`  TIMESTAMP      NOT NULL    DEFAULT CURRENT_TIMESTAMP   COMMENT '주문일',
    `uaddr`        VARCHAR(50)    NOT NULL    COMMENT '배송지',
    `total_price`  INT            NOT NULL    COMMENT '총 가격',
    `uidx`         INT            NOT NULL    COMMENT '주문 유저',
    PRIMARY KEY (oidx)
);

ALTER TABLE `order`
    ADD CONSTRAINT FK_order_uidx_user_uidx FOREIGN KEY (uidx)
        REFERENCES user (uidx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- user Table Create SQL
CREATE TABLE articleTag
(
    `aidx`  INT            NOT NULL    COMMENT '글 인덱스',
    `tag`   VARCHAR(50)    NOT NULL    COMMENT '태그명',
    PRIMARY KEY (aidx, tag)
);

ALTER TABLE articleTag
    ADD CONSTRAINT FK_articleTag_aidx_article_aidx FOREIGN KEY (aidx)
        REFERENCES article (aidx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- user Table Create SQL
CREATE TABLE basket
(
    `pidx`   INT    NOT NULL    COMMENT '상품 인덱스',
    `uidx`   INT    NOT NULL    COMMENT '유저 인덱스',
    `count`  INT    NOT NULL    COMMENT '수량',
    PRIMARY KEY (pidx, uidx)
);

ALTER TABLE basket
    ADD CONSTRAINT FK_basket_pidx_product_pidx FOREIGN KEY (pidx)
        REFERENCES product (pidx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE basket
    ADD CONSTRAINT FK_basket_uidx_user_uidx FOREIGN KEY (uidx)
        REFERENCES user (uidx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- user Table Create SQL
CREATE TABLE review
(
    `pidx`    INT     NOT NULL    COMMENT '상품 인덱스',
    `uidx`    INT     NOT NULL    COMMENT '유저 인덱스',
    `rating`  INT     NOT NULL    COMMENT '별점',
    `review`  TEXT    NOT NULL    COMMENT '리뷰',
    PRIMARY KEY (pidx, uidx)
);

ALTER TABLE review
    ADD CONSTRAINT FK_review_pidx_product_pidx FOREIGN KEY (pidx)
        REFERENCES product (pidx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE review
    ADD CONSTRAINT FK_review_uidx_user_uidx FOREIGN KEY (uidx)
        REFERENCES user (uidx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- user Table Create SQL
CREATE TABLE orderSet
(
    `oidx`   INT            NOT NULL    COMMENT '주문 인덱스',
    `pidx`   INT            NOT NULL    COMMENT '상품 인덱스',
    `count`  VARCHAR(45)    NOT NULL    COMMENT '수량',
    PRIMARY KEY (oidx, pidx)
);

ALTER TABLE orderSet
    ADD CONSTRAINT FK_orderSet_pidx_product_pidx FOREIGN KEY (pidx)
        REFERENCES product (pidx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE orderSet
    ADD CONSTRAINT FK_orderSet_oidx_order_oidx FOREIGN KEY (oidx)
        REFERENCES `order` (oidx) ON DELETE RESTRICT ON UPDATE RESTRICT;



```

- `order` 테이블의 이름이 sql에서 사용되는 키워드라서 ` 를 감싸줘야한다.

### 1차 수정 ; 카테고리 테이블 추가

```sql 카테고리 추가
-- 카테고리 테이블 생성
CREATE TABLE category
(
    `category_code`  VARCHAR(3)     NOT NULL    COMMENT '카테고리 코드',
    `title`          VARCHAR(20)    NULL        COMMENT '카테고리명',
    PRIMARY KEY (category_code)
);

-- 아티클 테이블에 카테고리코드 속성 추가
ALTER TABLE
    article
ADD
    category_code varchar(3) NOT NULL;

-- 외래키 속성 추가
ALTER TABLE article
    ADD CONSTRAINT FK_article_category_code_category_category_code FOREIGN KEY (category_code)
        REFERENCES category (category_code) ON DELETE RESTRICT ON UPDATE RESTRICT;
```

- 글에 카테고리 속성을 넣지 않은게 생각나서 추가해주었다.
- 카테고리는 크게 대분류과 소분류로 구분된다.
- 그렇게 많은 카테고리 분류를 가지지 않을 것같아서
- 100의 자리는 대분류를 나타내고
- 1의 자리는 소분류를 나타내도록 설계했다.
- 대분류는 강아지100, 고양이200으로 하였고
- 소분류는 건강01, 행동02, 음식03, 훈련04로 하였다.

### 2차 수정 ; thumbnail 크기 확대

```sql
ALTER TABLE `helpet`.`article`
CHANGE COLUMN `thumbnail` `thumbnail` VARCHAR(300) NULL DEFAULT NULL COMMENT '썸네일' ;
```

- 100 에서 300으로 확대.
- 스크랩한 url들을 확인하니까 100이 넘는 것들이 많이 있음...

## 목업데이터 생성용 웹 스크래퍼 만들기

- 참고 ; https://www.youtube.com/watch?v=M_Rn3Y3Z4Mo
- utils/scrapper.ts

### setup

```
// 동적 웹 사이트에서 데이터를 추출
yarn add puppeteer
yarn add @types/puppeteer -D

// dom parser with selector
yarn add cheerio
```

### 관련 소스

- utils/
  - scrapper.ts ; 게시글 목록에서 미리보기 긇어오기
  - articleContentScrapper.ts ; 긇어온 게시글 목록의 내용에 해당하는 부분을 긁어옴
  - insertInitialData.ts ; 작성중 ; rds에 긁어온 데이터 삽입하기

## RDS 보안 설정

- ssl 통한 보안

```sql
-- 유저가 ssl을 사용하도록 수정
CREATE USER 'helpetuser' @'%' IDENTIFIED BY '5uperhelpet!' REQUIRE SSL;
GRANT ALL PRIVILEGES ON helpet.* TO 'helpetuser' @'%' WITH GRANT OPTION;
SHOW GRANTS FOR 'helpetuser' @'%';
FLUSH PRIVILEGES;

```

```
heroku config:set NPM_CONFIG_PRODUCTION=false

heroku config:set DATABASE_URL="mysql2://helpetuser2:5uperhelpet!@%/helpet?sslca=rds-ca-2019-root.pem" -a helpet-backend
```

-

## heroku push 문제

```

C:\git\helpet-backend>git push heroku master
To https://git.heroku.com/helpet-backend.git
 ! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to 'https://git.heroku.com/helpet-backend.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

- 이런 에러가 뜨면 `git pull heroku master` 하면된다
