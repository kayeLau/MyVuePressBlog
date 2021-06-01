---
title: Vue雙向綁定原理之數据據劫持
date: 2021-1-29
categories:
 - 前端
tags:
 - vue
---
## 前言
Vue資料雙向綁定是通過資料劫持結合發佈者-訂閱者模式的方式來實現的,今天先講一下資料劫持並實現一個簡單的模型。
## Object.defineProperty()
vue是通過[Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)裡的getter和 setter 來實現資料劫持的。當我們訪問一個帶有getter的物件屬性時,就會觸發getter函數,執行時不傳入任何參數，但是會傳入 this 物件,該函數的返回值會被用作屬性的值。setter同理,不過setter是在修改值時觸發,以及它接受一個參數（也就是被賦予的**新值**）。
Vue在初始化時會為data內所有屬性設定getter與setter,當我們修改值時會觸發setter,把**新值**傳回去並保存起來,當訪問時則觸發getter取值。

```javascript
let vm = new Vue({
//把data物件傳入,並為內裡所有屬性設定getter與setter
  data:{
      name:'peter',
      age:'25',
      occupation:'web developer'
  }
})
```
## 實現一個簡單的模型
首先要對參數進行判斷,參數必須要為非空物件,同時要排除陣列(typeof array為物件,要用Array.isArray()判斷)

```javascript
      function isObject (obj) {
      //如果是object則return true
        return typeof obj === 'object'
          && !Array.isArray(obj)
          && obj !== null
          && obj !== undefined
      }
```

```javascript
     function convert (obj) {
		//物件判斷
        if (!isObject(obj)) {
          return
        }
        
        //遍歷所有屬性鍵
        Object.keys(obj).forEach(key => {
        //保存值
          let Value = obj[key]
          Object.defineProperty(obj, key, {
            get () {
              console.log(`getting key "${key}": ${Value}`)
              return Value
            },
            set (newValue) {
              console.log(`setting key "${key}" to: ${newValue}`)
              //重寫值
              Value = newValue
            }
          })
        })
      }
```
## 測試
把對象放進去測試
![在這裡插入圖片描述](https://img-blog.csdnimg.cn/20201023161828197.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80Mzk3OTA0MQ==,size_16,color_FFFFFF,t_70#pic_center)
當修改與取值時都會觸發我們定義好的getter和 setter,我們已經對obj內所有屬性進行劫持監聽,只要再將一些更新的方法放在setter就可以實現data更新view了。
