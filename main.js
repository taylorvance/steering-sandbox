global.Vector = require("/Users/decisiontoolbox/dev/steering/vector");//.
global.Vehicle = require("/Users/decisiontoolbox/dev/steering/vehicle");//.



// default render code
Vehicle.prototype.color = '#ccc';
Vehicle.prototype.size = 3;
Vehicle.prototype.draw = function() {
	ctx.save();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
	ctx.restore();
};


//.todo
var vehicleSubclasses = [];
function extendVehicle(config) {
	var classname = config.classname;
}





// set up html canvas
var canvas = document.getElementById('canvas');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
global.ctx = canvas.getContext('2d');//.make this nonglobal



global.vehicles = {};//.make this nonglobal
global.createVehicle = function(clsname, x, y) {
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
global.vehicles = vehicles;//.try to remove this necessity



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
var intervalID;
var lastUpdate;


global.play = function() {
	pause();
	lastUpdate = Date.now();
	intervalID = setInterval(tick, 1000/FPS);
};

global.pause = function() {
	clearInterval(intervalID);
};


//.to be overridden in demo code. figure out cleaner way. instead call the demo's function inside this function?
global.tick = function() {
	var now = Date.now();
	global.dt = (now - lastUpdate) / 1000;//.this is bad. shouldn't be global
	lastUpdate = now;

	if (typeof window.mytick === "function") {
		window.mytick();
	}

	render();
};

play();
