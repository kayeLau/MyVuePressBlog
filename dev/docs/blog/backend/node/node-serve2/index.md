---
title: 用express搭建一個服務器(二) 連接數據庫
date: 2021-4-25
categories:
 -  後端
tags:
 - Node.js
 - express
---
我們需要接入數據庫并對其進行I/O操作,這裡選擇用mongoose這個ORM,ORM,是指在应用程序中的对象与关系型数据库中的数据间建立映射关系以便捷访问数据库的技术。

## 準備

```javascript
yarn add mongoose

. 					# 目錄結構
├── package.json
├── public
└── src
	├── server 		#存放業務邏輯
    ├── db 			#存放數據庫綱要
	└── server.js	#入口
```

## 引入mongoose

在上一逢章的基礎加入以下內容

```javascript
// src/server.js
const mongoose = require('mongoose')

//mongodb映射位置 my_test為目標數據庫
const mongoDB = 'mongodb://localhost/my_test'; 
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

//讓mongoose使用全局promise庫
mongoose.Promise = global.Promise;

//獲取默認的Connection對象
const db = mongoose.connection;
//監聽異常
db.on('error',console.error.bind(console,'MongoDB connection error:'));
```

## 定義綱要Schemas

我們創建一套圖書作者的綱要,并定義驗證器限制非法寫入,最後導出模型,供業務邏輯使用。

```javascript
// src/db/author.js
const mongoose = require("mongoose");

//定義綱要
const Schema = mongoose.Schema; 
const AuthorSchema = new Schema({
  //required是否必須, max min驗證器, default默認值
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth:{ type:Date},
  date_of_death:{ type:Date}
});


//創建模型
module.exports = mongoose.model('Author',AuthorSchema); 
```

## 業務邏輯

接下來,我們需要寫一個可以支持CRUD的服務。先初始化數據庫

```javascript
// src/server/shop.js
const SomeModel = require("../db/author.js");  //引入模型
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// 初始化數據庫
let author = new SomeModel(
{
  first_name: "James Joyce",
  family_name: "Joyce",
  date_of_birth: new Date("1882-05-02");
  date_of_death: new Date("1941-01-43");
},
{
  first_name: "	George",
  family_name: "Orwell",
  date_of_birth: new Date("1903-06-18"),
  date_of_death: new Date("1950-01-21"),
},
{
  first_name: "	Ralph",
  family_name: "Ellison",
  date_of_birth: new Date("1913-03-01"),
  date_of_death: new Date("1994-04-16"),
},
);

author.save(function (err, res) {
  if (err) return console.log(err);
  console.log(res.name + "save to collecton.");
});
```

再寫入查,刪,改的方法,并將它導出

```javascript
// src/server/shop.js
class ShopService {
  constructor(){
    this.res
  }

  async find({ id, pageIndex = 0, pageSize = 10 }) {
    if(id){	//如果有id則查找指定數據
      let _id = mongoose.Types.ObjectId(id);
      let query = SomeModel.find({'_id':_id});
      query.exec(function(err,res){
        return res
      });
      return await query
    }

    let query = SomeModel.find();
    //可以用query串聯查找條件,并在最後用ecec執行查找
    query.limit(pageSize);
    query.skip(pageSize * pageIndex);
    query.exec(function(err,res){
      return res
    });
    //使用 async / await 获取查询结果。
    this.res = await query
    return this.res
  }

  async modify({ id, firstname, familyname}) {
    let _id = mongoose.Types.ObjectId(id);
    const target = await SomeModel.findByIdAndUpdate(
        {'_id':_id},
        {'first_name':values},
        {'family_name':values},
        {new: true},  //true則返回更新後的值
        function(error){
        console.error(error)
    });
    
    if (!target) {
      return null;
    }
      
    Object.assign(target, values);

    return await target.save();
  }

  async remove({ id }) {
    let _id = mongoose.Types.ObjectId(id);
    const target = await SomeModel.deleteOne({'_id':_id}, function(error){
      if(error){
        console.log(error)
      }
    });

    if (!target) {
      return false;
    }
    return target;
  }
}

// 单例模式
let service;
module.exports = async function () {
  if (!service) {
    service = new ShopService();
    await service.init();
  }
  return service;
};

```

然後我們可以在其他js文件引入模塊,調用我們寫好的方法。

```javascript
// src/server/test.js
const test = require('./shop.js') 

let server = test()  
server.find() 
server.find({id:'60583f63c61ac13c54b0a41a'})
server.modify({
      id: '60583f63c61ac13c54b0a41a',
      firstname: 'Niccolò' ,
      familyname: 'Machiavelli' 
    });
server.remove({id:'60583f63c61ac13c54b0a41a'})
```

這樣就可以對我們的數據庫進行操作啦!下期再為數據庫添加路由與前端操作介面