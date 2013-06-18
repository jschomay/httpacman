Game = require 'game'

# some sites already use backbone, jquery, etc, and often older versions, so we need to be sure to use our own
# Here's an ugly hack to make sure we are using our versions
# Unfortunately, as is, you need to use `myExpectedFunction` like `myJQuery` anywhere you want to be sure you're using our own
# Test for jquery version with `console.log "$ version", $().jquery` to know if you have your own version
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
