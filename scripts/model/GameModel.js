// JavaScript Document
function GameModel() {
	var self = this;
	
    this.totalAssets = [];
		
	this.getAssetData = function(p_collection, p_assetName) {
      
      //console.log(Object.keys(self.assets[p_collection][0]).length);
      
      self.totalAssets.push(
        {
          collection: p_collection,
          asset: p_assetName
        }
      );
      
      if(self.assets[p_collection][0][p_assetName]) {
        return self.assets[p_collection][0][p_assetName];
      } else {
        console.log("Asset not found");
      }
	}
}
GameModel.prototype.settings = {
  barSlideAmount: 3, // used in keyboard function only
  ballStickVx: 15,
  ballVxScale: 10,
  holeCollisionTolerance: 55,
  barMaxYOffset: 250,
  barMinYOffset: 62,
  barMaxDif: 512,
  sliderMoveMultiplyer: 1.9, // amount of thumb movement per marker/slider movement, higher is more
  sliderMaxMovement: 15, // higher is faster
  sliderVeloSmoother: .975,
  sliderVeloCap: 173,
  neutralBarAngle: .60,
  meterOffsetX: 85
}
GameModel.prototype.assets = {
  slider: [{
    leftBar: {
      x: 7,
      y: 1593 ,
      src: "assets/bar-left.png"
	},
	rightBar: {
      x: 239, 
      y: 1593,
      src: "assets/bar-right.png"
	},
	leftTrack: {
      x: 20, 
      y: 0, 
      src: "assets/rail.png"
	}, 
	rightTrack: {
      x: 1124,
      y: 0,
      src: "assets/rail.png"
	},
	leftSlider: {
      x: 2,
      y: 1533,
      src: "assets/truck.png"
	},
	rightSlider: {
      x: 1106,
      y: 1533,
      src: "assets/truck.png"
	},
	leftPad: {
      x: -12,
      y: 1668,
      src: "assets/control-pad.png"
	},
	rightPad: {
      x: 789,
      y: 1668,
      src: "assets/control-pad.png"
	},
	leftThumb: {
      x: 105,
      y: 1785,
      src: "assets/thumbstick.png"
	},
	rightThumb: {
      x: 907,
      y: 1785,
      src: "assets/thumbstick.png"
	},
	meterOutline: {
      x: 0,
      y: 0,
      src: "assets/meter-outline.png"
	},
	meterFillB: {
      x: .5,
      y: 0,
      src: "assets/meter-fill-blue.png"
	},
	meterFillG: {
      x: 1.75,
      y: 0,
      src: "assets/meter-fill-green.png"
	},
	meterFillY: {
      x: 5.75,
      y: 0,
      src: "assets/meter-fill-yellow.png"
	},
	meterFillR: {
      x: 11,
      y: 0,
      src: "assets/meter-fill-red.png"
	},
	controlBack: {
      x: -2.5,
      y: 1749,
      src: "assets/control-background.png"
	}
  }],
  ball: [{
    ball: {
      x: 999,
      y: 1482,
      src: "assets/ball.png",
      vx: 0,
      vy: 10,
      direction: 0,
      friction: .96,
      onBar: false,
      isStuck: false,
      xScale: 1,
      yScale: 1,
      xOffset: 0,
      yOffset: 0,
      traveled: 0
    }
  }]
}
