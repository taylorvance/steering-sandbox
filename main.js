var Vector = require("/Users/decisiontoolbox/dev/steering/vector");//.
var Vehicle = require("/Users/decisiontoolbox/dev/steering/vehicle");//.




var Red = function(pos, vel) {
	Vehicle.call(this, pos, vel);
}
Red.prototype = new Vehicle;
// config Red vehicle vars
Red.prototype.max_speed = 100;
Red.prototype.max_force = 5;
Red.prototype.mass = 1;
Red.prototype.perception = 50;
Red.prototype.leeway = 10;


var Blue = function(pos, vel) {
	Vehicle.call(this, pos, vel);
}
Blue.prototype = new Vehicle;
// config Blue vehicle vars
Blue.prototype.max_speed = 150;
Blue.prototype.max_force = 15;
Blue.prototype.mass = 1;
Blue.prototype.perception = 100;
Blue.prototype.leeway = 20;




var red = new Red(new Vector(500, 200));
var blues = [];
for (var i = 0, n = 500; i < n; i++) {
	blues.push(new Blue(new Vector(Math.random() * 900, Math.random() * 500)));
}



var canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
canvas.height -= 50;
var ctx = canvas.getContext('2d');

var mouse = new Vector;
function mousemove(x, y) {
	mouse.x = x;
	mouse.y = y;
}

function render() {
	ctx.fillStyle = '#def';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.save();
	ctx.fillStyle = '#c00';
	ctx.fillRect(red.position.x, red.position.y, 7, 7);
	ctx.restore();

	blues.forEach(function(v){
		ctx.save();
		ctx.fillStyle = '#00c';
		ctx.fillRect(v.position.x, v.position.y, 3, 3);
		ctx.restore();
	});

	ctx.save();
	ctx.fillStyle = '#0cc';
	ctx.fillRect(blues[0].position.x, blues[0].position.y, 5, 5);
	ctx.restore();
}

var FPS = 30;
var intervalID;
var lastUpdate;
function play() {
	pause();
	lastUpdate = Date.now();
	intervalID = setInterval(tick, 1000/FPS);
}
function pause() {
	clearInterval(intervalID);
}
function tick() {
	var now = Date.now();
	var dt = (now - lastUpdate) / 1000;
	lastUpdate = now;


	//red.apply_force(red.pursue(blues[0]), dt);
	red.apply_force(red.seek(blues[0].position), dt);

	blues.forEach(function(blue){
		var force = new Vector;

		var neighbors = blue.neighbors(blues);
		force = force.add(blue.flock(neighbors, 5, 3, 2)).scale(3);

		if (blue.position.sqrDist(red.position) < Math.pow(blue.perception, 2)) {
			force = force.add(blue.evade(red).scale(3.5));
		} else {
			force = force.add(blue.arrive(mouse).scale(2));
		}

		blue.apply_force(force, dt);
	});


	render();
}

play();

global.play = play;//.hack bc i'm not using browserify standalone (yet?)
global.pause = pause;//.hack bc i'm not using browserify standalone (yet?)
global.mousemove = mousemove;//.hack bc i'm not using browserify standalone (yet?)
