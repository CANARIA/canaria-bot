# canaria-bot

canariaの開発/運用をアシストするBOTです。

各BOTは各ディレクトリに分かれていて、各BOTにはそれぞれ好きな名前とアイコンを設定できます。

全てのBOTは一つのSlackトークンと紐づくため、Slack上では1ユーザーとして表現されます。

そのため与える引数で呼び出すBOTを制御する方針で開発してください。

## 必須
node >= v8.0(async/awaitを使っているため古いnodeでは動きません)

## ローカルの開発
```bash
# 依存ライブラリのDL
$ npm install

$ export SLACK_TOKEN=xxx-xxxxxxxxxxxxxxxxxxxxxxx
$ export GITHUB_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
$ node index.js
```
