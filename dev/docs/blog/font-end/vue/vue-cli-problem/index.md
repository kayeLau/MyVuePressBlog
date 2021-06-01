---
title: vue-cli-service不是内部或者外部命令
date: 2021-3-20
categories:
 - 前端
tags:
 - vue
---
自重昨天手癢清除了node緩存後

```shell
npm cache clean --force
```

npm run serve就一直報**'vue-cli-service' 不是內部或外部命令、可執行的程式或批次檔。**當我google一下解決方法時,發現似乎是node_module缺失或損壞問題。我嘗試重裝所有node_module文件,但是問題依然沒有解決。無奈之下,我決定一個個排查問題:

- node_module文件是完好的,package.json的依賴都可以在node_module中找到;
- Vue環境已配置好,可以在終端輸入vue訪問
- vue-cli環境已配置好,可以在終端輸入vue --version 訪問

vue-cli-service的路徑是 node_module/.bin/vue-cli-service,經一番問題排查後發現問題是缺少vue-cli-service文件,但不論是npm install 還是刪除node_module再安裝都不能解決問題,vue-cli-service依然是缺失。



## 解決方法

在查詢 npm cache clean --force 相關資料後,發現當我們使用`npm install <package-name>`命令npm安裝軟件包時，本地其實保存了兩份。一份緩存存儲在用戶文件系統中(~/.npm),一份存儲在node_module中。我在運行npm cache clean --force就是清除在在~/.npm中的那一份。

最終解決方法是

```shell
npm update
```

npm upadte 可以更新項目所依賴的本地軟件包，所以問題可能是文件在缓存重新install的时候出错了,也可能是node_module與~/.npm的版本不一致。



