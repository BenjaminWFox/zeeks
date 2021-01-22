var Control = function() {
  var _control = this;
  
  this.create = function() {
    this.reset() 
  }
  
  this.reset = function() {
    this.isEngaged    = false,
    this.linkedTouch  = undefined,
    this.previousY    = undefined,
    this.originalY    = undefined,
    this.hasMoved     = false,
    this.velocity     = 0,
    this.direction    = {
      up: false,
      down: false
    }
  }
  
  this.create();
  
  return this;
}