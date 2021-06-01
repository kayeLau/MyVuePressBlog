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
  
  var Drop = function(canvas, ctx, DPR, a, s) {
    //计算雨滴距离边缘的位置
    // var edge = Math.tan((270 - wind_direction) * eachAnger) * canvas.height;
    let wind_direction = a;
    this.ctx = ctx;
    
    var eachAnger = 0.017453293;
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
    let wind_anger = wind_direction * eachAnger;
    //获得横向加速度
    let speed_x = this.speed * Math.cos(wind_anger);
    let windX = speed_x
    //获得纵向加速度
    let speed_y = -this.speed * Math.sin(wind_anger);
    //绑定一个速度实例
    this.vel = new Vector(speed_x, speed_y);
  };
  
  //公有方法-update
  Drop.prototype.update = function(gravity) {
    this.prev = this.pos.copy();
    //如果是有重力的情况，则纵向速度进行增加
    if (gravity) {
      this.vel.y += gravity;
    }
    this.pos.add(this.vel);
    this.setStyle();
  };
  
  Drop.prototype.setStyle = function() {
    var color = this.ctx.createLinearGradient(
      this.prev.x,
      this.prev.y,
      this.pos.x,
      this.pos.y
    );
    color.addColorStop(0, "rgba(0,0,0,0");
    color.addColorStop(0.5, "rgba(223,223,223,0.6)");
    this.ctx.strokeStyle = color;
  };
  
  Drop.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prev.x, this.prev.y);
    this.ctx.lineTo(this.pos.x, this.pos.y);
    this.ctx.stroke();
  };
  
  var Bounce = function(ctx, x, y) {
    this.ctx = ctx
    var dist = Math.random() * 7;
    var angle = Math.PI + Math.random() * Math.PI;
    this.pos = new Vector(x, y);
    this.radius = 0.2 + Math.random() * 0.8;
    this.vel = new Vector(Math.cos(angle) * dist, Math.sin(angle) * dist);
  };
  
  Bounce.prototype.update = function(gravity) {
    this.vel.y += gravity;
    this.vel.x *= 0.95;
    this.vel.y *= 0.95;
    this.pos.add(this.vel);
  };
  
  Bounce.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.radius * DPR, 0, Math.PI * 2);
    this.ctx.fill();
  };
  
   class getBetween {
    constructor(s) {
        this.s = s;
        this.value = 50;
    }
    get() {
        let d = 1 + Math.random() * -2;
        d *= this.s;
        this.value += d;
        if (this.value > 100 || this.value < 0) {
            this.value -= 1.1 * d;
        }
        return this.value;
    }
};
  

  export {
    Drop,
    getBetween,
    Bounce,
    Vector
  }