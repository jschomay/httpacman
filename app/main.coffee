Game = require 'game'

$ ->
  console.log 'Main app starting...'
  $("a").click (e) -> console.log "click on link prevented"; e.preventDefault(); return false;

  HeaderBarView = require 'views/header_bar'

  headerBarView = new HeaderBarView()

  $('body').append headerBarView.el

  # start off game loop
  game = new Game()
  game.run()
  # stop the game after a few seconds to help view console for debugging
  setTimeout (-> game.stop()), 5000
  window.onblur = -> game.stop()
  window.onfocus = -> game.run()



  # mainLoop = () ->
  #   console.log "loop"
  #   # get input
  #   # update
  #   # draw
  #   setTimeout (mainLoop), 17

  # mainLoop()