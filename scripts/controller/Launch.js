var launch = function() {
  // DISABLE ALL LOGGING
  /*var console = {};
  console.log = function(){};
  window.console = console;*/

  var ui = new UI();
  ui.createCanvas();

  var game = new Game();
  game.create(ui);
  document.addEventListener("keydown", game.keyDown);
  document.addEventListener("keyup", game.keyUp);
}

// var setButton = function() {
//   document.getElementsByTagName('div')[0].style.width = window.innerWidth + 'px';
//   document.getElementsByTagName('div')[0].style.height = window.innerHeight + 'px';
// }

// document.addEventListener("DOMContentLoaded", setButton);
// document.getElementsByTagName('button')[0].click();