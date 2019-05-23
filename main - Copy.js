// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
let score = document.body.querySelector('p');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var balls = [];

// function to generate random number
function random(min, max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// sets up prototypical inheritence for objects
function setInheritence(subClass, ParentClass){
  subClass.prototype = Object.create(ParentClass.prototype); // Ball inherites from Shape
  Object.defineProperty(subClass.prototype, 'constructor', {value: subClass}); //set the balls constructor to Ball
}

// constructors
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, color, size, exists) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

function EvilCirlce(x, y, exists){
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
}

setInheritence(Ball, Shape);
setInheritence(EvilCirlce, Shape);

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;   
}

// checkes collision between ball
Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) { // if not the same ball
      var dx = this.x - balls[j].x; // distance between current ball coordinate and other balls on the screen x coors
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy); // distance between two points
      
      // if the distance between the current ball and a random ball on the screen is less then,
      // the current balls size plus a random balls size on the screen
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

EvilCirlce.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCirlce.prototype.checkBounds = function() {
  if ((this.x + this.size) >= width) {
    this.x = width;
  }

  if ((this.x - this.size) <= 0) {
    this.x = 0;
  }

  if ((this.y + this.size) >= height) {
    this.y = height;
  }

  if ((this.y - this.size) <= 0) {
    this.y = 0;
  }
}

EvilCirlce.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
      if (e.keyCode === 65) {
        _this.x -= _this.velX;
      } else if (e.keyCode === 68) {
        _this.x += _this.velX;
      } else if (e.keyCode === 87) {
        _this.y -= _this.velY;
      } else if (e.keyCode === 83) {
        _this.y += _this.velY;
      }
    }
}

// check collision between evil circle and diffarent balls
EvilCirlce.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists === true) { // if not the same ball
      var dx = this.x - balls[j].x; // distance between current ball coordinate and other balls on the screen x coors
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy); // distance between two points
      
      // if the distance between the current ball and a random ball on the screen is less then,
      // the current balls size plus a random balls size on the screen
      if (distance < this.size + balls[j].size) {
         balls[j].exists = false       
         console.log('collision');  
      }
    }
  }
}

// remove non existent balls from the balls list
// non existent = balls[number].exists = false
function popNonExistBalls() {
  for (let i = 0; i < balls.length; i++) {
    if(balls[i].exists === false){
      balls.splice(i, 1);
    }
  }
}


function generateBalls() {
  while (balls.length < 40) {
    var size = random(10,20);
    var ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      size,
      true
    );
  
    balls.push(ball);
  }  
}

function drawBalls(){
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
  }
}

function updateBalls() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
  }
}

function isCollision(){
  for (let i = 0; i < balls.length; i++) {
    balls[i].collisionDetect();
  }
}

function checkCurrentBallExists() {
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists === true) {
      return true;
    } else {
      return false;
    }
  }
}

// update counter based on the number of balls
function updateBallsLeft() {
  return balls.length;
}

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  
  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();

  if (checkCurrentBallExists()) {
      drawBalls();
      updateBalls();
      isCollision();
  }

  popNonExistBalls();
  score.innerText = 'Balls Left: ' + updateBallsLeft();
  requestAnimationFrame(loop);
}

let evil = new EvilCirlce(50, 50, true);

generateBalls();
evil.setControls();
loop();