---
title: 用Vue封裝個echart圖表
date: 2021-5-20
categories:
 - 前端
tags:
 - vue
 - echart
---

最近用echart的頻率比較高,需要在項目中生成多個折線或者柱狀圖,如果分成數個獨立的組件,之後要更改參數或者維護都會非常麻煩。因此,把基本設定封裝成一個組件,對於後面維護或者統一修尹都非常方便,測試量也大大減少。使用時只需要把圖表數據傳進去即可。

## 構思

首先我希望封裝的組件具備以下特性

- 當數據改變時自動更新圖表
- 傳入數據即可生成默認圖表
- 可以選擇性傳入其他圖表設定,覆蓋默認值

## 文件結構

定義一個echart_line文件夾存放我們的封裝組件,index.vue是入口,負責做邏輯判斷,比如當傳入數據不合法或為空時,就在頁面展示一個“沒有數據”的圖標。

```shell
worktime_chart.vue //使用封裝組件
echart_line
|-default_option.json // 圖表默認設定
|-echart_line.vue // 封裝組件
|-index.vue //入口
```

## 封裝組件

props存放傳進來的數據與額外設定,this.assembleDataToOption()方法會把所有圖表設定合成一個對象,通過調用這個方法就可以拿到完整的設定。

```javascript
// echart_line.vue
<template>
  <div class="chart"></div>
</template>

<sc
import * as echarts from "echarts";
import { BASIC_OPTION } from "./default_option";
import ResizeListener from "element-resize-detector";

export default {
  name: "ChartLine",
  props: {
    seriesData: {
      //圖表數據
      type: Object,
      required: true
    },

    extraOption: {
      //額外圖表設定
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null //存放echart實例
    };
  },
  methods: {
    assembleDataToOption() {
      //組合數據與配置
      return Object.assign(
        {},
        BASIC_OPTION,
        {
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: this.seriesData.xAxis
          }
        },
        {
          series: this.seriesData.data
        },
        this.extraOption
      );
    },

    addChartResizeListener() {
      const instance = ResizeListener({
        strategy: "scroll",
        callOnAdd: true
      });
      instance.listenTo(this.$el, () => {
        if (!this.chart) return;
        this.chart.resize();
      });
    },

    updateChartView() {
      //更新echart视图
      if (!this.chart) return;
      const fullOption = this.assembleDataToOption();
      this.chart.setOption(fullOption, true);
    },

    handleWindowResize() {
      if (!this.chart) return;
      this.chart.resize();
    }
  },
  mounted() {
    //初始化echart實例,this.$el為組件根節點
    this.chart = echarts.init(this.$el); 
    this.updateChartView(); //初始化圖表
    //監聽窗口大小改變
    window.addEventListener("resize", this.handleWindowResize);
    this.addChartResizeListener();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
};
```

## 監聽數據變化

監聽props裡的seriesData,當數據改變就會觸發this.updateChartView()方法。這邊用的深度监听,监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器,所以對象裡的属性改變也會觸發方法。

```javascript
// echart_line.vue 
watch: {
    seriesData: { 
      deep: true, //深度监听
      handler() {
        this.updateChartView();
      }
    }
  },
```

## 組件入口

組件入口要替傳入的數據把關,當傳入非法數據或者空數據,頁面上就要展示沒有數據。當然,其他判斷業務邏輯也可以在這一層處理,這層主要是確保接口傳入的參數是合非的。這邊用的是vant的Empty,當數據為空時,就會展示該組件。

```javascript
// index.vue
<template>
  <Empty v-if="isSeriesEmpty" description="暫無數據" />
  <chart-line v-else :series-data="seriesData" />
</template>

<script>
import ChartLine from "./echart_line.vue";
import { Empty } from "vant";

export default {
  name: "EChartLine",
  components: { ChartLine, Empty },
  props: {
    seriesData: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 针对饼图数据是不是无效的判断
    isSeriesEmpty() {
      return !this.seriesData.data.length;
    }
  },
};
</script>
```

## 使用組件

把workTimeData數據與extraOption傳入

```javascript
<template>
  <div>
    <echart-line :series-data="workTimeData" :extra-option="extraOption" />
  </div>
</template>

<script>
import EchartLine from "@/components/echart_line";

export default {
  components: {
    EchartLine
  },
  data() {
    return {
      workTimeData:{
       	xAxis:['5/11','5/12','5/13','5/14','5/15','5/16'],
        data:[{
          name:"工作時間(hour)",
          type:"line",
          data:[12,12,8,9,9,6]
        }]
      },
      extraOption: {
        color: ["#fe883a", "#2d90d1", "#f75981", "#90e2a9"]
      }
    }
  },
}
</script>

```

