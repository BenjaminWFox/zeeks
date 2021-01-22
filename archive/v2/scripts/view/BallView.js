// JavaScript Document
function BallView() {
	var self = this;
	
	var ball;
	var collection = 'ball';
  
	this.create = function() {
		
	}
	
	this.destroy = function() {
		
	}
	
	this.render = function() {
      self.ball = new game.ball(game.gameModel.getAssetData(collection, 'ball'));
	}
}