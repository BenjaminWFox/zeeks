// JavaScript Document
function GameModel() {
	var self = this;
	
    this.totalAssets = [];
  
	this.canvasDimensions = {
		width: 640, 
		height: 900//1136
	};
	
	this.getCanvasDimensions = function() {
		return self.canvasDimensions;
	}
		
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
  barSlideAmount: 3
}
GameModel.prototype.assets = {
  slider: [{
    leftBar: {
      x: 2,
      y: 726,
      src: "assets/LeftBar.png"
	},
	rightBar: {
      x: 116, 
      y: 725,
      src: "assets/RightBar.png"
	},
	leftTrack: {
      x: 12, 
      y: 0, 
      src: "assets/TrackLine.png"
	}, 
	rightTrack: {
      x: 626 	,
      y: 0,
      src: "assets/TrackLine.png"
	},
	leftSlider: {
      x: 4,
      y: 700,
      src: "assets/TrackSlider.png"
	},
	rightSlider: {
      x: 618,
      y: 700,
      src: "assets/TrackSlider.png"
	}
  }],
  ball: [{
    ball: {
      x: 295,
      y: 20,
      src: "assets/Ball.png",
      vx: 0,
      vy: 10,
      direction: 0,
      friction: .96,
      xVeloScale: 8,
      xStickVelo: 7,
      onBar: false,
      isStuck: false,
      xScale: 1,
      yScale: 1,
      xOffset: 0,
      yOffset: 0,
      traveled: 0
    }
  }],
  goodHole: [{
	goodHole: {
		x: 150,
		y: 15,
		src: "assets/GoodHole.png"
	}
  }],
  badHole: [{
	badHole: {
		x: 165,
		y: 105,
		src: "assets/BadHole.png"
	}
  }]
}
