Game = require 'game'

$ ->
  console.log 'Main app starting...'

  game = new Game()
  # start off game loop
  game.run()
  # stop the game after a few seconds to help view console for debugging
  window.onblur = -> game.stop()
  window.onfocus = -> game.run()
