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

    # fps widget
    @stats = new Stats();
    @stats.setMode 0 # 0: fps, 1: ms
    @stats.domElement.style.position = 'absolute'
    @stats.domElement.style['z-index'] = 9999
    @stats.domElement.style.right = '0px'
    @stats.domElement.style.top = '0px'
    document.body.appendChild @stats.domElement 
    @stats.begin()


  update: (dt) ->
    # update fps widget
    @stats.update()
    console.log "update tick", dt
    # tell director to update everything
    @directorModel.update dt

  draw: ->
    console.log "draw tick"
    # tell director to draw everything
    @directorView.draw()

