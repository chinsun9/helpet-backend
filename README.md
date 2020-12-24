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

// 생성하기
mutation {
  create_article (input: {
    title: "new번 타이틀",
    datetime: "2020.12.24",
    thumbnailUrl: "asdf",
  })
}

```
