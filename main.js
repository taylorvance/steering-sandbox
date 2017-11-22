var Vector = require("/Users/decisiontoolbox/dev/steering/vector");//.
var Vehicle = require("/Users/decisiontoolbox/dev/steering/vehicle");//.


global.Sandbox = {
	Vector: Vector,
	Vehicle: Vehicle
};


//.todo
Sandbox.extendVehicle = function(classname, config) {
	if (typeof classname === "function") {
		console.error("Can't extend Vehicle using classname \"" + classname + "\" (already a function).");
		return false;
	}
	if (/[^a-zA-Z]/.test(classname)) {
		console.error("Can't extend Vehicle using classname \"" + classname + "\" (contains non-letters).");
		return false;
	}

	return;//.the below is what needs to happen
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
};



// set up html canvas
var canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext('2d');
Sandbox.getContext = function() { return ctx; };



global.vehicles = {};//.make this nonglobal?
Sandbox.createVehicle = function(clsname, x, y) {
	x = x || Math.random() * canvas.width;
	y = y || Math.random() * canvas.height;

	//.use "instance of" instead
	if (['Red', 'Green', 'Blue'].indexOf(clsname) === -1) return;
	//eval('var vehicle = new '+clsname+'(new Vector('+x+', '+y+'));'); // I know, bite me.
	var vehicle = new window[clsname](new Vector(x, y));

	if (!Array.isArray(vehicles[clsname])) {
		vehicles[clsname] = [];
	}

	vehicles[clsname].push(vehicle);

	return vehicle;
};


// default render code
Vehicle.prototype.color = '#ccc';
Vehicle.prototype.size = 2;
Vehicle.prototype.draw = function() {
	ctx.save();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
	ctx.restore();
};


function render() {
	ctx.fillStyle = '#def';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (clsname in vehicles) {
		vehicles[clsname].forEach(function(v){
			v.draw();
		});
	}
}


global.vMouse = new Vector;
canvas.addEventListener("click", function(event){
	vMouse.x = event.clientX;
	vMouse.y = event.clientY;
});


var FPS = 30;
var lastUpdate;


var update = function() {
	var now = Date.now();
	Sandbox.deltaTime = (now - lastUpdate) / 1000;
	lastUpdate = now;

	if (typeof window.myupdate === "function") {
		window.myupdate();
	}

	render();
};


var intervalID;
Sandbox.pause = function() {
	clearInterval(intervalID);
};
Sandbox.play = function() {
	Sandbox.pause();
	lastUpdate = Date.now();
	intervalID = setInterval(update, 1000/FPS);
};
Sandbox.play();
