// JavaScript Document
function SliderView() {
  var self = this;

  var leftTrack;
  var rightTrack;
  var leftBar;
  var rightBar;
  var leftSlider;
  var rightSlider;
  
  var collection = 'slider';

  this.create = function() {

  }

  this.destroy = function() {

  }

  this.render = function(game) {
    self.leftTrack = new game.imageAsset(game.gameModel.getAssetData(collection, 'leftTrack'));
    
    self.rightTrack = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightTrack'));

    self.leftSlider = new game.imageAsset(game.gameModel.getAssetData(collection, 'leftSlider'));

    self.rightSlider = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightSlider'));

    self.leftBar = new game.imageAsset(game.gameModel.getAssetData(collection, 'leftBar'));

    self.rightBar = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightBar'));
    
  }
}