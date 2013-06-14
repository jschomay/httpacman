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
    super

  draw: (ctx) ->
    ctx.strokeStyle = @background
    ctx.strokeRect @position.x, @position.y - 58, @w, @h
  
