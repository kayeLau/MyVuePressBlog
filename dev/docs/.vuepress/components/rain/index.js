var canvas, ctx, DPR, options, canvasWidth, canvasHeight, wind_anger;
var hasBounce, maxNum, numLevel, speed, wind_direction, drop_chance, gravity;
var speed_x, speed_y;
var mySpeed, myAngle;
let windX = 1;
var angle = [];
var drops = [],
  bounces = [];
var image;
//将角度乘以 0.017453293 （2PI/360）可转换为弧度。
var eachAnger = 0.017453293;
var rainId, cloudId;
var canvas_rain, canvas_cloud;

window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 30);
  };

function Rain(opts) {
  options = opts;
  canvas_rain = canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.zIndex = 1000;
  canvas.style.pointerEvents = "None";
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx = canvas.getContext("2d");
  DPR = window.devicePixelRatio;
  canvas.width = canvas.clientWidth * DPR;
  canvas.height = canvas.clientHeight * DPR;
  // 获取设置的值
  speed = opts.speed || [10, 100]; //风速范围，初始值加随机范围
  mySpeed = new getBetween(3)
  myAngle = new getBetween(1.5)
  hasBounce = opts.hasBounce == undefined ? true : opts.hasBounce; //是否有反弹效果or false,
  // 最大角度为画布的右上角到左下角（或左上角到右下角）
  var wind_max = 270 + Math.atan(canvas.width / canvas.height) / eachAnger;
  var wind_min = 270 - Math.atan(canvas.width / canvas.height) / eachAnger;
  angle[0] = wind_min + 20;
  angle[1] = wind_max - 20;

  //风的角度
  if (opts.wind_direction > wind_max) {
    wind_direction = wind_max;
  } else if (opts.wind_direction < wind_min) {
    wind_direction = wind_min;
  } else {
    wind_direction = opts.wind_direction || 270;
  }
  maxNum = opts.maxNum || 1000;
  numLevel = opts.numLevel || 10;
  drop_chance = opts.drop_chance || 0.1; // 下雨的概率
  gravity = opts.gravity || 0.163; // 重力
  //设置样式
  setStyle();
  update();
  if (opts.cloud) {
    image = new Image()
    image.onload = init
    image.src = 'https://www.luckyclover.top/static/cloud.png'
  }
}

function setStyle() {
  ctx.lineWidth = 1.5 * DPR;
  ctx.fillStyle = "rgba(223,223,223,0.6)";
}

function update() {
  //清理画图
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var i = drops.length;
  while (i--) {
    var drop = drops[i];
    drop.update();
    //如果drop实例下降到底部，则需要在drops数组中清除该实例对象
    if (drop.pos.y >= canvas.height) {
      //如果需要回弹，则在bouncess数组中加入bounce实例
      if (hasBounce) {
        var n = Math.round(4 + Math.random() * 4);
        while (n--) bounces.push(new Bounce(drop.pos.x, canvas.height));
      }
      //如果drop实例下降到底部，则需要在drops数组中清楚该实例对象
      drops.splice(i, 1);
    }
    drop.draw();
  }
  //如果需要回弹
  if (hasBounce) {
    var i = bounces.length;
    while (i--) {
      var bounce = bounces[i];
      bounce.update();
      bounce.draw();
      if (bounce.pos.y > canvas.height) bounces.splice(i, 1);
    }
  }
  //每次产生的数量
  let a = angle[0] + myAngle.get() * (angle[1] - angle[0]) / 100
  let s = speed[0] + mySpeed.get() * (speed[1] - speed[0]) / 100
  if (drops.length < maxNum) {
    if (Math.random() < drop_chance) {
      var i = 0,
        len = numLevel;
      for (; i < len; i++) {
        drops.push(new Drop(a, s));
      }
    }
  }
  //监听窗口大小改变
  window.addEventListener("resize", onWindowResize, false);
  //不断循环update
  rainId = requestAnimFrame(update);
}

