// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
   var lastTime = 0;
   var vendors = ['ms', 'moz', 'webkit', 'o'];
   for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
   }

   if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
         var currTime = new Date().getTime();
         var timeToCall = Math.max(0, 16 - (currTime - lastTime));
         var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
         lastTime = currTime + timeToCall;
         return id;
      };
   }

   if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
         clearTimeout(id);
      };
   }
}());








var partNum = 100,
    start = [400,400],
    frame = 0;

var c = document.getElementById("animation-canvas"),
    context = c.getContext("2d");
var p = [];

for (var i = 0; i < partNum; i++) {
   var ptcl = new Particle();
   p.push(ptcl);
}

function returnRand() {
   return Math.round(Math.random()*255);
}

function Particle() {
   this.radius = Math.random() * 10 + 2;
   this.velocity = Math.random() * 20 + 20;
   this.direction = Math.round(Math.random()) - .5;
   // this.color = (function(){
   //    var c = "rgba("+returnRand()+","+returnRand()+","+returnRand()+","+Math.random()+")";
   //        console.log(c);
   //        return c;
   // }());
   // this.color = "rgba(123, 216, 76, 1)";

   if (returnRand() % 2) {
      this.color = "rgba(0, 32, 232, 1)";
   } else {
      this.color = "rgba(0, 167, 32, 1)";
   }
}

function draw() {
   if (window.SiezeAttack === true || AnimationStop === true) {
     context.clearRect(0, 0, c.width, c.height, "#000");
     return;
   }

   context.clearRect(0, 0, c.width, c.height, "#000");

   for (var i = 0; i < p.length; i++){
      var point = p[i];
      // rotate based on velocity in degrees, roughly
      var rot = (frame*point.velocity*point.direction)/360;
      var x = Math.sin(frame/100)*180 * Math.cos(rot) + 200;
      var y = Math.cos(frame/100)*180 * Math.sin(rot) + 200;
      context.beginPath(x, y);
      // context.arc(x, y, point.radius, 0, 2*Math.PI);
      context.arc(x, y, point.radius, 0, 2*Math.PI);
      context.fillStyle = point.color;
      context.fill();

      var rot = (frame*point.velocity*point.direction)/360;
      var x = Math.cos(frame/50)*180 * Math.cos(rot) + 200;
      var y = Math.sin(frame/50)*180 * Math.sin(rot) + 200;
      context.beginPath(x, y);
      context.arc(x, y, point.radius, 0, 2*Math.PI);
      context.fillStyle = point.color;
      context.fill();

      context.fillStyle = "#fff";
   }
   frame++;
   requestAnimationFrame(draw);
}

var startShieldAnimation = function() {
   // set some crap up
   // Sets the actual dimensions of the canvas... Be careful!
   c.width = 400;
   c.height = 400;
   // let's kick this pig
   requestAnimationFrame(draw);
}
// init();
