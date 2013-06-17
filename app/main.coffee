Game = require 'game'

# some sites already use backbone, jquery, etc, and often older versions, so let's try to deal with that nicely
# Hack to make sure we are using our version of jquery if the page tries to load it's own
# Unfortunately, as is, you need to put `$ = window.myJQuery` anywhere you want to use it, so it's ugly now
# Test for jquery version with `console.log "$ version", $().jquery`
window.myJQuery = $
$.noConflict()
window.myBackbone = Backbone.noConflict();


jQuery () ->
  game = new Game()
  # start off game loop
  game.run()
  # stop the game after a few seconds to help view console for debugging
  window.onblur = -> game.stop()
  window.onfocus = -> game.run()