function onWindowResize() {
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  canvas.width = canvas.clientWidth * DPR;
  canvas.height = canvas.clientHeight * DPR;
  setStyle();
}

var Vector = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

//下落加速
Vector.prototype.add = function(v) {
  if (v.x != null && v.y != null) {
    this.x += v.x;
    this.y += v.y;
  } else {
    this.x += v;
    this.y += v;
  }
  return this;
};

Vector.prototype.copy = function() {
  return new Vector(this.x, this.y);
};

var Drop = function(a, s) {
  //计算雨滴距离边缘的位置
  // var edge = Math.tan((270 - wind_direction) * eachAnger) * canvas.height;
  wind_direction = a;
  var edge = Math.tan((270 - wind_direction) * eachAnger) * canvas.height;
  //计算雨滴坐标
  if (edge >= 0) {
    this.pos = new Vector(Math.random() * (canvas.width + edge), 0);
  } else {
    this.pos = new Vector(Math.random() * (canvas.width - edge) + edge, 0);
  }
  //生成一个随机风速

  this.speed = (s) * DPR;

  this.prev = this.pos;
  //获得风向的角度
  wind_anger = wind_direction * eachAnger;
  //获得横向加速度
  speed_x = this.speed * Math.cos(wind_anger);
  windX = speed_x
  //获得纵向加速度
  speed_y = -this.speed * Math.sin(wind_anger);
  //绑定一个速度实例
  this.vel = new Vector(speed_x, speed_y);
};

//公有方法-update
Drop.prototype.update = function() {
  this.prev = this.pos.copy();
  //如果是有重力的情况，则纵向速度进行增加
  if (gravity) {
    this.vel.y += gravity;
  }
  this.pos.add(this.vel);
  this.setStyle();
};

Drop.prototype.setStyle = function() {
  var color = ctx.createLinearGradient(
    this.prev.x,
    this.prev.y,
    this.pos.x,
    this.pos.y
  );
  color.addColorStop(0, "rgba(0,0,0,0");
  color.addColorStop(0.5, "rgba(223,223,223,0.6)");
  ctx.strokeStyle = color;
};

Drop.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.prev.x, this.prev.y);
  ctx.lineTo(this.pos.x, this.pos.y);
  ctx.stroke();
};

var Bounce = function(x, y) {
  var dist = Math.random() * 7;
  var angle = Math.PI + Math.random() * Math.PI;
  this.pos = new Vector(x, y);
  this.radius = 0.2 + Math.random() * 0.8;
  this.vel = new Vector(Math.cos(angle) * dist, Math.sin(angle) * dist);
};

Bounce.prototype.update = function() {
  this.vel.y += gravity;
  this.vel.x *= 0.95;
  this.vel.y *= 0.95;
  this.pos.add(this.vel);
};

Bounce.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius * DPR, 0, Math.PI * 2);
  ctx.fill();
};

var getBetween = function(s) {
  this.s = s;
  this.value = 50;
};

getBetween.prototype.get = function() {
  let d = 1 + Math.random() * -2;
  d *= this.s;
  this.value += d;
  if (this.value > 100 || this.value < 0) {
    this.value -= 1.1 * d;
  }
  return this.value;
};


// cloud
class Cloud {
    constructor(props) {
        this.x = 0
        this.y = 0
        this.xpos = 0
        this.ypos = 0
        this.zpos = 0
        this.scaleX = 1
        this.scaleY = 1
        this.visible = true
        Object.assign(this, props)
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.scale(this.scaleX, this.scaleY)
        ctx.drawImage(this.image, 0, 0, 256, 120)
        ctx.restore()
    }
}


