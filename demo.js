var Vector = Sandbox.Vector;
var Vehicle = Sandbox.Vehicle;


// set up html canvas
var canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext('2d');


// default vehicle render code

Vehicle.prototype.color = '#ccc';
Vehicle.prototype.size = 2;
Vehicle.prototype.draw = function() {
	ctx.save();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
	ctx.restore();
};


// configure classes

var Red = Sandbox.extendVehicle("Red", {
	maxSpeed: 200,
	maxForce: 5,
	mass: 1,
	perception: 50,
	leeway: 10,
	color: '#c00',
	size: 7
});

var Green = Sandbox.extendVehicle("Green", {
	maxSpeed: 200,
	maxForce: 10,
	mass: 1,
	perception: 100,
	leeway: 20,
	color: '#0c0',
	size: 4
});

var Blue = Sandbox.extendVehicle("Blue", {
	maxSpeed: 150,
	maxForce: 15,
	mass: 1,
	perception: 100,
	leeway: 15,
	color: '#00c',
	size: 2
});

var Black = Sandbox.extendVehicle("Black");


// set up vehicle instances
var red = Sandbox.createVehicle(Red, new Vector(canvas.width / 2, canvas.height / 2));
var greens = [];
for (var i = 0, n = 20; i < n; i++) {
	greens.push(Sandbox.createVehicle(Green, new Vector(Math.random() * canvas.width, Math.random() * canvas.height)));
}
var blues = [];
for (var i = 0, n = 500; i < n; i++) {
	blues.push(Sandbox.createVehicle(Blue, new Vector(Math.random() * canvas.width, Math.random() * canvas.height)));
}
var tBlue = Sandbox.createVehicle(Blue, new Vector(Math.random() * canvas.width, Math.random() * canvas.height)); // red's target blue
blues.push(tBlue);
var black = Sandbox.createVehicle(Black, new Vector(canvas.width / 2, canvas.height / 2));

// special draw function for the target blue
tBlue.draw = function() {
	ctx.save();
	ctx.fillStyle = '#0ff';
	ctx.fillRect(this.position.x - 3, this.position.y - 3, 9, 9);
	ctx.restore();

	ctx.save();
	ctx.fillStyle = '#00c';
	ctx.fillRect(this.position.x, this.position.y, 3, 3);
	ctx.restore();
};


var clickPos = new Vector;
canvas.addEventListener("click", function(event){
	clickPos.x = event.clientX;
	clickPos.y = event.clientY;

	//greens.forEach(function(green){
		//green.applyForce(new Vector(0, -2), 1, true);
	//});
});


// steering behaviors
Sandbox.addUpdateFunction(function(){
	var dt = Sandbox.deltaTime;

	// red pursues the target blue
	red.applyForce(red.pursue(tBlue), dt);

	//red2.applyForce(red2.brake().scale(5), dt);

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
			force = force.add(blue.evade(red));
		} else {
			force = force.add(blue.flock(blue.neighbors(blues), 10, 5, 4).scale(2));
			force = force.add(blue.arrive(clickPos));
		}

		blue.applyForce(force, dt);
	});
});


// render code
Sandbox.addUpdateFunction(function(){
	ctx.fillStyle = '#def';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	Sandbox.vehicles.forEach(function(v){
		v.draw();
	});
});


// start the update loop
Sandbox.play();
