function LevelModel() {
  var self = this;
  
  this.getLevelData = function(p_levelNumber) {
    var loadLevel = "level" + p_levelNumber;
    return self[loadLevel];
  }
  
  // X >= 535 prevents carry-up on right side
  // X <= 30 prevents carry-up on right side
  
  LevelModel.prototype.level1 = {
    winHoleImg: "assets/hole-win.png",
    winHoleLoc: {
      x: 509,
      y: 74,
    },
    loseHolesImg: "assets/hole-lose.png",
    loseHolesLoc: [
      {
        x: 239,
        y: 272
      },
      {
        x: 796,
        y: 394
      },
      {
        x: 158,
        y: 649
      },
      {
        x: 681,
        y: 739
      },
      {
        x: 864,
        y: 1024
      }
    ]
  }
}