function init() {
  canvas_cloud = canvas2 = document.createElement("canvas");
  document.body.appendChild(canvas2);
  canvas2.style.position = "absolute";
  canvas2.style.top = 0;
  // canvas2.style.zIndex = 1;
  canvas2.style.pointerEvents = "None";
  canvas2.style.width = window.innerWidth + "px";
  canvas2.style.height = 135 + "px";
  const width = canvas2.width = canvas2.clientWidth * DPR;
  const height = canvas2.height = canvas2.clientHeight * DPR;
  const ctx = canvas2.getContext('2d')
  const clouds = createCloud(24)
  // 观察点距离（镜头焦距）
  const fl = 1000


  function createCloud(nums) {
      const clouds = []
      while (nums--) {
          clouds.push(new Cloud({
              image,
              xpos: Math.random() * width * 2 - width,
              ypos: Math.random() * height - 2 * height / 3,
              zpos: Math.random() * 400 - 200
          }))
      }
      return clouds
  }

  function translateX(cloud) {
      let x1 = cloud.xpos + windX * 0.02
      if (x1 > width)
        x1 = - width
      else if (x1 < - width)
        x1 = width
      cloud.xpos = x1
  }


  function setPerspective(cloud) {
      // 防止比例出错要做一个判断
      if (cloud.zpos > -fl) {
          const scale = fl / (fl + cloud.zpos) // 产生 0～1 之间的一个值，用来做缩放和靠近消失点的一个比例
          cloud.scaleX = cloud.scaleY = scale
          cloud.x = width / 2 + cloud.xpos * scale
          cloud.y = cloud.ypos * scale
          cloud.visible = true
      } else {
          cloud.visible = false
      }
  }


  function move(cloud) {
      translateX(cloud)
      setPerspective(cloud)
  }

  function zsort(a, b) {
      return b.zpos - a.zpos
  }

  function draw(cloud) {
      if (cloud.visible && cloud.x < width) {
          cloud.draw(ctx)
      }
  }

  (function drawFrame() {
      window.requestAnimationFrame(drawFrame)
      ctx.clearRect(0, 0, width, height)
      clouds.sort(zsort)
      clouds.forEach(move)
      clouds.forEach(draw)
  })()

}

function stopRain() {
  cancelAnimationFrame(rainId)
  canvas_rain.getContext("2d").clearRect(0, 0, canvas_rain.width, canvas_rain.height)

  // 流星
  class Meteor {
    constructor(ctx, x, h) {
        this.ctx = ctx;
        this.x = x;
        this.y = 0;
        this.h = h;
        this.vx = -(5 + Math.random() * 5);
        this.vy = -this.vx;
        this.len = Math.random() * 300 + 100;
    }

    flow() {
        //判定流星出界
        if (this.x < -this.len || this.y > this.h + this.len) {
            return false
        }
        this.x += this.vx;
        this.y += this.vy;
        return true
    }

    draw() {
        let ctx = this.ctx,
            //径向渐变，从流星头尾圆心，半径越大，透明度越高
            gra = ctx.createRadialGradient(
                this.x, this.y, 0, this.x, this.y, this.len);

        const PI = Math.PI;
        gra.addColorStop(0, 'rgba(255,255,255,1)');
        gra.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.clearRect(0, 0, canvas_rain.width, canvas_rain.height)
        ctx.fillStyle = gra;
        ctx.beginPath();
        //流星头，二分之一圆
        ctx.arc(this.x, this.y, .5, PI / 4, 5 * PI / 4);
        //绘制流星尾，三角形
        ctx.lineTo(this.x + this.len, this.y - this.len);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
  }
  //流星生成函数
  meteors=[]
  const meteorGenerator = () => {
    //x位置偏移，以免经过月亮
    let x = Math.random() * canvas_rain.width;
    meteors.push(new Meteor(canvas_rain.getContext("2d"), x, canvas_rain.height));
  };
  var count = 0
  const frame = () => {
      //每隔10帧星星闪烁一次，节省计算资源
      count++;

      if (count > 220) {
      count = 0;
      meteorGenerator();
    }

    meteors.forEach((meteor, index, arr) => {
          if (meteor.flow()
          ) {
              meteor.draw()
          }
          else {
              arr.splice(index, 1)
          }
      });
      requestAnimationFrame(frame);
  };
  frame()
}

