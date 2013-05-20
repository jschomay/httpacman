# atom = require "../vendor/javascripts/game-engine"

module.exports = class Game extends window.atom.Game
  constructor: (@entities) ->
    super
    # director manages all game entities
    @directorModel = new (require 'models/director')()
    @directorView = new (require 'views/director')(@directorModel.entities)

    # key bindings
    atom.input.bind atom.key.LEFT_ARROW, 'left'
    atom.input.bind atom.key.RIGHT_ARROW, 'right'
    atom.input.bind atom.key.DOWN_ARROW, 'down'
    atom.input.bind atom.key.UP_ARROW, 'up'
    console.log "We have a game!"

  update: (dt) ->
    console.log "update tick", dt
    # tell director to update everything
    @directorModel.update dt

  draw: ->
    console.log "draw tick"
    # tell director to draw everything
    @directorView.draw()