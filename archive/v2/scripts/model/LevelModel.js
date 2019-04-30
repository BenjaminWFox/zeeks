function LevelModel() {
  var self = this;
  
  this.getLevelData = function(p_levelNumber) {
    var loadLevel = "level" + p_levelNumber;
    return self[loadLevel];
  }
  
  // X >= 535 prevents carry-up on right side
  // X <= 30 prevents carry-up on right side
  
  LevelModel.prototype.level1 = {
    winHoleImg: "assets/GoodHole.png",
    winHoleLoc: {
      x: 147,
      y: 22,
    },
    loseHolesImg: "assets/BadHole.png",
    loseHolesLoc: [
      {
        x: 388,
        y: 601
      },
      {
        x: 274,
        y: 540
      },
      {
        x: 397,
        y: 456
      },
      {
        x: 116,
        y: 483
      },
      {
        x: 160,
        y: 601
      },
      {
        x: 30,
        y: 436
      },
      {
        x: 258,
        y: 88
      },
      {
        x: 160,
        y: 142
      },
      {
        x: 86,
        y: 65
      },
      {
        x: 287,
        y: 204
      },
      {
        x: 526,
        y: 476
      },
      {
        x: 493,
        y: 349
      },
      {
        x: 363,
        y: 337
      },
      {
        x: 353,
        y: 255
      },
      {
        x: 255,
        y: 406
      },
      {
        x: 156,
        y: 381
      },
      {
        x: 69,
        y: 189
      },
      {
        x: 24,
        y: 285
      },
      {
        x: 206,
        y: 219
      },
      {
        x: 434,
        y: 294
      },
      {
        x: 553,
        y: 252
      },
      {
        x: 444,
        y: 199
      },
      {
        x: 132,
        y: 281
      },
      {
        x: 251,
        y: 311
      },
      {
        x: 374,
        y: 149
      },
      {
        x: 222,
        y: 11
      },
      {
        x: 60,
        y: 3
      },
      {
        x: 338,
        y: 42
      },
      {
        x: 233,
        y: 153
      },
      {
        x: 436,
        y: 75
      },
      {
        x: 21,
        y: 115
      },
      {
        x: 300,
        y: -36
      },
      {
        x: 538,
        y: 156
      },
      {
        x: 535,
        y: 579
      },
      {
        x: 76,
        y: 389
      }
    ]
  }
}