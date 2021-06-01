---
title: 用express搭建一個服務器(三) 路由
date: 2021-4-25
categories:
 -  後端
tags:
 - node.js
 - express
---
在上一節我們已經寫好CRUL的api,接下來我們來搭建路由,把不同方法與路由對應,讓我們可以通過路由調用api。首先創建一個controller存放控制的邏輯。

```shell
$ mkdir controller      # 新建 controller 目录存放控制邏輯

. 					# 目錄結構
├── package.json
├── controller
    ├──index.js
    ├──shop.js
├── public
└── src
└── server.js
```
## controller入口
```javascript
// src/controllers/index.js
const { Router } = require('express');
const shopController = require('./shop');

module.exports = async function initControllers() {
  const router = Router(); //創建Router物件
  router.use('/api/shop', await shopController()); //指定基層路徑
  return router;

};
```

## 控制邏輯shop.js
定義路由
```javascript
// src/controller/shop.js
const { Router } = require('express');
const shopService = require('../server/shop');

class ShopController {
  shopService;

  async init() {
    this.shopService = await shopService();

    const router = Router();
    router.get('/', this.getAll);
    //path同Vue-router,可用:id表示動憑路由
    router.get('/:shopId', this.getOne);
    router.put('/:shopId', this.put);
    router.delete('/:shopId', this.delete);
    return router;
  }
```

定義路由對應方法
```javascript
  getAll = async (req, res) => {
    const { pageIndex, pageSize } = req.query;
    const shopList = await this.shopService.find({ pageIndex, pageSize });
    res.json({ success: true, data: shopList });
  };

  getOne = async (req, res) => {
    const { shopId } = req.params;
    const shopList = await this.shopService.find({ id: shopId });

    if (shopList.length) {
      res.json({ success: true, data: shopList[0] });
    } else {
      res.status(404).send({ success: false, data: null });
    }
  };

  put = async (req, res) => {
    const { shopId } = req.params;
    const { name } = req.query;
    let data = name.split('|')
    try{
      data.map(async item =>{
        await createShopFormSchema().validate(item);
      })
    } catch(e){
      res.status(400).send({ success:false,message:e.message});
      return
    }
    const shopInfo = await this.shopService.modify({
      id: shopId,
      values:{
        first_name:data[0],
        family_name:data[1]
      }
    });

    if (shopInfo) {
      res.json({ success: true, data: shopInfo });
    } else {
      res.status(404).send({ success: false, data: null });
    }
  };

  delete = async (req, res) => {
    const { shopId } = req.params;
    const success = await this.shopService.remove({ id: shopId });

    if (!success) {
      res.status(404);
    }
    res.json({ success });
  };
}

module.exports = async () => {
  const c = new ShopController();
  return await c.init();
};
```

