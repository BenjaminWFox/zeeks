// JavaScript Document

// Canvas
var canvas = document.createElement('canvas');
	canvas.id = 'Stage';
	canvas.width = 640;
	canvas.height = 1136;

var gameOver = false;

// Singleton BALL asset
var ball = new function() {
	this.image = new Image();
	this.image.src = "assets/Ball.png";
	this.x = 295;
	this.y = 20;
	this.vx = 0;
	this.vy = 10;
	this.direction = 0;
	this.friction = .98;
	this.onBar = false;
	this.isStuck = false;
	this.xScale = 1;
	this.yScale = 1;
	
	this.updateMXBY = function(p_x, p_y, p_img) {
		this.middleX = p_x + p_img.width/2;
		this.bottomY = p_y + p_img.height;
	}
}

// Reusable class for all other image assets
function imageAsset(p_x, p_y, p_src) {
	this.image = new Image();
	this.image.src = p_src;
	this.x = p_x;
	this.y = p_y;
}

// Non-ball image assets
var leftBar = new imageAsset(2, 326, "assets/LeftBar.png");
var rightBar = new imageAsset(116, 325, "assets/RightBar.png");
var leftTrack = new imageAsset(12, 0, "assets/TrackLine.png");
var rightTrack = new imageAsset(626, 0, "assets/TrackLine.png");
var leftSlider = new imageAsset(4, 300, "assets/TrackSlider.png");
var rightSlider = new imageAsset(618, 300, "assets/TrackSlider.png");
var goodHole = new imageAsset(150, 15, "assets/GoodHole.png");
var badHole = new imageAsset(165, 105, "assets/BadHole.png");

console.log(leftTrack.image);

// Left and Right points for bar angles
var lpX = leftBar.x + 11;
var lpY = leftBar.y + 10;
var rpX = rightBar.x + 511;
var rpY = rightBar.y + 11;

// Booleans to detect movement
var moveLUp = false;
var moveLDown = false;
var moveRUp = false;
var moveRDown = false;
var atRest = false;

// The canvas context
var context = canvas.getContext('2d');

// Game loop for all things repeating
function gameloop(timestamp) {
	if(gameOver === false) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(leftTrack.image, leftTrack.x, leftTrack.y);
		context.drawImage(rightTrack.image, rightTrack.x, rightTrack.y);
		context.drawImage(leftSlider.image, leftSlider.x, leftSlider.y);
		context.drawImage(rightSlider.image, rightSlider.x, rightSlider.y);
		
		context.drawImage(goodHole.image, goodHole.x, goodHole.y);
		context.drawImage(badHole.image, badHole.x, badHole.y);
		
		
		// Movement of the sliders up and down
		if(moveLUp && leftSlider.y > 0 && leftSlider.y-rightSlider.y > -500){
			leftSlider.y-=2;
			lpY-=2;}
		if(moveLDown && leftSlider.y+70 < canvas.height && leftSlider.y-rightSlider.y < 500){
			leftSlider.y+=2;
			lpY+=2;}
		if(moveRUp && rightSlider.y > 0 && leftSlider.y-rightSlider.y < 500){
			rightSlider.y-=2;
			rpY-=2;}
		if(moveRDown && rightSlider.y+70 < canvas.height && leftSlider.y-rightSlider.y > -500){
			rightSlider.y+=2;
			rpY+=2;}
	
		// Get the differences between the X and Y coordinates of the left & right pivot points
		var difX = rpX - lpX;
		var difY = rpY - lpY;
		
		// Calculate the theta (I don't really get what that is) and also the friendly angle of the bars
		var theta = Math.atan2(difY, difX);
		var angle = theta * 180 / Math.PI;
		
		// SAVE context before figuring out bar positions	
		context.save()
		// Perform calculations to move the left and right bars
		context.translate(lpX, lpY);
		context.rotate(theta);
		context.drawImage(leftBar.image, -(12), -10);
	
		context.restore();
		context.save();
	
		context.translate(rpX, rpY);
		context.rotate(theta);
		context.drawImage(rightBar.image, -(rightBar.image.width-12), -11);	
	
		// RESTORE context after drawing bars. Move on to figuring out where to put the ball
		context.restore();
		
	/* MOVING ** Y ** COORDINATE */
		var xPositionPercent = (ball.middleX-lpX) / (rpX-lpX);
		
		var distFromBar = 8+Math.abs(angle)*.1;// + Math.abs(angle*.1);
			
		var yStopPoint = lpY + xPositionPercent * difY - ball.image.height - distFromBar;
		
		ball.y = yStopPoint;
	
	
	/* MOVING ** X ** COORDINATE */
		// calculate momentum and update ball posision
		ball.vx += theta*6	;
		
		// Friction will stop the ball when the bar is flattened out
		ball.vx *= ball.friction;
		
		//console.log(ball.vx)
		
		ball.x += ball.vx;
		
		// check for side collision
		if(ball.x < leftSlider.x+leftSlider.image.width)
		{	
			ball.x = leftSlider.x+leftSlider.image.width;
			ball.vx = 0;
		} else if (ball.x+ball.image.width > rightSlider.x) {
			ball.x = rightSlider.x-ball.image.width;
			ball.vx = 0;
		}
	
		// Keeping in case of future debugging need
		//console.log("bmx 1: " + ball.middleX + ", rbx: " + rightBar.x + ", bx: " + ball.x + ", vx: " + ball.vx + ", is: " + ball.isStuck); 
	
		// If the ball is moving right, check whether it will catch on the bar join
		if(ball.vx === Math.abs(ball.vx)) {
			// If the ball is moving fast enough it won't catch
			if(ball.vx < 2.25) {
				// If the ball is at the join, it catches
				if(ball.middleX < rightBar.x+2 && ball.middleX > rightBar.x - 1 && ball.isStuck === false && theta < 0.25) {
					ball.x -= ball.vx;
					ball.vx = 0;
					ball.isStuck = true;
				// All subsequent times we want to make sure the ball aligns properly with the joint
				} else if (ball.isStuck === true && theta > 0){
					ball.x -= ball.vx;
					ball.vx = 0;
					ball.x = rightBar.x-(ball.image.width/2)+(angle*1.4);
					// If the ball is moving left or the bars are at a steep angle, the ball is free
					if(theta > 0.25 || ball.vx < 0) {
						ball.isStuck = false;
					}
				// Make sure the ball is unstuck if it is at the join and the bars are flat of left-tilted
				} else {
					ball.isStuck = false;
				}
			}
		// If the ball is left-moving it isn't stuck
		}else {
			ball.isStuck = false;
		}
		
		checkHoleCollisions(ball, badHole, goodHole);
		
		// Update ball position on the canvas, and the bottom-middle point
		context.drawImage(ball.image, ball.x, ball.y);
		ball.updateMXBY(ball.x, ball.y, ball.image);
	
		// Keep running the gameloop
		requestAnimationFrame(gameloop);
	}
}

