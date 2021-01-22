/* The UI function should be able to:
/* Set up the canvas (Fullscreen or not)
/* Figure out the users display resolution and orientation
/* Store and give that information to other proecsses */

var UI = function() {
  
  // store reference to use in methods
  var _ui = this;
  
  // graphics currently created @ 2048 x 1536
  this.originalWidth = 1152;
  this.originalHeight = 2048;
  
  // defined in createCanvas
  this.scalePercent = undefined;
  this.canvas = undefined;
  
  this.createCanvas = function() {

    if(document.getElementsByTagName('canvas').length === 0) {
      _ui.canvas = document.createElement('canvas');
      _ui.canvas.id = 'stage';
      _ui.canvas.context = _ui.canvas.getContext('2d');
      _ui.context = _ui.canvas.context;
      document.body.appendChild(_ui.canvas);
      console.log('Canvas created:', _ui.canvas);
    } else if (document.getElementsByTagName('canvas').length === 1) {
      _ui.canvas = document.getElementsByTagName('canvas')[0];
      console.log('Canvas already exists:', _ui.canvas);
    } else {
      console.log('Something is wrong, too much canvas!', document.getElementsByTagName('canvas'));
    }
    
    _ui.canvas.resize = function() {
      var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
      var cHeight;
      var cWidth;

      if(fullscreenEnabled) {
        if(screen.height < screen.width) {
          // Landscape Mode 
          cHeight = screen.height;
          cWidth = cHeight * .5625; // Make 16:9 Size Ratio
        } else if (screen.height > screen.width) {
          cHeight = screen.height;
          cWidth = cHeight * .5625; // Make 16:9 Size Ratio
        }
      } else {
        document.getElementsByTagName('div')[0].style.display = 'none';
        if(window.innerHeight < window.innerWidth) {
          // Landscape Mode 
          cHeight = window.innerHeight;
          cWidth = cHeight * .5625; // Make 16:9 Size Ratio
        } else if (window.innerHeight > window.innerWidth) {
          cHeight = window.innerHeight;
          cWidth = cHeight * .5625; // Make 16:9 Size Ratio
        }
      }
      _ui.scalePercent = cHeight / _ui.originalHeight;
      _ui.xScalePercent = cWidth / _ui.originalWidth;
      this.width = cWidth;
      this.height = cHeight;
      console.log('Height & width set at', this.height, 'x', this.width, 'Scale Y% set at', Math.round10(_ui.scalePercent, -2), 'Scale X% set at', Math.round10(_ui.xScalePercent, -2));
    }

    if (_ui.canvas.requestFullscreen) {
      _ui.canvas.requestFullscreen();
      _ui.canvas.resize();
    } else if (_ui.canvas.msRequestFullscreen) {
      _ui.canvas.msRequestFullscreen();
      _ui.canvas.resize();
    } else if (_ui.canvas.mozRequestFullScreen) {
      _ui.canvas.mozRequestFullScreen();
      _ui.canvas.resize();
    } else if (_ui.canvas.webkitRequestFullscreen) {
      _ui.canvas.webkitRequestFullscreen();
      _ui.canvas.resize();
    } else {
      _ui.canvas.resize(); 
    }

    _ui.createReferencePoints();
  }
  
  this.createReferencePoints = function() {
    _ui.midWidth = _ui.canvas.width/2;
    _ui.midHeight = _ui.canvas.height/2;
    _ui.centerPoint = {
      x: _ui.midWidth,
      y: _ui.midHeight
    }
    
    console.log('Reference points created, UI construction complete', _ui);
  }
  
  this.renderLogo = function(p_logoSrc, p_callback) {
    
    var logo = new Image();
    
    logo.src = p_logoSrc;
    
    logo.onload = function(event) {
      console.log('Logo Loaded');
      _ui.context.drawImage(logo,
                            _ui.centerPoint.x - logo.width/2,
                            _ui.centerPoint.y - logo.height/2)
      p_callback();
    }
  }
  
}