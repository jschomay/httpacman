module.exports =


  draw: (ctx) ->
    ctx.fillStyle = @background
    if @src
      ctx.drawImage(@src, 0, 0, @iw, @ih, @position.x, @position.y, @w, @h);
    else
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
    img = new Image()
    img.src = window.location.origin + options.src
    @src = img or null
    @iw = options.iw or 30
    @ih = options.ih or 30
