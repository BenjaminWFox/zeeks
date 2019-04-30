// JavaScript Document
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
