function LevelView() {
  var self = this;
  
  self.level;
  
  this.create = function() {
    
  }

  this.destroy = function() {

  }

  this.render = function(game) {
    
    self.level = new game.level(game.levelModel.getLevelData(1));
    
    self.goodHole = new game.imageAsset({x:self.level.goodHole.x,y:self.level.goodHole.y,src:self.level.goodImg})
    
    self.badHoles = [];
    
    for(var i = 0;i<self.level.badHoles.length;++i) {
       self.badHoles.push(new game.imageAsset({x:self.level.badHoles[i].x,y:self.level.badHoles[i].y,src:self.level.badImg}));
    }
  } 
}