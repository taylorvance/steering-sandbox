var Vector = Sandbox.Vector;
var Vehicle = Sandbox.Vehicle;


// configure classes
//.figure out a better/programatic way to do this (WIP in main.js)

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
Blue.prototype.leeway = 15;
Blue.prototype.color = '#00c';

// set up vehicle instances

var red = Sandbox.createVehicle('Red', canvas.width / 2, canvas.height / 2);
for (var i = 0, n = 20; i < n; i++) {
	Sandbox.createVehicle('Green');
}
for (var i = 0, n = 500; i < n; i++) {
	Sandbox.createVehicle('Blue');
}
var tBlue = Sandbox.createVehicle('Blue'); // red's target blue

// special draw function for the target blue
tBlue.draw = function() {
	var ctx = Sandbox.getContext();

	ctx.save();
	ctx.fillStyle = '#0ff';
	ctx.fillRect(this.position.x - 3, this.position.y - 3, 9, 9);
	ctx.restore();

	ctx.save();
	ctx.fillStyle = '#00c';
	ctx.fillRect(this.position.x, this.position.y, 3, 3);
	ctx.restore();
};



window.myupdate = function() {
	var dt = Sandbox.deltaTime;

	// red pursues the target blue
	red.apply_force(red.pursue(tBlue), dt);

	// greens flock toward red
	vehicles['Green'].forEach(function(green){
		var force = new Vector;

		force = force.add(green.flock(green.neighbors(vehicles['Green']), 10, 5, 4).scale(5));
		force = force.add(green.pursue(red).scale(3));

		green.apply_force(force, dt);
	});

	// blues either evade red or flock toward mouse
	vehicles['Blue'].forEach(function(blue){
		var force = new Vector;

		if (blue.position.sqrDist(red.position) < Math.pow(blue.perception, 2)) {
			force = force.add(blue.evade(red).scale(3.5));
		} else {
			force = force.add(blue.flock(blue.neighbors(vehicles['Blue']), 10, 5, 4).scale(4));
			force = force.add(blue.arrive(vMouse).scale(2));
		}

		blue.apply_force(force, dt);
	});
};
