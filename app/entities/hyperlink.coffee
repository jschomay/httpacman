Components = require './components'
Entity = require './entity'

module.exports = class Hyperlink extends Entity
  
  Components.mixin(@, 'Sprite')

  # expects and object with 'id', 'position'.
  constructor: (options) ->
    @initializeSprite
      type:  "hyperlink"
      id: options.id
      w: options.w
      h: options.h
      x: options.x
      y: options.y
      background: 'green'
    @$el = options.$el
    # @$el.css 'box-shadow', '0px 0px 13px 1px green'
    super

  draw: (ctx) ->
    # ctx.strokeStyle = @background
    # ctx.strokeRect @position.x, @position.y, @w, @h
    # ctx.rect @position.x, @position.y, @w, @h
    # ctx.shadowColor = @background;
    # ctx.shadowBlur = 5;
    # ctx.fill()

  destroy: ->
    @$el.animate opacity: 0.1
    @director.removeEntity @.id
