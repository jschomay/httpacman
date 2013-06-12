module.exports =

  draw: (ctx) ->
    ctx.fillStyle = @background
    ctx.fillRect @position.x, @position.y, @w, @h

  setPositionAndSize: (x = 0, y = 0, w = 30, h = 30) ->
    @w = w
    @h = h
    @position = 
      x: x
      y: y

  initializeSprite: (options) ->
    @setPositionAndSize(options.x, options.y, options.w, options.h)
    @type = options.type
    @id = @type + options.id
    @background = options.background or 'black'
