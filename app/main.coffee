$ ->
  console.log 'Main app starting...'

  HeaderBarView = require 'views/header_bar'
  PlayerView = require 'views/player'

  headerBarView = new HeaderBarView()
  playerView = new PlayerView()

  $('body').append headerBarView.el
  $('body').append playerView.el