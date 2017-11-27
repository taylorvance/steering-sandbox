var Vector = Sandbox.Vector;
var Vehicle = Sandbox.Vehicle;


// configure classes

var Red = Sandbox.extendVehicle({
	maxSpeed: 200,
	maxForce: 5,
	mass: 1,
	perception: 50,
	leeway: 10,
	color: '#c00',
	size: 7
});

var Green = Sandbox.extendVehicle({
	maxSpeed: 200,
	maxForce: 10,
	mass: 1,
	perception: 100,
	leeway: 20,
	color: '#0c0',
	size: 4
});

var Blue = Sandbox.extendVehicle({
	maxSpeed: 150,
	maxForce: 15,
	mass: 1,
	perception: 100,
	leeway: 15,
	color: '#00c',
	size: 2
});


// set up vehicle instances

var red = Sandbox.createVehicle(Red, canvas.width / 2, canvas.height / 2);
var greens = [];
for (var i = 0, n = 20; i < n; i++) {
	greens.push(Sandbox.createVehicle(Green));
}
var blues = [];
for (var i = 0, n = 500; i < n; i++) {
	blues.push(Sandbox.createVehicle(Blue));
}
var tBlue = Sandbox.createVehicle(Blue); // red's target blue
blues.push(tBlue);


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
	red.applyForce(red.pursue(tBlue), dt);

	// greens flock toward red
	greens.forEach(function(green){
		var force = new Vector;

		force = force.add(green.flock(green.neighbors(greens), 10, 5, 4).scale(5));
		force = force.add(green.pursue(red).scale(3));

		green.applyForce(force, dt);
	});

	// blues either evade red or flock toward mouse
	blues.forEach(function(blue){
		var force = new Vector;

		if (blue.position.sqrDist(red.position) < Math.pow(blue.perception, 2)) {
			force = force.add(blue.evade(red).scale(3.5));
		} else {
			force = force.add(blue.flock(blue.neighbors(blues), 10, 5, 4).scale(4));
			force = force.add(blue.arrive(vMouse).scale(2));
		}

		blue.applyForce(force, dt);
	});
};
