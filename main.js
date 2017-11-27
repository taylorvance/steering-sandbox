var Vector = require("/Users/decisiontoolbox/dev/steering/vector");//.
var Vehicle = require("/Users/decisiontoolbox/dev/steering/vehicle");//.


global.Sandbox = {
	Vector: Vector,
	Vehicle: Vehicle
};


//.todo
Sandbox.extendVehicle = function(config) {
	/*
	if (typeof classname === "function") {
		console.error("Can't extend Vehicle using classname \"" + classname + "\" (already a function).");
		return false;
	}
	if (/[^a-zA-Z]/.test(classname)) {
		console.error("Can't extend Vehicle using classname \"" + classname + "\" (contains non-letters).");
		return false;
	}
	*/

	var VehicleSubclass = function(pos, vel) {
		Vehicle.call(this, pos, vel);
	};
	VehicleSubclass.prototype = new Vehicle;

	VehicleSubclass.prototype.max_speed = config.maxSpeed || 200;
	VehicleSubclass.prototype.max_force = config.maxForce || 20;
	VehicleSubclass.prototype.mass = config.mass || 1;
	VehicleSubclass.prototype.perception = config.perception || 50;
	VehicleSubclass.prototype.leeway = config.leeway || 10;
	VehicleSubclass.prototype.color = config.color || '#c00';
	VehicleSubclass.prototype.size = config.size || 2;

	return VehicleSubclass;
};



// set up html canvas
var canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext('2d');
Sandbox.getContext = function() { return ctx; };



global.vehicles = [];//.make this nonglobal?
Sandbox.createVehicle = function(VehicleSubclass, x, y) {
	if(VehicleSubclass.prototype.constructor.name !== "Vehicle") {
		console.error("Failed to create vehicle. Given function is not a \"subclass\" of Vehicle.", VehicleSubclass);
		return false;
	}

	x = x || Math.random() * canvas.width;
	y = y || Math.random() * canvas.height;

	var vehicle = new VehicleSubclass(new Vector(x, y));
	vehicles.push(vehicle);

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

	vehicles.forEach(function(v){
		v.draw();
	});
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
