# atom = require "../vendor/javascripts/game-engine"

module.exports = class Game extends window.atom.Game
  constructor: ->
    super
    # atom.input.bind atom.key.LEFT_ARROW, 'left'
    # atom.input.bind atom.key.RIGHT_ARROW, 'right'
    console.log "We have a game!"

  update: (dt) ->
    console.log "loop"
    if atom.input.pressed 'left'
      console.log "player started moving left"
    else if atom.input.down 'left'
      console.log "player still moving left"

  draw: ->
    # atom.context.fillStyle = 'black'
    # atom.context.fillRect 0, 0, atom.width, atom.height
    # Carry on.



