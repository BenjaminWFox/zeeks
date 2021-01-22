// JavaScript Document
function UiView() {
	var self = this;
	var canvas;
	var context;
	
	this.create = function() {
		self.canvas = document.createElement('canvas');
			self.canvas.id = 'Stage';
			self.canvas.width = 640;
			self.canvas.height = 900;//1136;
		self.context = self.canvas.getContext('2d');
		
		document.addEventListener("DOMContentLoaded", game.domLoaded);
		
		document.addEventListener("keydown", game.keyDown);
		
		document.addEventListener("keyup", game.keyUp);
		
		// add event listener for key presses here
	}

	this.destroy = function () {

	}

	this.render = function() {
		document.body.appendChild(self.canvas);
		
		self.context = self.canvas.getContext('2d'); //document.getElementById("Stage").getContext('2d');
	}
}

/* - Two ways of declaring class methods
UiView.prototype.create2 = function() {
	console.log("created2");
}
*/