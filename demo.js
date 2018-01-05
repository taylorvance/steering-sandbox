var Vector = Steersman.Vector;
var Vehicle = Steersman.Vehicle;


var steersman = new Steersman;

// set up html canvas
var canvas = document.getElementById('canvas');
steersman.ctx = canvas.getContext('2d');


// default vehicle render code

Vehicle.prototype.color = '#ccc';
Vehicle.prototype.size = 2;
Vehicle.prototype.draw = function(ctx) {
	ctx.save();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
	ctx.restore();
};


// configure classes

var Red = steersman.extendVehicle("Red", {
	maxSpeed: 200,
	maxForce: 5,
	mass: 1,
	perception: 50,
	color: '#c00',
	size: 7
});

var Green = steersman.extendVehicle("Green", {
	maxSpeed: 200,
	maxForce: 10,
	mass: 1,
	perception: 100,
	color: '#0c0',
	size: 4
});

var Blue = steersman.extendVehicle("Blue", {
	maxSpeed: 150,
	maxForce: 15,
	mass: 1,
	perception: 100,
	color: '#00c',
	size: 2
});

var Black = steersman.extendVehicle("Black");


// set up vehicle instances
var red = steersman.createVehicle(Red, new Vector(canvas.width / 2, canvas.height / 2));
var greens = [];
for (var i = 0, n = 10; i < n; i++) {
	greens.push(steersman.createVehicle(Green, new Vector(Math.random() * canvas.width, Math.random() * canvas.height)));
}
var blues = [];
for (var i = 0, n = 200; i < n; i++) {
	blues.push(steersman.createVehicle(Blue, new Vector(Math.random() * canvas.width, Math.random() * canvas.height)));
}
var tBlue = steersman.createVehicle(Blue, new Vector(Math.random() * canvas.width, Math.random() * canvas.height)); // red's target blue
blues.push(tBlue);
//var black = steersman.createVehicle(Black, new Vector(canvas.width / 2, canvas.height / 2));

// special draw function for the target blue
tBlue.draw = function(ctx) {
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
steersman.addUpdateFunction(function(){
	var dt = steersman.deltaTime;//.should be using this.deltaTime

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
steersman.addUpdateFunction(function(){
	var ctx = steersman.ctx;//.should be using this.ctx
	ctx.fillStyle = '#def';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	steersman.vehicles.forEach(function(v){
		v.draw(ctx);
	});
});
