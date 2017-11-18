var Vector = require("/Users/decisiontoolbox/dev/steering/vector");//.
var Vehicle = require("/Users/decisiontoolbox/dev/steering/vehicle");//.

var Red = function(pos, vel) {
	Vehicle.call(this, pos, vel);
}
Red.prototype = new Vehicle;
Red.prototype.max_speed = 10;
Red.prototype.max_force = 5;
Red.prototype.mass = 1;
Red.prototype.perception = 20;
Red.prototype.leeway = 2;


var red = new Red;
//console.log(red);



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

	var target = new Vector(230, 420);
	var force = red.arrive(target);
	red.apply_force(force);

	console.log(red.position.distance(target), red.velocity.magnitude());
}
play();

global.play = play;//.hack bc i'm not using browserify standalone (yet?)
global.pause = pause;//.hack bc i'm not using browserify standalone (yet?)
