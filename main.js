var Vector = require("/Users/decisiontoolbox/dev/steering/vector");//.
var Vehicle = require("/Users/decisiontoolbox/dev/steering/vehicle");//.


var Steersman = function() {
	this.vehicles = [];
	this.vehicleSubclasses = {};
	this.updateFns = [];
	this.FPS = 30;
};

//.del this stuff when you figure out how to do it better
Steersman.Vector = Vector;
Steersman.Vehicle = Vehicle;
global.Steersman = Steersman;

Steersman.prototype.extendVehicle = function(name, config) {
	config = config || {};

	// "Extend" the base Vehicle "class"
	this.vehicleSubclasses[name] = function(pos, vel) {
		Vehicle.call(this, pos, vel);
	};
	this.vehicleSubclasses[name].prototype = new Vehicle;

	// Set child class variables
	this.vehicleSubclasses[name].prototype.maxSpeed = config.maxSpeed || 200;
	this.vehicleSubclasses[name].prototype.maxForce = config.maxForce || 20;
	this.vehicleSubclasses[name].prototype.mass = config.mass || 1;
	this.vehicleSubclasses[name].prototype.perception = config.perception || 50;
	this.vehicleSubclasses[name].prototype.leeway = config.leeway || 10;
	this.vehicleSubclasses[name].prototype.color = config.color || '#c00';
	this.vehicleSubclasses[name].prototype.size = config.size || 2;

	return this.vehicleSubclasses[name];
};



/**
 * @param {(string|Vehicle)} vehicleSubclass The name of the subclass, or the actual class object.
 * @param {Vector} pos Vehicle's position.
 * @param {Vector} vel Vehicle's velocity.
 */
Steersman.prototype.createVehicle = function(vehicleSubclass, pos, vel) {
	// If we're given a string, see if we've defined a subclass with that name.
	if(typeof vehicleSubclass === "string") {
		vehicleSubclass = this.vehicleSubclasses[vehicleSubclass];
	}
	//.this won't work if the subclass does not directly extend Vehicle (2nd gen subclass)
	if(typeof vehicleSubclass !== "function" || vehicleSubclass.prototype.constructor.name !== "Vehicle") {
		console.error("Failed to create vehicle. First argument is not a subclass of Vehicle.", vehicleSubclass);
		return false;
	}

	var vehicle = new vehicleSubclass(pos, vel);
	this.vehicles.push(vehicle);

	return vehicle;
};


Steersman.prototype.addUpdateFunction = function(fn) {
	this.updateFns.push(fn);
};



Steersman.prototype.update = function() {
	// update time variables
	this.now = Date.now();
	this.deltaTime = (this.now - this.lastUpdate) / 1000;

	// perform all update functions
	this.updateFns.forEach(function(fn){ fn(); });

	this.lastUpdate = this.now;
};


Steersman.prototype.play = function() {
	this.pause();
	this.lastUpdate = Date.now();
	this.intervalID = setInterval(this.update.bind(this), 1000 / this.FPS);
};
Steersman.prototype.pause = function() {
	clearInterval(this.intervalID);
};
