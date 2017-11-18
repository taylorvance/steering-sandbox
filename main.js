var Vector = require("/Users/decisiontoolbox/dev/steering/vector");//.
var Vehicle = require("/Users/decisiontoolbox/dev/steering/vehicle");//.

var Red = function(pos, vel) {
	Vehicle.call(this, pos, vel);
}
Red.prototype = new Vehicle;

// config Red vehicle vars
Red.prototype.max_speed = 300;
Red.prototype.max_force = 50;
Red.prototype.mass = 1;
Red.prototype.perception = 50;
Red.prototype.leeway = 10;

var red = new Red;
//console.log(red);





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
	ctx.fillRect(red.position.x, red.position.y, 3, 3);
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

	var force = red.arrive(mouse);

	red.apply_force(force, dt);

	render();
}
play();

global.play = play;//.hack bc i'm not using browserify standalone (yet?)
global.pause = pause;//.hack bc i'm not using browserify standalone (yet?)
global.mousemove = mousemove;//.hack bc i'm not using browserify standalone (yet?)
