---
title: 用express搭建一個服務器(一)
date: 2021-4-20
categories:
 -  後端
tags:
 - Node.js
 - express
---
## 準備

```sh
yarn init

$ mkdir src         # 新建 src 目录存放核心逻辑
$ mkdir public      # 新建 public 目录存放静态资源
yarn add express  	# 本地安装 Express

. 					# 目錄結構
├── package.json
├── public
└── src
└── server.js
```

## 静态服务

我們首先建立一個静態資源服务器，嘗試向客戶端響應 `public` 裡的静態資源。

```javascript
// src/server.js
const express = require('express'); 
const { resolve } = require('path');
const { promisify } = require('util');

const server = express();
const port = parseInt(process.env.PORT || '3000');  //定義端口
const publicDir = resolve('public'); 

async function startServer() {
  server.use(express.static(publicDir));
  await promisify(server.listen.bind(server, port))();
  console.log(`it is live on ${port}`);
}

startServer();
```

```html
<!-- public/index.html -->
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <h1>test</h1>
  </body>
</html>
```

然後在package.json中設置start腳本,就可以啟動服務了

```javascript
"scripts": {
  "start": "node src/server.js"
},
```

```shell
yarn start
```

然後在本地瀏覽器輸入 localhost:3000 即可獲取到服務器響應的静態資源。