function checkHoleCollisions(p_ball, p_bad, p_good) {
	var ballcp = [p_ball.x+p_ball.image.width/2, p_ball.y+p_ball.image.height/2]
	var badcp = [p_bad.x+p_bad.image.width/2, p_bad.y+p_bad.image.height/2]
	var goodcp = [p_good.x+p_good.image.width/2, p_good.y+p_good.image.height/2]
	
	console.log("X: " + ballcp[0] + " / " + badcp[0] + " - Y: " + ballcp[1] + " / " + badcp[1]);
	
	if((ballcp[0] > badcp[0]-15 && ballcp[0] < badcp[0] + 15) && (ballcp[1] > badcp[1]-15 && ballcp[1] < badcp[1] + 15)) {
		gameOver = true;
		finalAnimation(p_ball, p_bad);
	}
	if((ballcp[0] > goodcp[0]-15 && ballcp[0] < goodcp[0] + 15) && (ballcp[1] > goodcp[1]-15 && ballcp[1] < goodcp[1] + 15)) {
		gameOver = true;
		finalAnimation(p_ball, p_good);
	}
}

function finalAnimation(p_ball, p_hole) {
	shrinkBall (p_ball, p_hole);
}

function shrinkBall (timestamp) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(leftTrack.image, leftTrack.x, leftTrack.y);
	context.drawImage(rightTrack.image, rightTrack.x, rightTrack.y);
	context.drawImage(leftSlider.image, leftSlider.x, leftSlider.y);
	context.drawImage(rightSlider.image, rightSlider.x, rightSlider.y);
	
	context.drawImage(goodHole.image, goodHole.x, goodHole.y);
	context.drawImage(badHole.image, badHole.x, badHole.y);
	
	if(ball.xScale >= 0) {
	context.save();
	ball.xScale -= .1;
	ball.yScale -= .1;
	
	console.log("X: " + ball.x + " - Y: " + ball.y);
	
	context.scale(ball.xScale, ball.yScale)
	context.drawImage(ball.image, ball.x/ball.xScale, ball.y/ball.yScale, ball.image.width*ball.xScale, ball.image.width*ball.yScale);
	console.log("Shrink...");
	context.restore();
	
	requestAnimationFrame(shrinkBall);
	}
}

/****** LISTENERS ******/
document.addEventListener("DOMContentLoaded", function(event){
	document.body.appendChild(canvas);
	
	ball.image.onload = function(){
		context.drawImage(leftTrack.image, leftTrack.x, leftTrack.y);
		context.drawImage(rightTrack.image, rightTrack.x, rightTrack.y);
		context.drawImage(leftSlider.image, leftSlider.x, leftSlider.y);
		context.drawImage(rightSlider.image, rightSlider.x, rightSlider.y);
		context.drawImage(leftBar.image, leftBar.x, leftBar.y);
		context.drawImage(rightBar.image, rightBar.x, rightBar.y);
		context.drawImage(ball.image, ball.x, ball.y);
		
		ball.updateMXBY(ball.x, ball.y, ball.image);
							
		requestAnimationFrame(gameloop);
	};
});

document.addEventListener("keydown", function(event){
	//console.log(event.keyCode);
	switch (event.keyCode) {
		case 81:
			moveLUp = true
			break;
		case 68:
			moveLDown = true
			break;
		case 80:
			moveRUp = true
			break;
		case 75:
			moveRDown = true
			break;
		case 32:
			//console.log("space");
			break;
	}
});
	
document.addEventListener("keyup", function(event){
	switch (event.keyCode) {
		case 81:
			moveLUp = false
			break;
		case 68:
			moveLDown = false
			break;
		case 80:
			moveRUp = false
			break;
		case 75:
			moveRDown = false
			break;
		case 32:
			console.log("space");
			Projectiles.push(new Projectile(shipX+20,shipY+6));	
			break;
	}
});
	
/*
window.addEventListener("load", function(event){
		console.log("load");
	});
*/