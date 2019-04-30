// JavaScript Document
function GameController() {
  var self = this;
  var gameIsRunning = false;
  this.gameModel;
  this.levelModel;
  this.unloadedAssets = [];
  this.uiView;
  this.sliderView;
  this.ballView;
  this.levelView;
  this.gameOver;
  this.difX;
  this.difY;
  this.theta;
  this.angle;
  this.oldTheta;
  this.velocity;

  this.create = function() {

    self.gameModel = new GameModel();
    self.levelModel = new LevelModel();

    self.uiView = new UiView();
    self.uiView.create();

    self.sliderView = new SliderView();
    self.sliderView.create();

    self.ballView = new BallView();
    self.ballView.create();

    self.levelView = new LevelView();
    self.levelView.create();

  }
  this.domLoaded = function() {
    //self.loadAllImages(self.gameModel.assetCollection);

    self.uiView.render();
    self.sliderView.render();
    self.ballView.render();
    self.levelView.render();
  };
  this.isGameRunning = function(){
    return gameIsRunning;
  }
  this.allowGameRunning = function(p_running) {
    gameIsRunning = p_running;
  }
  this.loadAllImages = function(p_obj) {
      // Convert JSON-ish images list into array
      var arr = Object.keys(p_obj).map(function(k) { return p_obj[k] });
      for(i=0;i<arr.length;i++)
      {
          console.log(arr[i].src);
      }
  }
  this.gameContext = function() {
      return self.uiView.context;	
  }
  this.gameCanvas = function() {
      return self.uiView.canvas;	
  }
  this.level = function(p_levelData) {
    this.badHoles = p_levelData.loseHolesLoc;
    this.goodHole = p_levelData.winHoleLoc;
    this.badImg = p_levelData.loseHolesImg;
    this.goodImg = p_levelData.winHoleImg;
  }
  this.ball = function(p_obj) {
    this.image = new Image();
    this.image.src = p_obj.src;
    this.x = p_obj.x;
    this.y = p_obj.y;
    this.vx = p_obj.vx;
    this.vy = p_obj.vy;
    this.direction = p_obj.direction;
    this.friction = p_obj.friction;
    this.onBar = p_obj.onBar;
    this.isStuck = p_obj.isStuck;
    this.xScale = p_obj.xScale;
    this.yScale = p_obj.yScale;
    this.xOffset = p_obj.xOffset;
    this.yOffset = p_obj.yOffset;
    this.xVeloScale = p_obj.xVeloScale;
    this.xStickVelo = p_obj.xStickVelo;
    this.traveled = p_obj.traveled;
    this.updateMXBY = function(p_x, p_y, p_img) {
        this.middleX = p_x + p_img.width/2;
        this.bottomY = p_y + p_img.height;
    }
    this.allowDraw = true;
    var thisAsset = self.guid();
    self.unloadedAssets.push(thisAsset);
    this.image.onload = function(event) {
      self.unloadedAssets.splice(self.unloadedAssets.indexOf(this.thisAsset), 1);
      self.checkLoadStatus();
    }
  }
  this.imageAsset = function(p_obj) {

    var thisAsset = self.guid();

    self.unloadedAssets.push(thisAsset);

    this.image = new Image();

    this.image.src = p_obj.src;

    this.x = p_obj.x;

    this.y = p_obj.y;

    this.allowDraw = true;

    this.image.onload = function(event) {
      self.unloadedAssets.splice(self.unloadedAssets.indexOf(thisAsset), 1);
      self.checkLoadStatus();
    }
  }
  this.checkLoadStatus = function() {
    if(self.unloadedAssets.length === 0) {
      self.assetsLoaded();
    }
  }
  this.assetsLoaded = function() {
    self.renderStandardUi();
    self.renderBall();

    self.allowGameRunning(true);
    self.gameloop({});
  }
  this.keyDown = function(event) {
      //console.log(event.keyCode);
      switch (event.keyCode) {
          case 81:
              self.directions.moveLUp = true
              break;
          case 68:
              self.directions.moveLDown = true
              break;
          case 80:
              self.directions.moveRUp = true
              break;
          case 75:
              self.directions.moveRDown = true
              break;
          case 32:
              //console.log("space");
              break;
      }
  }	
  this.keyUp = function(event) {
      switch (event.keyCode) {
          case 81:
              self.directions.moveLUp = false
              break;
          case 68:
              self.directions.moveLDown = false
              break;
          case 80:
              self.directions.moveRUp = false
              break;
          case 75:
              self.directions.moveRDown = false
              break;
          case 32:
              //console.log("space");
              break;
      }
  }
  this.directions = {
    moveLUp: false,
    moveLDown: false,
    moveRUp: false,
    moveRDown: false
  }
  this.checkHoleCollisions = function(p_ball, p_bad, p_good) {

    var tolerance = 22;

    var ballcp = [p_ball.x+p_ball.image.width/2, p_ball.y+p_ball.image.height/2]
    var goodcp = [p_good.x+p_good.image.width/2, p_good.y+p_good.image.height/2]

    //console.log("X: " + ballcp[0] + " / " + badcp[0] + " - Y: " + ballcp[1] + " / " + badcp[1]);

    /*if((ballcp[0] > badcp[0]-15 && ballcp[0] < badcp[0] + 15) && (ballcp[1] > badcp[1]-15 && ballcp[1] < badcp[1] + 15)) {
        self.allowGameRunning(false);
        finalAnimation(p_ball, p_bad);
    }*/

    if((ballcp[0] > goodcp[0]-tolerance && ballcp[0] < goodcp[0] + tolerance) && (ballcp[1] > goodcp[1]-tolerance && ballcp[1] < goodcp[1] + tolerance))  {
        self.allowGameRunning(false);
        this.finalAnimation(p_ball, p_good);
    } else {
      for(var i=0;i<p_bad.length;++i) {
        var badcp = [p_bad[i].x+p_bad[i].image.width/2, p_bad[i].y+p_bad[i].image.height/2]
        if((ballcp[0] > badcp[0]-tolerance && ballcp[0] < badcp[0] + tolerance) && (ballcp[1] > badcp[1]-tolerance && ballcp[1] < badcp[1] + tolerance)) {
          self.allowGameRunning(false);
          this.finalAnimation(p_ball, p_bad[i]);
        }
      }
    }
  }
  this.preRender = function() {
    self.gameContext().clearRect(0, 0, self.gameCanvas().width, self.gameCanvas().height);
  }
  this.renderTracks = function() {
    self.gameContext().drawImage(self.sliderView.leftTrack.image, self.sliderView.leftTrack.x, self.sliderView.leftTrack.y);
    self.gameContext().drawImage(self.sliderView.rightTrack.image, self.sliderView.rightTrack.x, self.sliderView.rightTrack.y);
  }
  this.renderSliders = function() {
    self.gameContext().drawImage(self.sliderView.leftSlider.image, self.sliderView.leftSlider.x, self.sliderView.leftSlider.y);
    self.gameContext().drawImage(self.sliderView.rightSlider.image, self.sliderView.rightSlider.x, self.sliderView.rightSlider.y);
  }
  this.renderHoles = function() {
    self.gameContext().drawImage(self.levelView.goodHole.image, self.levelView.goodHole.x, self.levelView.goodHole.y);

    for(var i=0;i<self.levelView.badHoles.length;++i){
      self.gameContext().drawImage(self.levelView.badHoles[i].image, self.levelView.badHoles[i].x, self.levelView.badHoles[i].y);
    }
  }
  this.renderBars = function() {

    // Get the differences between the X and Y coordinates of the left & right pivot points
    self.difX = self.sliderView.rpX - self.sliderView.lpX;
    self.difY = self.sliderView.rpY - self.sliderView.lpY;

    // Calculate the theta (I don't really get what that is) and also the friendly angle of the bars
    self.theta = Math.atan2(self.difY, self.difX);
    self.angle = self.theta * 180 / Math.PI;

    // SAVE context before figuring out bar positions	
    self.gameContext().save()
    // Perform calculations to move the left and right bars
    self.gameContext().translate(self.sliderView.lpX, self.sliderView.lpY);
    self.gameContext().rotate(self.theta);
    self.gameContext().drawImage(self.sliderView.leftBar.image, -(12), -10);

    self.gameContext().restore();
    self.gameContext().save();

    self.gameContext().translate(self.sliderView.rpX, self.sliderView.rpY);
    self.gameContext().rotate(self.theta);

    self.gameContext().drawImage(self.sliderView.rightBar.image, -(self.sliderView.rightBar.image.width-12), -11);

    // RESTORE context after drawing bars. Move on to figuring out where to put the ball
    self.gameContext().restore();
  }
  this.renderStandardUi = function() {
    self.preRender();
    self.renderHoles();
    self.renderTracks();
    self.renderSliders();
    self.renderBars();
  }
  this.renderFinalUi = function() {
    self.preRender();
    self.renderHoles();
    self.renderTracks();
    self.renderSliders();
  }
  this.setBallPosition = function() {

   //	/* MOVING ** Y ** COORDINATE */
      var xPositionPercent = (self.ballView.ball.middleX-self.sliderView.lpX) / (self.sliderView.rpX-self.sliderView.lpX);

      var distFromBar = 8+Math.abs(self.angle)*.1;// + Math.abs(angle*.1);

      var yStopPoint = self.sliderView.lpY + xPositionPercent * self.difY - self.ballView.ball.image.height - distFromBar;

      self.ballView.ball.y = yStopPoint;


//	/* MOVING ** X ** COORDINATE */

    if(self.theta === self.oldTheta && self.theta !== 0) {
      if(typeof self.velocity === undefined)
        self.velocity = 1;
      self.velocity *= 1.0125
    } else {
      self.velocity = 1;
    }


    // calculate momentum and update ball posision
    self.ballView.ball.vx += self.theta * self.ballView.ball.xVeloScale * self.velocity;

    // Friction will stop the ball when the bar is flattened out
    self.ballView.ball.vx *= self.ballView.ball.friction;

    //console.log(self.ballView.ball.vx)

    self.ballView.ball.x += self.ballView.ball.vx;

    self.oldTheta = self.theta;

    // check for side collision
    if(self.ballView.ball.x < self.sliderView.leftSlider.x+self.sliderView.leftSlider.image.width)
    {	
        self.ballView.ball.x = self.sliderView.leftSlider.x+self.sliderView.leftSlider.image.width;
        self.ballView.ball.vx = 0;
    } else if (self.ballView.ball.x+self.ballView.ball.image.width > self.sliderView.rightSlider.x) {
        self.ballView.ball.x = self.sliderView.rightSlider.x-self.ballView.ball.image.width;
        self.ballView.ball.vx = 0;
    }

    // Keeping in case of future debugging need
    //console.log("bmx 1: " + self.ballView.ball.middleX + ", rbx: " + self.sliderView.rightBar.x + ", bx: " + self.ballView.ball.x + ", vx: " + self.ballView.ball.vx + ", is: " + self.ballView.ball.isStuck); 

    // If the ball is moving right, check whether it will catch on the bar join
    if(self.ballView.ball.vx === Math.abs(self.ballView.ball.vx)) {
        // If the ball is moving fast enough it won't catch
        if(self.ballView.ball.vx < self.ballView.ball.xStickVelo) {
            // If the ball is at the join, it catches
            if(self.ballView.ball.middleX < self.sliderView.rightBar.x+2 && self.ballView.ball.middleX > self.sliderView.rightBar.x - 1 && self.ballView.ball.isStuck === false && self.theta < 0.25) {
                self.ballView.ball.x -= self.ballView.ball.vx;
                self.ballView.ball.vx = 0;
                self.ballView.ball.isStuck = true;
            // All subsequent times we want to make sure the ball aligns properly with the joint
            } else if (self.ballView.ball.isStuck === true && self.theta > 0){
                self.ballView.ball.x -= self.ballView.ball.vx;
                self.ballView.ball.vx = 0;
                self.ballView.ball.x = self.sliderView.rightBar.x-(self.ballView.ball.image.width/2)+(self.angle*1.4);
                // If the ball is moving left or the bars are at a steep angle, the ball is free
                if(self.theta > 0.25 || self.ballView.ball.vx < 0) {
                    self.ballView.ball.isStuck = false;
                }
            // Make sure the ball is unstuck if it is at the join and the bars are flat of left-tilted
            } else {
                self.ballView.ball.isStuck = false;
            }
        }
    // If the ball is left-moving it isn't stuck
    } else {
        self.ballView.ball.isStuck = false;
    } 
  }
  this.moveSliders = function() {
      // Movement of the sliders up and down
      if(self.directions.moveLUp && 
         self.sliderView.leftSlider.y > 0 && 
         self.sliderView.leftSlider.y-self.sliderView.rightSlider.y > -500){

        self.sliderView.leftSlider.y -= self.gameModel.settings.barSlideAmount;
        self.sliderView.lpY -= self.gameModel.settings.barSlideAmount;
      }

      if(self.directions.moveLDown && 
         self.sliderView.leftSlider.y+70 < self.gameCanvas().height && 
         self.sliderView.leftSlider.y-self.sliderView.rightSlider.y < 500){

        self.sliderView.leftSlider.y += self.gameModel.settings.barSlideAmount;
        self.sliderView.lpY += self.gameModel.settings.barSlideAmount;
      }

      if(self.directions.moveRUp && 
         self.sliderView.rightSlider.y > 0 && 
         self.sliderView.leftSlider.y-self.sliderView.rightSlider.y < 500){

        self.sliderView.rightSlider.y -= self.gameModel.settings.barSlideAmount;
        self.sliderView.rpY -= self.gameModel.settings.barSlideAmount;
      }

      if(self.directions.moveRDown && 
         self.sliderView.rightSlider.y+70 < self.gameCanvas().height && 
         self.sliderView.leftSlider.y-self.sliderView.rightSlider.y > -500){

        self.sliderView.rightSlider.y += self.gameModel.settings.barSlideAmount;
        self.sliderView.rpY += self.gameModel.settings.barSlideAmount;
      }

  }
  this.renderBall = function() {
    // Update ball position on the canvas, and the bottom-middle point
    self.gameContext().drawImage(self.ballView.ball.image, 
                                 self.ballView.ball.x + self.ballView.ball.xOffset, 
                                 self.ballView.ball.y + self.ballView.ball.yOffset,
                                 self.ballView.ball.image.width * self.ballView.ball.xScale, 
                                 self.ballView.ball.image.width * self.ballView.ball.yScale);
    self.ballView.ball.updateMXBY(self.ballView.ball.x, self.ballView.ball.y, self.ballView.ball.image); 
  }
  this.finalAnimation = function(p_ball, p_hole){

    var xCentered = false;
    var yCentered = false;

    var holeMidpointX = p_hole.x + p_hole.image.width/2;
    var holeMidpointY = p_hole.y + p_hole.image.height/2;

    var ballWidth = self.ballView.ball.image.width;
    var ballHeight = self.ballView.ball.image.height;

    fallToCenter();

    function fallToCenter (timestamp) {

      self.renderFinalUi();

      var moveSpeed = p_hole.image.width * .05;

      var ballMidX = self.ballView.ball.x + ballWidth / 2;
      var ballMidY = self.ballView.ball.y + ballHeight / 2;

      if(!xCentered || !yCentered) {

        if(ballMidX < holeMidpointX - moveSpeed) {
          self.ballView.ball.x += moveSpeed;
        } else if (ballMidX > holeMidpointX + moveSpeed) {
          self.ballView.ball.x -= moveSpeed;
        } else {
          self.ballView.ball.x = holeMidpointX - ballWidth / 2;
          xCentered = true;
        }

        if(ballMidY < holeMidpointY - moveSpeed) {
          self.ballView.ball.y += moveSpeed;
        } else if (ballMidY > holeMidpointY + moveSpeed) {
          self.ballView.ball.y -= moveSpeed;
        } else {
          self.ballView.ball.y = holeMidpointY - ballHeight / 2;
          yCentered = true;
        }

        self.renderBall();
        self.renderBars();

        requestAnimationFrame(fallToCenter);

      } else {
        shrinkBall();
      }
    }

    function shrinkBall (timestamp) {

      self.renderFinalUi();

      if(self.ballView.ball.xScale >= 0) {

        self.gameContext().save();

        self.ballView.ball.xScale -= .1;
        self.ballView.ball.yScale -= .1;

        var ballScaledWidth = self.ballView.ball.image.width * self.ballView.ball.xScale;
        var ballScaledHeight = self.ballView.ball.image.width * self.ballView.ball.yScale;

        // This isn't necessary when the ball is explicitly scaled in the drawImage
        //self.gameContext().scale(self.ballView.ball.xScale, self.ballView.ball.yScale)

        if(ballScaledWidth > 0 && ballScaledHeight > 0) {

          var ballScaledMidpointX = self.ballView.ball.x + ballScaledWidth / 2;
          var ballScaledMidpointY = self.ballView.ball.y + ballScaledHeight / 2;

          var ballMidX = self.ballView.ball.x + ballWidth / 2;
          var ballMidY = self.ballView.ball.y + ballHeight / 2;

          self.ballView.ball.xOffset = ballMidX - ballScaledMidpointX;
          self.ballView.ball.yOffset = ballMidY - ballScaledMidpointY;

          self.renderBall();
          self.renderBars();
        }

        requestAnimationFrame(shrinkBall);

      }
      self.renderBars();
    }
  }
  this.gameloop = function(timestamp){
    if(self.isGameRunning()) {
      //self.allowGameRunning(false);

      self.renderStandardUi();

      self.setBallPosition();

      self.moveSliders();

      self.checkHoleCollisions(self.ballView.ball, self.levelView.badHoles, self.levelView.goodHole);

      self.renderBall()

      // Keep running the gameloop
      requestAnimationFrame(self.gameloop);
  }      
}
  this.guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}