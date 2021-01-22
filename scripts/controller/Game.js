function Game() {
  var self = this;
  var game = self;
  var gameIsRunning = false;
  this.gameModel;
  this.levelModel;
  this.unloadedAssets = [];
  this.totalAssets = [];
  this.uiView;
  this.sliderView;
  this.controlView;
  this.ballView;
  this.levelView;
  this.gameOver;
  this.difX;
  this.difY;
  this.theta;
  this.angle;
  this.oldTheta;
  this.velocity;
  this.uiScale;
  this.controls = []
  this.touches = [];
  this.moveSteps = [];
  
  this.create = function(p_ui) {
    
    if (document.readyState !== "loading") {
      console.log('DOM Content loaded and ready to go:', document.readyState);
    } else {
      console.log('Something went wrong, DOM not loaded:', document.readyState)
    }
    
    self.uiView = p_ui;
    
    self.uiView.context = p_ui.context;
    self.uiView.canvas = p_ui.canvas;
    
    self.uiView.renderLogo('assets/sf_logo.png', game.beginAssetLoad);
    
    self.uiScale = p_ui.scalePercent;
    self.xUiScale = p_ui.xScalePercent;
  }
  
  game.beginAssetLoad = function() {
    self.gameModel = new GameModel();
    self.levelModel = new LevelModel();

    self.sliderView = new SliderView();
    self.sliderView.render(self);
    
    self.controlView = new ControlView();
    self.controlView.render(self);

    self.ballView = new BallView();
    self.ballView.render(self);

    self.levelView = new LevelView();
    self.levelView.render(self);
    
    console.log('Total Assets', game.totalAssets.length);
    console.log('Unloaded Assets', game.unloadedAssets.length);
    game.checkLoadStatus();
  }
  
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
    var ball = this;
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
    this.traveled = p_obj.traveled;
    
    this.updateMXBY = function(p_x, p_y, p_img) {
        this.middleX = p_x + p_img.width/2;
        this.bottomY = p_y + p_img.height;
    }
    
    this.allowDraw = true;
    
    var assetId = self.guid();
    
    self.unloadedAssets.push(assetId);
    game.totalAssets.push(assetId);
    
    this.image.onload = function(event) {
      ball.x *= game.uiScale;
      ball.y *= game.uiScale;
      ball.image.width *= game.uiScale;
      ball.image.height *= game.uiScale;
      
      self.unloadedAssets.splice(self.unloadedAssets.indexOf(this.assetId), 1);
      self.checkLoadStatus();
    }
  }
  
  this.imageAsset = function(p_obj) {

    var asset = this;
    var assetId = self.guid();

    self.unloadedAssets.push(assetId);
    game.totalAssets.push(assetId);
    
    this.image = new Image();

    this.image.src = p_obj.src;
    
    this.x = p_obj.x;
    this.y = p_obj.y;
    
    this.allowDraw = true;
    
    this.image.onload = function(event) {
      asset.x *= game.uiScale;
      asset.y *= game.uiScale;
      asset.image.width *= game.uiScale;
      asset.image.height *= game.uiScale;
      
      self.unloadedAssets.splice(self.unloadedAssets.indexOf(assetId), 1);
      self.checkLoadStatus();
    }
  }
  
  this.checkLoadStatus = function() {
    // Here is where a % bar for image loading can be incorporated
    console.log('Assets loaded of total', game.totalAssets.length - game.unloadedAssets.length, game.totalAssets.length)
    if(self.unloadedAssets.length === 0) {
      self.assetsLoaded();
    }
  }
  
  this.assetsLoaded = function() {
    console.log('All Assets Loaded');
    self.initControls();
    self.scaleGameSettings();
    game.registerMoveSteps();
    self.renderStandardUi();
    self.renderBall();
    self.allowGameRunning(true);
    self.gameloop({});
  }
  
  game.registerMoveSteps = function() {
    
    for(var i=1;game.moveSteps.length<4;++i){
      if(game.getIncrementAmount(i) !== game.getIncrementAmount(i-1))
        game.moveSteps.push(game.getIncrementAmount(i))
    }
    
    console.log(game.moveSteps);
  }
  
  this.scaleGameSettings = function() {
    for(var setting in game.gameModel.settings) {
      //console.log(setting, 'scaled from');
      //console.log(game.gameModel.settings[setting], '\\/');
      
      game.gameModel.settings[setting] *= game.uiScale;
      
      //console.log(game.gameModel.settings[setting]);
    }
  }
  
  this.initControls = function() {
    game.gameCanvas().addEventListener("touchstart", game.handleStart, false);
    game.gameCanvas().addEventListener("touchend", game.handleEnd, false);
    game.gameCanvas().addEventListener("touchcancel", game.handleCancel, false);
    game.gameCanvas().addEventListener("touchmove", game.handleMove, false);
    
    game.controls = {};
    game.controls.left = new Control();
    game.controls.right = new Control();
  }
  
  this.handleStart = function(event) {
    event.preventDefault();
    
    if(!gameIsRunning) {
      location.reload();
    }
    
    game.touches = event.touches;
    
    for(var j=0;j<game.touches.length;++j){
      
      var touch = game.touches[j];
      var tX = touch.pageX - touch.target.offsetLeft;
      var tY = touch.pageY - touch.target.offsetTop;
      
      if(tX > game.uiView.centerPoint.x && game.controls.right.isEngaged === false) {
        game.controls.right.isEngaged = true;
        game.controls.right.linkedTouch = touch.identifier;
        game.controls.right.previousY = tY;
      }
      
      if (tX < game.uiView.centerPoint.x && game.controls.left.isEngaged === false) {
        game.controls.left.isEngaged = true;
        game.controls.left.linkedTouch = touch.identifier;
        game.controls.left.previousY = tY;
      }
    }
    
  }
  
  this.controlEngaged = function(p_linkedTouch, p_touchArray){
    var engaged = false;
    
    for(var i=0;i<p_touchArray.length;++i){
      if(p_linkedTouch === p_touchArray[i].identifier)
        engaged = true;
    }
    
    return engaged;
  }
  
  this.resetControl = function(p_control){
    
    p_control.reset();
    
  }
  
  this.handleEnd = function(event) {
    
    game.touches = event.touches;
    
    if(!game.controlEngaged(game.controls.right.linkedTouch, game.touches))
      game.resetControl(game.controls.right);
    
    if(!game.controlEngaged(game.controls.left.linkedTouch, game.touches))
      game.resetControl(game.controls.left);
    
  }
  
  this.handleCancel = function(event) {
    game.touches = event.touches;
    
    if(!game.controlEngaged(game.controls.right.linkedTouch, game.touches))
      game.resetControl(game.controls.right);
    
    if(!game.controlEngaged(game.controls.left.linkedTouch, game.touches))
      game.resetControl(game.controls.left);
  }
  
  this.updateControl = function(p_control, p_changedTouch) {
    if(p_control.previousY < p_changedTouch.pageY) {
      p_control.direction.down = true;
      p_control.direction.up = false;
    } else if (p_control.previousY > p_changedTouch.pageY) {
      p_control.direction.down = false;
      p_control.direction.up = true;
    }
    
    p_control.previousY = p_changedTouch.pageY;
    
    if(!p_control.hasMoved) {
      p_control.hasMoved = true;
      p_control.originalY = p_changedTouch.pageY;
    }
    
    p_control.velocity = (p_control.originalY - p_control.previousY) * game.gameModel.settings.sliderMoveMultiplyer;
    
  }
  
  this.handleMove = function(event) {
    event.preventDefault();
    
    var rC = game.controls.right;
    var lC = game.controls.left;
    
    for(var i=0;i<event.changedTouches.length;++i) {
      if(event.changedTouches[i].identifier === rC.linkedTouch) {
        //console.log('right moved');
        game.updateControl(rC, event.changedTouches[i]);
      }
      if(event.changedTouches[i].identifier === lC.linkedTouch) {
        //console.log('left moved');
        game.updateControl(lC, event.changedTouches[i]);
      }
    }
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

    var tolerance = game.gameModel.settings.holeCollisionTolerance;

    var ballcp = [p_ball.x+p_ball.image.width/2, p_ball.y+p_ball.image.height/2];
    var goodcp = [p_good.x+p_good.image.width/2, p_good.y+p_good.image.height/2];
    
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
    self.gameContext().drawImage(self.sliderView.leftTrack.image, 
                                 self.sliderView.leftTrack.x, 
                                 self.sliderView.leftTrack.y,
                                 self.sliderView.leftTrack.image.width,
                                 self.sliderView.leftTrack.image.height);
    self.gameContext().drawImage(self.sliderView.rightTrack.image,
                                 self.sliderView.rightTrack.x,
                                 self.sliderView.rightTrack.y,
                                 self.sliderView.rightTrack.image.width,
                                 self.sliderView.rightTrack.image.height);
  }
  
  this.renderSliders = function() {
    self.gameContext().drawImage(self.sliderView.leftSlider.image,
                                 self.sliderView.leftSlider.x,
                                 self.sliderView.leftSlider.y,
                                 self.sliderView.leftSlider.image.width,
                                 self.sliderView.leftSlider.image.height);
    self.gameContext().drawImage(self.sliderView.rightSlider.image,
                                 self.sliderView.rightSlider.x,
                                 self.sliderView.rightSlider.y,
                                 self.sliderView.rightSlider.image.width,
                                 self.sliderView.rightSlider.image.height);
  }
  
  this.renderControls = function() {
    self.gameContext().drawImage(self.controlView.controlBack.image,
                                 self.controlView.controlBack.x,
                                 self.controlView.controlBack.y,
                                 self.controlView.controlBack.image.width,
                                 self.controlView.controlBack.image.height);
    self.gameContext().drawImage(self.controlView.leftPad.image,
                                 self.controlView.leftPad.x,
                                 self.controlView.leftPad.y,
                                 self.controlView.leftPad.image.width,
                                 self.controlView.leftPad.image.height);
    self.gameContext().drawImage(self.controlView.rightPad.image,
                                 self.controlView.rightPad.x,
                                 self.controlView.rightPad.y,
                                 self.controlView.rightPad.image.width,
                                 self.controlView.rightPad.image.height);
    self.gameContext().drawImage(self.controlView.leftThumb.image,
                                 self.controlView.leftThumb.x,
                                 self.controlView.leftThumb.y,
                                 self.controlView.leftThumb.image.width,
                                 self.controlView.leftThumb.image.height);
    self.gameContext().drawImage(self.controlView.rightThumb.image,
                                 self.controlView.rightThumb.x,
                                 self.controlView.rightThumb.y,
                                 self.controlView.rightThumb.image.width,
                                 self.controlView.rightThumb.image.height);
  }
  
  this.renderHoles = function() {
    self.gameContext().drawImage(self.levelView.goodHole.image,
                                 self.levelView.goodHole.x,
                                 self.levelView.goodHole.y,
                                 self.levelView.goodHole.image.width,
                                 self.levelView.goodHole.image.height);

    for(var i=0;i<self.levelView.badHoles.length;++i){
      self.gameContext().drawImage(self.levelView.badHoles[i].image,
                                   self.levelView.badHoles[i].x,
                                   self.levelView.badHoles[i].y,
                                   self.levelView.badHoles[i].image.width,
                                   self.levelView.badHoles[i].image.height);
    }
  }
  
  this.initBars = function() {
    self.sliderView.rpX = self.sliderView.rightBar.x + 891*game.uiScale;
    self.sliderView.rpY = self.sliderView.rightBar.y + 14*game.uiScale;
    self.sliderView.lpX = self.sliderView.leftBar.x + 16*game.uiScale;
    self.sliderView.lpY = self.sliderView.leftBar.y + 14*game.uiScale;
  }
  
  this.renderBars = function() {

    if(!self.sliderView.rpX || !self.sliderView.rpY || !self.sliderView.lpX || !self.sliderView.lpY)
      game.initBars();
    
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
    self.gameContext().drawImage(self.sliderView.leftBar.image,
                                 -14*game.uiScale,
                                 -14*game.uiScale,
                                 self.sliderView.leftBar.image.width,
                                 self.sliderView.leftBar.image.height);

    self.gameContext().restore();
    self.gameContext().save();

    self.gameContext().translate(self.sliderView.rpX, self.sliderView.rpY);
    self.gameContext().rotate(self.theta);

    self.gameContext().drawImage(self.sliderView.rightBar.image,
                                 -(self.sliderView.rightBar.image.width-14*game.uiScale),
                                 -15.5*game.uiScale,
                                 self.sliderView.rightBar.image.width,
                                 self.sliderView.rightBar.image.height);

    // RESTORE context after drawing bars. Move on to figuring out where to put the ball
    self.gameContext().restore();
  }
  
  this.renderMeter = function(p_control, p_touchId) {
    
    for(var i=0;i<game.touches.length;++i){
      if(game.touches[i].identifier === p_touchId){
        
        var tX = game.touches[i].pageX - game.touches[i].target.offsetLeft;
        //var tY = game.touches[i].pageY - game.touches[i].target.offsetTop - self.controlView.meterOutline.image.height/2;
        var setMeterSide = 1
        var isMeterFlipped = false;
        
        var isNegVelo = Math.abs(p_control.velocity) === p_control.velocity ? false : true;
        var fillFlip = isNegVelo ? -1 : 1;
        
        if(tX > game.uiView.centerPoint.x) {
          setMeterSide = -1
          isMeterFlipped = true;
        }
        
        var meterX = setMeterSide * (game.ballView.ball.x + game.ballView.ball.image.width/2 - (game.gameModel.settings.meterOffsetX) * setMeterSide);
        
        var meterY = game.ballView.ball.y + game.ballView.ball.image.height/2 - game.controlView.meterOutline.image.height/2;
        
        // render fill
        //console.log(game.getIncrementAmount(p_control.velocity));
        
        var fillsToRender = 0;
        
        if(game.getIncrementAmount(p_control.velocity) > 0) {
        
          fillsToRender = 1;
          
          for(var i=0;i<game.moveSteps.length;++i){
            if(game.getIncrementAmount(p_control.velocity) !== game.moveSteps[i] && game.getIncrementAmount(p_control.velocity) >= game.moveSteps[i]) {
              fillsToRender++;
            }
          }
        }
        
        game.gameContext().save();
        
        if(isMeterFlipped) {
          game.gameContext().scale(-1, 1);
        }
        
        if(fillsToRender > 0) {
          
          var mmY = meterY + self.controlView.meterOutline.image.height/2;
          
          var bY = isNegVelo ? mmY : mmY - game.controlView.meterFillB.image.height;
          var bX = isNegVelo ? meterX + game.controlView.meterFillB.image.width + game.controlView.meterFillB.x : meterX + game.controlView.meterFillB.x;
          
          var gY = isNegVelo ? bY + game.controlView.meterFillB.image.height : bY - game.controlView.meterFillG.image.height;
          var gX = isNegVelo ? meterX + game.controlView.meterFillG.image.width + game.controlView.meterFillG.x : meterX + game.controlView.meterFillG.x;
          
          var yY = isNegVelo ? gY + game.controlView.meterFillB.image.height : gY - game.controlView.meterFillG.image.height;
          var yX = isNegVelo ? meterX + game.controlView.meterFillY.image.width + game.controlView.meterFillY.x : meterX + game.controlView.meterFillY.x;
          
          var rY = isNegVelo ? yY + game.controlView.meterFillB.image.height : yY - game.controlView.meterFillG.image.height;
          var rX = isNegVelo ? meterX + game.controlView.meterFillR.image.width + game.controlView.meterFillR.x : meterX + game.controlView.meterFillR.x;
          
          /*bY = mmY - game.controlView.meterFillB.image.height;
          gY = bY - game.controlView.meterFillG.image.height;
          yY = gY - game.controlView.meterFillG.image.height;
          rY = yY - game.controlView.meterFillG.image.height;*/
          
          if(isNegVelo){
            game.gameContext().save();
            game.gameContext().scale(-1, 1);
          }
          
          if(fillsToRender >= 1)
            self.gameContext().drawImage(self.controlView.meterFillB.image,
                                         bX*fillFlip,
                                         bY,
                                         self.controlView.meterFillB.image.width,
                                         self.controlView.meterFillB.image.height);
          
          if(fillsToRender >= 2)
            self.gameContext().drawImage(self.controlView.meterFillG.image,
                                         gX*fillFlip,
                                         gY,
                                         self.controlView.meterFillG.image.width,
                                         self.controlView.meterFillG.image.height);
          
          if(fillsToRender >= 3)
            self.gameContext().drawImage(self.controlView.meterFillY.image,
                                         yX*fillFlip,
                                         yY,
                                         self.controlView.meterFillY.image.width,
                                         self.controlView.meterFillY.image.height);
          
          if(fillsToRender >= 4)
            self.gameContext().drawImage(self.controlView.meterFillR.image,
                                         rX*fillFlip,
                                         rY,
                                         self.controlView.meterFillR.image.width,
                                         self.controlView.meterFillR.image.height);
          if(isNegVelo){
            game.gameContext().restore();
          }
        }
        
        self.gameContext().drawImage(self.controlView.meterOutline.image,
                                     meterX,
                                     meterY,
                                     self.controlView.meterOutline.image.width,
                                     self.controlView.meterOutline.image.height);
        
        game.gameContext().restore();
      }
    }
  }
  
  this.renderStandardUi = function() {
    self.preRender();
    self.renderHoles();
    self.renderTracks();
    //self.renderControls();
    self.renderSliders();
    self.renderBars();
  }
  
  this.renderFinalUi = function() {
    self.preRender();
    self.renderHoles();
    self.renderTracks();
    //self.renderControls();
    self.renderSliders();
  }
  
  this.setBallPosition = function() {

//  /* MOVING ** Y ** COORDINATE */
    var xPositionPercent = (self.ballView.ball.middleX-self.sliderView.lpX) / (self.sliderView.rpX-self.sliderView.lpX);

    var stdBarDist = 10.5 * game.uiScale;
    
    if(Math.round(game.ballView.ball.x+game.ballView.ball.image.width/2) <= Math.round(game.sliderView.rightBar.x+3*game.uiScale))
      stdBarDist -= 3 * game.uiScale;
    
    var distFromBar = stdBarDist+Math.abs(self.angle)*.1;// + Math.abs(angle*.1);
    
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
    if(Math.abs(self.angle) < game.gameModel.settings.neutralBarAngle) {
      //self.ballView.ball.vx = 0;
      self.theta = 0;
    }
     
    if(!self.ballView.ball.isStuck)
      self.ballView.ball.vx += self.theta * game.gameModel.settings.ballVxScale * self.velocity;
    
    // Friction will stop the ball when the bar is flattened out
    self.ballView.ball.vx *= self.ballView.ball.friction;
 
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
    
    // If the ball is moving right, check whether it will catch on the bar join
    if(self.ballView.ball.vx === Math.abs(self.ballView.ball.vx)) {
        // If the ball is moving fast enough it won't catch
        
      if(self.ballView.ball.vx < game.gameModel.settings.ballStickVx) {
           
        // If the ball is at the join, it catches
        if(self.ballView.ball.middleX < self.sliderView.rightBar.x+2 && 
           self.ballView.ball.middleX > self.sliderView.rightBar.x - 1 && 
           self.ballView.ball.isStuck === false && self.theta < 0.25) {

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
  
  this.allowLeftUp = function(p_lY, p_rY) {
    return p_lY > game.gameModel.settings.barMinYOffset && p_lY - p_rY > - game.gameModel.settings.barMaxDif;
  }
  
  this.allowLeftDown = function(p_lY, p_rY) {
    return p_lY < self.gameCanvas().height - game.gameModel.settings.barMaxYOffset && p_lY - p_rY < game.gameModel.settings.barMaxDif;
  }
  
  this.allowRightUp = function(p_lY, p_rY) {
    return p_rY > game.gameModel.settings.barMinYOffset && p_lY - p_rY < game.gameModel.settings.barMaxDif;
  }
  
  this.allowRightDown = function(p_lY, p_rY) {
    return p_rY < self.gameCanvas().height - game.gameModel.settings.barMaxYOffset && p_lY - p_rY > - game.gameModel.settings.barMaxDif;
  }
  
  this.getIncrementAmount = function(p_offset) {
    
    p_offset = Math.abs(p_offset);
    
    var maxVelo = game.gameModel.settings.sliderVeloCap;
    
    var increment = Math.ceil((p_offset / maxVelo * game.gameModel.settings.sliderMaxMovement) / 3) * 3;
    
    if(increment > 0)
      increment -= 2;
    if(increment > 1)
      increment *= game.gameModel.settings.sliderVeloSmoother;
    if(increment > game.gameModel.settings.sliderMaxMovement)
      increment = game.gameModel.settings.sliderMaxMovement;
    
    return increment;
  }
  
  this.getBarSlideAmount = function(p_velo) {
    
    var markOffset = Math.abs(p_velo);
    
    var direction = 1;
    
    if(markOffset !== p_velo){
      direction *= -1;
    }
    
    var velocity = game.getIncrementAmount(markOffset);
    
    velocity *= direction;
    
    /*if(velocity !== 0)
      console.log(velocity);*/
    
    return velocity;
  }
  
  this.moveSlidersTouch = function() {
    
    var lY = self.sliderView.leftSlider.y;
    var rY = self.sliderView.rightSlider.y;
    
    var stepRight = game.getBarSlideAmount(game.controls.right.velocity);
    
    var stepLeft = game.getBarSlideAmount(game.controls.left.velocity);
    
    if(stepRight > 0 && game.allowRightUp(lY, rY)){
      self.sliderView.rightSlider.y -= stepRight;
      self.sliderView.rpY -= stepRight;
    } else if(stepRight < 0 && game.allowRightDown(lY, rY)) {
        self.sliderView.rightSlider.y -= stepRight;
        self.sliderView.rpY -= stepRight;
    }

    if(stepLeft > 0 && game.allowLeftUp(lY, rY)){
        self.sliderView.leftSlider.y -= stepLeft;
        self.sliderView.lpY -= stepLeft;
    } else if(stepLeft < 0 && game.allowLeftDown(lY, rY)) {
      self.sliderView.leftSlider.y -= stepLeft;
      self.sliderView.lpY -= stepLeft;
    }
  }
  
  this.moveSlidersKeyboard = function() {
    
      // Movement of the sliders up and down
      if(self.directions.moveLUp && 
         self.sliderView.leftSlider.y > 62*game.uiScale && 
         self.sliderView.leftSlider.y-self.sliderView.rightSlider.y > -game.gameModel.settings.barMaxDif){

        self.sliderView.leftSlider.y -= self.gameModel.settings.barSlideAmount;
        self.sliderView.lpY -= self.gameModel.settings.barSlideAmount;
      }
      
      if(self.directions.moveLDown && 
         self.sliderView.leftSlider.y < self.gameCanvas().height - 476*game.uiScale && 
         self.sliderView.leftSlider.y-self.sliderView.rightSlider.y < game.gameModel.settings.barMaxDif){

        self.sliderView.leftSlider.y += self.gameModel.settings.barSlideAmount;
        self.sliderView.lpY += self.gameModel.settings.barSlideAmount;
      }

      if(self.directions.moveRUp && 
         self.sliderView.rightSlider.y > 62*game.uiScale && 
         self.sliderView.leftSlider.y-self.sliderView.rightSlider.y < game.gameModel.settings.barMaxDif){

        self.sliderView.rightSlider.y -= self.gameModel.settings.barSlideAmount;
        self.sliderView.rpY -= self.gameModel.settings.barSlideAmount;
      }

      if(self.directions.moveRDown && 
         self.sliderView.rightSlider.y < self.gameCanvas().height - 476*game.uiScale && 
         self.sliderView.leftSlider.y-self.sliderView.rightSlider.y > -game.gameModel.settings.barMaxDif){

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
    
    self.ballView.ball.updateMXBY(self.ballView.ball.x,
                                  self.ballView.ball.y,
                                  self.ballView.ball.image); 
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
    if(game.isGameRunning()) {

      game.renderStandardUi();

      game.setBallPosition();

      game.moveSlidersKeyboard();

      game.moveSlidersTouch();

      game.checkHoleCollisions(game.ballView.ball, game.levelView.badHoles, game.levelView.goodHole);

      game.renderBall();


      if(game.controls.left.isEngaged) {
        game.renderMeter(game.controls.left, game.controls.left.linkedTouch)
      }
      if(game.controls.right.isEngaged) {
        game.renderMeter(game.controls.right, game.controls.right.linkedTouch)
      }

      // Keep running the gameloop
      requestAnimationFrame(game.gameloop);
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