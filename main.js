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

	VehicleSubclass.prototype.maxSpeed = config.maxSpeed || 200;
	VehicleSubclass.prototype.maxForce = config.maxForce || 20;
	VehicleSubclass.prototype.mass = config.mass || 1;
	VehicleSubclass.prototype.perception = config.perception || 50;
	VehicleSubclass.prototype.leeway = config.leeway || 10;
	VehicleSubclass.prototype.color = config.color || '#c00';
	VehicleSubclass.prototype.size = config.size || 2;

	return VehicleSubclass;
};



Sandbox.vehicles = [];
/**
 * @param {(string|Vehicle)} vehicleSubclass The name of the subclass or the actual class object.
 * @param {Vector} v Vehicle's position.
 */
Sandbox.createVehicle = function(vehicleSubclass, v) {
	// If we're given a string, see if we've defined a subclass with that name.
	if(typeof vehicleSubclass === "string") {
		vehicleSubclass = Sandbox.vehicleSubclasses[vehicleSubclass];
	}
	if(typeof vehicleSubclass !== "function" || vehicleSubclass.prototype.constructor.name !== "Vehicle") {
		console.error("Failed to create vehicle. First argument is not a subclass of Vehicle.", vehicleSubclass);
		return false;
	}

	var vehicle = new vehicleSubclass(v);
	Sandbox.vehicles.push(vehicle);

	return vehicle;
};


var updateFns = [];
Sandbox.addUpdateFunction = function(fn) {
	updateFns.push(fn);
};


var FPS = 30;

var lastUpdate;
Sandbox.deltaTime = 1;
var update = function() {
	var now = Date.now();
	Sandbox.deltaTime = (now - lastUpdate) / 1000;
	lastUpdate = now;

	if(document.hasFocus()) {
		updateFns.forEach(function(fn){
			fn();
		});
	}
};


var intervalID;
Sandbox.play = function() {
	Sandbox.pause();
	lastUpdate = Date.now();
	intervalID = setInterval(update, 1000/FPS);
};
Sandbox.pause = function() {
	clearInterval(intervalID);
};
