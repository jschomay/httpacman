# atom = require "../vendor/javascripts/game-engine"

module.exports = class Game extends window.atom.Game
  constructor: (@entities) ->
    super
    atom.input.bind atom.key.LEFT_ARROW, 'left'
    atom.input.bind atom.key.RIGHT_ARROW, 'right'
    atom.input.bind atom.key.DOWN_ARROW, 'down'
    atom.input.bind atom.key.UP_ARROW, 'up'
    console.log "We have a game!"

  update: (dt) ->
    console.log "loop"

    directionX = 0
    directionY = 0
    # if atom.input.pressed 'left'
    # console.log "player started moving left"
    if atom.input.down 'left'
      directionX = -1
    if atom.input.down 'right'
      directionX = 1
    if atom.input.down 'up'
      directionY = -1
    if atom.input.down 'down'
      directionY = 1

    @entities.player.position.x += @entities.player.speed * directionX
    @entities.player.position.y += @entities.player.speed * directionY

  draw: ->
    @entities.player.render()
    # atom.context.fillStyle = 'black'
    # atom.context.fillRect 0, 0, atom.width, atom.height
    # Carry on.



