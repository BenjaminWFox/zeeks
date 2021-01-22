
  // JavaScript Document
function ControlView() {
  var self = this;

  var controlBack;
  var leftPad;
  var rightPad;
  var leftThumb;
  var rightThumb;
  
  var collection = 'slider';

  this.create = function() {

  }

  this.destroy = function() {

  }

  this.render = function(game) {
    self.controlBack = new game.imageAsset(game.gameModel.getAssetData(collection, 'controlBack'));
    
    self.leftPad = new game.imageAsset(game.gameModel.getAssetData(collection, 'leftPad'));
    
    self.rightPad = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightPad'));
    
    self.leftThumb = new game.imageAsset(game.gameModel.getAssetData(collection, 'leftThumb'));
    
    self.rightThumb = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightThumb'));
    
    self.meterOutline = new game.imageAsset(game.gameModel.getAssetData(collection, 'meterOutline'));
    
    self.meterFillB = new game.imageAsset(game.gameModel.getAssetData(collection, 'meterFillB'));
    
    self.meterFillG = new game.imageAsset(game.gameModel.getAssetData(collection, 'meterFillG'));
    
    self.meterFillY = new game.imageAsset(game.gameModel.getAssetData(collection, 'meterFillY'));
    
    self.meterFillR = new game.imageAsset(game.gameModel.getAssetData(collection, 'meterFillR'));
    
    /*self.rightMeterScale = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightMeterScale'));
    
    self.rightMeterMark = new game.imageAsset(game.gameModel.getAssetData(collection, 'rightMeterMark'));*/
  }
}