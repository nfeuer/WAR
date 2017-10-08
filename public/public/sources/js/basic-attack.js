var canvas = document.getElementById('animation-canvas'),
    context = canvas.getContext('2d');

var coef = 0.8;
var AllAttackObjects = [];

function SimpleAttackDrawCircle (charge) {
  var Min = {
    x: (canvas.width - (canvas.width * coef)) / 2,
    y: (canvas.height - (canvas.height * coef)) / 2,
  };

  var Max = {
    x: canvas.width - Min.x,
    y: canvas.height - Min.y,
  };

  var otherCoord = 'y',
      randCoord = 'x',
      coordVal = 0,
      randCoordVal = 0;

  AllAttackObjects = [];

  for (let x = 0; x < charge; x++) {
    var AttackObj = {
      x: 0,
      y: 0,
      xTo: canvas.width / 2,
      yTo: canvas.height / 2,
      radius: randNumInRange(5, 35),
      speed: randNumInRange(5, 15),
      color: (function(){
         var c = "rgba("+returnRand()+","+returnRand()+","+returnRand()+","+Math.random()+")";
             return c;
      }()),
    };

    if (randNumInRange() % 2) {
      randCoord = 'y';
      otherCoord = 'x';
    }

    if (randNumInRange() % 2) {
      if (randCoord === 'x') {
        coordVal = randNumInRange(0, canvas.height);
        randCoordVal = randNumInRange(0, Min[randCoord]);
      } else {
        coordVal = randNumInRange(0, canvas.width);
        randCoordVal = randNumInRange(0, Min[randCoord]);
      }
    } else {
      if (randCoord === 'x') {
        coordVal = randNumInRange(0, canvas.height);
        randCoordVal = randNumInRange(Max[randCoord], canvas.width);
      } else {
        coordVal = randNumInRange(0, canvas.width);
        randCoordVal = randNumInRange(Max[randCoord], canvas.height);
      }
    }

    AttackObj[otherCoord] = coordVal;
    AttackObj[randCoord] = randCoordVal;

    context.beginPath();
    context.arc(AttackObj.x, AttackObj.y, AttackObj.radius, 0, 2*Math.PI);
    context.stroke();

    AllAttackObjects.push(AttackObj);
  }

  window.objs = AllAttackObjects;

  SimpleAttackMoveCircle();
};

function SimpleAttackMoveCircle () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (AllAttackObjects.length < 1) return;

  for (var x = 0; x < AllAttackObjects.length; x++) {
    let circle = AllAttackObjects[x];

    if (Math.abs(circle.xTo - circle.x) <= 10 && Math.abs(circle.yTo - circle.y) <= 10) {
      AllAttackObjects.splice(x, 1);
      continue;
    }

    var tx = circle.xTo - circle.x,
        ty = circle.yTo - circle.y,
        dist = Math.sqrt(tx*tx+ty*ty),
          //rad = Math.atan2(ty,tx),
          //angle = rad/Math.PI * 180;

        velX = (tx/dist)*circle.speed,
        velY = (ty/dist)*circle.speed;

    circle.x += velX;
    circle.y += velY;

    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
    context.fillStyle = circle.color;
    context.fill();
  }

  // setTimeout(SimpleAttackMoveCircle, 10);
  requestAnimationFrame(SimpleAttackMoveCircle);
};
