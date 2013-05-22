# atom = require "../vendor/javascripts/game-engine"

module.exports = class Game extends window.atom.Game
  constructor: (@entities) ->
    super
    # director manages all game entities
    @directorModel = new (require 'models/director')()
    @directorView = new (require 'views/director')(@directorModel.entities)

    console.log "We have a game!"

    # fps widget
    @stats = new Stats();
    @stats.setMode 0 # 0: fps, 1: ms
    @stats.domElement.style.position = 'fixed'
    @stats.domElement.style['z-index'] = 9999
    @stats.domElement.style.right = '0px'
    @stats.domElement.style.top = '0px'
    document.body.appendChild @stats.domElement 
    @stats.begin()


  update: (dt) ->
    # update fps widget
    @stats.update()
    # tell director to update everything
    @directorModel.update dt

  draw: ->
    # tell director to draw everything
    @directorView.draw()

