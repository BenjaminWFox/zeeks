// JavaScript Document

var canvas = document.createElement('canvas');
	canvas.id = 'Stage';
	canvas.width = '800';
	canvas.height = '400';
	
var htCanvas = document.createElement('canvas');
	htCanvas.id = 'HitTestCanvas';
	htCanvas.width = '0';
	htCanvas.height = '0';

var debug = document.createElement('div');

var ship = new Image();
	ship.src = "assets/SimpleShip.png";
	shipX = 250;
	shipY = 190;
	
var enemy = new Image();
	enemy.src = "assets/Ball.png";
	enemyX = 700 
	enemyY = 170
	enemyBounds = [enemyY, enemyY+enemy.height]
		
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

function Projectile(p_x, p_y) {
	this.img = new Image();
	this.img.src = "assets/Projectile.png";
	this.x = p_x;
	this.y = p_y;
}
	
var Projectiles = [];

var context = canvas.getContext('2d');

document.addEventListener("DOMContentLoaded", function(event){
	console.log("DOMContentLoaded");
	document.body.appendChild(canvas);
	document.body.appendChild(debug);
	
	ship.onload = function(){
		context.drawImage(ship, shipX, shipY);
		context.drawImage(enemy, enemyX, enemyY);
		enemyBounds[1] = enemyY+enemy.width;
		console.log(enemyBounds);
		//window.requestAnimationFrame(gameloop);
		//console.log(ship);
		requestAnimationFrame(gameloop);
	};
});

function gameloop(timestamp) {
	context.clearRect(0, 0, 800, 400);
	context.drawImage(ship, shipX, shipY);
	context.drawImage(enemy, enemyX, enemyY);
	
	if(moveLeft)
		shipX-=2;
	if(moveUp)
		shipY-=2;
	if(moveRight)
		shipX+=2;
	if(moveDown)
		shipY+=2;
	debug.innerHTML = "";
	if(Projectiles.length>0){
		for(p=0;p<Projectiles.length;p++)
		{
			//debug.innerHTML += Projectiles[p].x + ", " + Projectiles[p].y + "</br>";
			Projectiles[p].x += 8;
			context.drawImage(Projectiles[p].img, Projectiles[p].x, Projectiles[p].y);
			console.log(Projectiles[p].x + ", " + Projectiles[p].y);

			if(Projectiles[p].x > canvas.width+10)
			{
				Projectiles.splice(p, 1);
				p--;
			}

			else if(Projectiles[p].x+8 > enemyX && Projectiles[p].y > enemyBounds[0] && Projectiles[p].y < enemyBounds[1])
			{
				htCanvas.width = enemy.width;
				htCanvas.height = enemy.height;
				htCanvas.getContext('2d').drawImage(enemy, 0, 0, enemy.width, enemy.height);
				
				var pixelData = htCanvas.getContext('2d').getImageData(Projectiles[p].x+8-700, Projectiles[p].y-enemyBounds[0], 1, 1).data;
				
				if(pixelData[3]>0)
				{
					console.log(pixelData);
					
					Projectiles.splice(p, 1);
					p--;
				}
				
			}
			
		}
	}
	//console.log(timestamp);
	requestAnimationFrame(gameloop);
}

document.addEventListener("keydown", function(event){
		//console.log(event.keyCode);
		switch (event.keyCode) {
			case 37:
				moveLeft = true
				break;
			case 38:
				moveUp = true
				break;
			case 39:
				moveRight = true
				break;
			case 40:
				moveDown = true;
				break;
			case 32:
				//console.log("space");
				break;
		}
	});
	
document.addEventListener("keyup", function(event){
		switch (event.keyCode) {
			case 37:
				moveLeft = false
				break;
			case 38:
				moveUp = false
				break;
			case 39:
				moveRight = false
				break;
			case 40:
				moveDown = false;
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