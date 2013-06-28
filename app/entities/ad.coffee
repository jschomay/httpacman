Components = require './components'
Entity = require './entity'

module.exports = class Ad extends Entity
  
  Components.mixin(@, 'Sprite')

  # expects and object with 'id', 'position'.
  constructor: (options) ->
    @initializeSprite
      type:  "ad"
      id: options.id
      w: options.w
      h: options.h
      x: options.x
      y: options.y
      background: 'magenta'
    @$el = options.$el
    # @$el.css 'box-shadow', '0px 0px 13px 1px green'
    super

  draw: (ctx) ->
    ctx.strokeStyle = 'magenta'
    ctx.lineWidth = 5
    ctx.strokeRect @position.x, @position.y, @w, @h

