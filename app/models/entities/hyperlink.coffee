Components = require './components'

module.exports = class Hyperlink
  Components.mixin(@)

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

  update: (dt) =>
    return
    
  draw: (ctx) ->
    ctx.strokeStyle = @background
    ctx.strokeRect @position.x, @position.y - 58, @w, @h
  
