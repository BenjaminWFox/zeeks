// JavaScript Document
function SliderView() {
  var self = this;

  var leftTrack;
  var rightTrack;
  var leftBar;
  var rightBar;
  var leftSlider;
  var rightSlider;
  var lpX,
      lpY,
      rpX,
      rpY;
  
  var collection = 'slider';

  this.create = function() {

  }

  this.destroy = function() {

  }

  this.render = function() {
    self.leftTrack = new game.imageAsset(game.gameModel.getAssetData(collection, 'leftTrack'));
    
    self.rightTrack = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightTrack'));

    self.leftSlider = new game.imageAsset(game.gameModel.getAssetData(collection, 'leftSlider'));

    self.rightSlider = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightSlider'));

    self.leftBar = new game.imageAsset(game.gameModel.getAssetData(collection, 'leftBar'));

    self.rightBar = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightBar'));
    
    self.lpX = self.leftBar.x + 11;
    self.lpY = self.leftBar.y + 10;
    self.rpX = self.rightBar.x + 511;
    self.rpY = self.rightBar.y + 11;
    
  }
}