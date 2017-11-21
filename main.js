var Vector = require("/Users/decisiontoolbox/dev/steering/vector");//.
var Vehicle = require("/Users/decisiontoolbox/dev/steering/vehicle");//.



// extra methods for rendering in the demo
Vehicle.prototype.color = '#ccc';
Vehicle.prototype.size = 3;
Vehicle.prototype.draw = function() {
	ctx.save();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
	ctx.restore();
};

// config classes

var Red = function(pos, vel) {
	Vehicle.call(this, pos, vel);
}
Red.prototype = new Vehicle;
// config Red vehicle vars
Red.prototype.max_speed = 200;
Red.prototype.max_force = 5;
Red.prototype.mass = 1;
Red.prototype.perception = 50;
Red.prototype.leeway = 10;
Red.prototype.color = '#c00';
Red.prototype.size = 7;

var Green = function(pos, vel) {
	Vehicle.call(this, pos, vel);
}
Green.prototype = new Vehicle;
// config Green vehicle vars
Green.prototype.max_speed = 200;
Green.prototype.max_force = 10;
Green.prototype.mass = 1;
Green.prototype.perception = 100;
Green.prototype.leeway = 20;
Green.prototype.color = '#0c0';
Green.prototype.size = 4;

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
Blue.prototype.color = '#00c';




// set up html canvas

var canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext('2d');



var vehicles = [];
function createVehicle(clsname, x, y) {
	if(['Red', 'Green', 'Blue'].indexOf(clsname) === -1) return;

	x = x || Math.random() * canvas.width;
	y = y || Math.random() * canvas.height;

	eval('var vehicle = new '+clsname+'(new Vector('+x+', '+y+'));');

	//.hack. we shouldn't care about these arrays, especially in this function.
	if(clsname === 'Red') {
	} else if(clsname === 'Green') {
		greens.push(vehicle);
	} else if(clsname === 'Blue') {
		blues.push(vehicle);
	}

	vehicles.push(vehicle);

	return vehicle;
}
global.createVehicle = createVehicle;//.hack bc i'm not using browserify standalone (yet?)


// set up vehicle instances

var red = createVehicle('Red', canvas.width / 2, canvas.height / 2);
var greens = [];
for (var i = 0, n = 20; i < n; i++) {
	createVehicle('Green');
}
var blues = [];
for (var i = 0, n = 500; i < n; i++) {
	createVehicle('Blue');
}



function render() {
	ctx.fillStyle = '#def';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//.hack. highlight the first blue (red's target) in cyan.
	ctx.save();
	ctx.fillStyle = '#0ff';
	ctx.fillRect(blues[0].position.x - 3, blues[0].position.y - 3, 9, 9);
	ctx.restore();

	vehicles.forEach(function(v){
		v.draw();
	});
}

var mouse = new Vector;
function mousemove(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}
canvas.addEventListener("click", mousemove);

var FPS = 30;
var intervalID;
var lastUpdate;

function play() {
	pause();
	lastUpdate = Date.now();
	intervalID = setInterval(tick, 1000/FPS);
}
global.play = play;//.hack bc i'm not using browserify standalone (yet?)
function pause() {
	clearInterval(intervalID);
}
global.pause = pause;//.hack bc i'm not using browserify standalone (yet?)

function tick() {
	var now = Date.now();
	var dt = (now - lastUpdate) / 1000;
	lastUpdate = now;


	// red seeks the first blue
	red.apply_force(red.pursue(blues[0]), dt);
	//red.apply_force(red.seek(blues[0].position), dt);

	// greens flock toward red
	greens.forEach(function(green){
		var force = new Vector;

		var neighbors = green.neighbors(greens);
		force = force.add(green.flock(neighbors, 10, 5, 4)).scale(5);
		force = force.add(green.pursue(red).scale(3));

		green.apply_force(force, dt);
	});

	// blues either evade red or flock toward mouse
	blues.forEach(function(blue){
		var force = new Vector;

		if (blue.position.sqrDist(red.position) < Math.pow(blue.perception, 2)) {
			force = force.add(blue.evade(red).scale(3.5));
		} else {
			var neighbors = blue.neighbors(blues);
			force = force.add(blue.flock(neighbors, 10, 5, 4)).scale(3);

			force = force.add(blue.arrive(mouse).scale(2));
		}

		blue.apply_force(force, dt);
	});


	render();
}

play();
