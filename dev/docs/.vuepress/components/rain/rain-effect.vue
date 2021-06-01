<template>
  <div></div>
</template>
<script>
import { Drop, getBetween, Bounce, Vector } from "./rainClass";
export default {
  name: "VueRain",
  data() {
    return {
      ctx: null,
      canvas: null,
      drops: [],
      mySpeed: 0,
      myAngle: 0,
      speed: [],
      maxNum: 1000,
      numLevel: 10,
      drop_chance: 0.1,
      gravity: 0.163,
      wind_direction: 0,
      angle: [],
      bounces: []
    };
  },
  mounted() {
    this.initCanvas({
      speed: [2, 40],
      hasBounce: true,
      wind_direction: 340,
      gravity: 0.05,
      maxNum: 80,
      numLevel: 5,
      drop_chance: 0.4,
      hasBounce: true
    });
  },
  methods: {
    //初始化canvas----------
    initCanvas(opts) {
      var eachAnger = 0.017453293;
      this.canvas = document.createElement("canvas");
      document.body.appendChild(this.canvas);
      this.canvas.style.position = "fixed";
      this.canvas.style.top = 0;
      this.canvas.style.zIndex = 1000;
      this.canvas.style.pointerEvents = "None";
      this.canvas.style.width = window.innerWidth + "px";
      this.canvas.style.height = window.innerHeight + "px";
      this.ctx = this.canvas.getContext("2d");
      let DPR = window.devicePixelRatio; //返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
      this.canvas.width = this.canvas.clientWidth * DPR;
      this.canvas.height = this.canvas.clientHeight * DPR;

      // 获取设置的值
      this.speed = opts.speed || [10, 100]; //风速范围，初始值加随机范围
      this.mySpeed = new getBetween(3);
      this.myAngle = new getBetween(1.5);
      this.hasBounce = opts.hasBounce == undefined ? true : opts.hasBounce; //是否有反弹效果or false,
      // 最大角度为画布的右上角到左下角（或左上角到右下角）
      var wind_max =
        270 + Math.atan(this.canvas.width / this.canvas.height) / eachAnger;
      var wind_min =
        270 - Math.atan(this.canvas.width / this.canvas.height) / eachAnger;
      this.angle[0] = wind_min + 20;
      this.angle[1] = wind_max - 20;

      //风的角度
      if (opts.wind_direction > wind_max) {
        this.wind_direction = wind_max;
      } else if (opts.wind_direction < wind_min) {
        this.wind_direction = wind_min;
      } else {
        this.wind_direction = opts.wind_direction || 270;
      }
      this.maxNum = opts.maxNum || 1000;
      this.numLevel = opts.numLevel || 10;
      this.drop_chance = opts.drop_chance || 0.1; // 下雨的概率
      this.gravity = opts.gravity || 0.163; // 重力
      //设置样式
      this.setStyle();
      this.update();
    },

    //設定canvas style------
    setStyle() {
      this.ctx.lineWidth = 1.5 * this.DPR;
      this.ctx.fillStyle = "rgba(223,223,223,0.6)";
    },

    //更新canvas----------
    update() {
      //清理画图
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var i = this.drops.length;
      while (i--) {
        var drop = this.drops[i];
        drop.update();
        //如果drop实例下降到底部，则需要在drops数组中清除该实例对象
        if (drop.pos.y >= this.canvas.height) {
          //如果需要回弹，则在bouncess数组中加入bounce实例
          if (this.hasBounce) {
            var n = Math.round(4 + Math.random() * 4);
            while (n--)
              this.bounces.push(
                new Bounce(this.ctx, drop.pos.x, this.canvas.height)
              );
          }
          //如果drop实例下降到底部，则需要在drops数组中清楚该实例对象
          this.drops.splice(i, 1);
        }
        drop.draw();
      }
      //如果需要回弹
      if (this.hasBounce) {
        var i = this.bounces.length;
        while (i--) {
          var bounce = this.bounces[i];
          bounce.update();
          bounce.draw();
          if (bounce.pos.y > canvas.height) this.bounces.splice(i, 1);
        }
      }
      //每次产生的数量
      let a =
        this.angle[0] +
        (this.myAngle.get() * (this.angle[1] - this.angle[0])) / 100;
      let s =
        this.speed[0] +
        (this.mySpeed.get() * (this.speed[1] - this.speed[0])) / 100;
      if (this.drops.length < this.maxNum) {
        if (Math.random() < this.drop_chance) {
          var i = 0,
            len = this.numLevel;
          for (; i < len; i++) {
            this.drops.push(new Drop(this.canvas, this.ctx, this.DPR, a, s));
          }
        }
      }
      //监听窗口大小改变
      window.addEventListener("resize", this.onWindowResize, false);
      //不断循环update
      window.requestAnimationFrame(this.update);
    },

    onWindowResize() {
      this.canvas.style.width = window.innerWidth + "px";
      this.canvas.style.height = window.innerHeight + "px";
      this.canvas.width = this.canvas.clientWidth * this.DPR;
      this.canvas.height = this.canvas.clientHeight * this.DPR;
      this.setStyle();
    }
  }
};
</script>

<style>
</style>