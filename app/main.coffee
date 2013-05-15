Game = require 'game'

$ ->
  console.log 'Main app starting...'

  HeaderBarView = require 'views/header_bar'
  PlayerView = require 'views/player'

  headerBarView = new HeaderBarView()
  playerView = new PlayerView()

  $('body').append headerBarView.el
  $('body').append playerView.el

  # start off game loop
  game = new Game
  game.run()
  window.onblur = -> game.stop()
  window.onfocus = -> game.run()



  # mainLoop = () ->
  #   console.log "loop"
  #   # get input
  #   # update
  #   # draw
  #   setTimeout (mainLoop), 17

  # mainLoop()