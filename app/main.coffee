$ ->
  console.log 'Main app starting...'

  HeaderBarView = require 'views/header_bar'

  headerBarView = new HeaderBarView()

  console.log $('body'), headerBarView
  $('body').append headerBarView.el