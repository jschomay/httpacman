Components = require './components'
Entity = require './entity'

module.exports = class Player extends Entity

  Components.mixin(@, 'Sprite, Collidable')

  # expects and object with 'id', 'position'.  Only 'id' is required.
  constructor: (options) ->
    @initializeSprite
      type:  "player"
      id: options.id
      w: 40
      h: 40
      x: options?.position?.x || window.document.width / 2
      y: options?.position?.y || 200
      background: 'yellow'

    @acceleration = 50 # px/s/s
    @maxSpeed = 500 # px/s
    @vx = 0
    @vy = 0
    @drag = .8

    # key bindings
    atom.input.bind atom.key.LEFT_ARROW, 'left'
    atom.input.bind atom.key.RIGHT_ARROW, 'right'
    atom.input.bind atom.key.DOWN_ARROW, 'down'
    atom.input.bind atom.key.UP_ARROW, 'up'

    # define collision reactions for player hitting obstacle by type
    @onHit =
      'hyperlink': @onHitHyperlink
      'enemy': @onHitEnemy

    super


  update: (dt) =>
    if atom.input.down 'left'
      @vx -= @acceleration unless @vx <= -@maxSpeed
    if atom.input.down 'right'
      @vx += @acceleration  unless @vx >= @maxSpeed
    if atom.input.down 'up'
      @vy -= @acceleration unless @vy <= -@maxSpeed
    if atom.input.down 'down'
      @vy += @acceleration unless @vy >= @maxSpeed


    # distance (px) = speed (px/s) * time (s)
    dx = @vx * dt
    dy = @vy * dt
    #drag
    @vx *= @drag
    @vy *= @drag

    @_wasAt = x:@position.x, y:@position.y

    # move x
    if (@position.x + dx < 0)
      @position.x = 0
      @vx = 0
    else if (@position.x + dx + @w > window.document.width)
      @position.x = window.document.width - @w
      @vx = 0
    else
      @position.x += dx

    # move y
    if (@position.y + dy < 0)
      @position.y = 0
      @vy = 0
    else if (@position.y + dy + @h + 58 > window.document.height)
      @position.y = window.document.height - @h - 58
      @vy = 0
    else
      @position.y += dy
      # scroll window/stage unless player is right near the top or bottom of the page
      unless @position.y < 200 or @position.y > window.document.height - 200
        window.scrollTo 0, @position.y - window.innerHeight/2 + @h/2 + 58 

    super # super performs collision detection

  onHitHyperlink: (obstacle) ->
    @director.gameState.set 'numInternalLinks', @director.gameState.get('numInternalLinks') - 1
    @director.gameState.set 'numCollectedLinks', @director.gameState.get('numCollectedLinks') + 1
    obstacle.destroy()

  onHitEnemy: (obstacle) ->
    @.background = 'black'
