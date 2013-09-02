Components = require './components'
Entity = require './entity'

module.exports = class Enemy extends Entity
  
  Components.mixin(@, 'Sprite, Collidable')
  
  # expects and object with 'id', 'position'.  Only 'id' is required.
  constructor: (options) ->
    # enemies should start offscreen
    if Math.round Math.random()
      # position off sides
      chooseLeft = Math.round(Math.random())
      offset = Math.floor(Math.random() * 400)
      xOffset = if chooseLeft then offset * -1 else window.document.width + offset
      yOffset = (Math.random() * window.document.height)
    else
      # position off top/bottom
      chooseTop = Math.round(Math.random())
      offset = Math.floor(Math.random() * 400)
      yOffset = if chooseTop then offset * -1 else window.document.height + offset
      xOffset = (Math.random() * window.document.width)


    # pick a random virus image 
    virusImgs = [
      src: '/images/bot-g.gif'
      iw: 44
      ih: 42
    ,
      src: '/images/bot-r.gif'
      iw: 44
      ih: 42
    ,
      src: '/images/bot1.gif'
      iw: 31
      ih: 62
    ,
      src: '/images/spider1.png'
      iw: 35
      ih: 32
    ,
    ]
    img = virusImgs[Math.floor(Math.random()*4)]

    @initializeSprite
      type:  "enemy"
      id: options.id
      w: img.iw * 1
      h: img.ih * 1
      x: options.x || xOffset
      y: options.y || yOffset
      background: 'brown'
      src: img.src
      iw: img.iw
      ih: img.ih
    
    @player = options.player



    @speed = 100
    @dx = 0
    @dy = 0

    @onHit =
      'hyperlink': @onHitHyperlink
      'enemy': @onHitEnemy
      'ad': @onHitAd

    super

  update: (dt) =>
    # just jitter around randomly for now...
    # directionX = Math.ceil(Math.random()*3) - 2
    # directionY = Math.ceil(Math.random()*3) - 2

    # divide speed by sqrt 2 to get constant speed on diagonals
    # _speed = if (directionX and directionY) then (@speed / 1.41421) else @speed

    # move towards player with some random wrong directions
    if !Math.floor(Math.random()*40)
      tx = @player.position.x - @position.x
      ty = @player.position.y - @position.y
      tl = Math.sqrt(Math.pow(tx,2) + Math.pow(ty,2))
      @dx = tx/tl
      @dy = ty/tl

      # randomize their heading a bit
      if !Math.floor(Math.random()*2)
        q = Math.random() + 1 
        @dx *= q
        @dy *= q

    # distance (px) = speed (px / s) * time (s)
    @position.x += @speed * @dx * dt
    @position.y += @speed * @dy * dt

    # reset from any ads
    @speed = 100

    super


  onHitHyperlink: (obstacle, side) ->
    # bounce off links
    dtApproximation = 0.016
    if side is 'top'
      @position.y += @speed * @dy * dtApproximation
    if side is 'bottom'
      @position.y -= @speed * @dy * dtApproximation
    if side is 'left'
      @position.x -= @speed * @dx * dtApproximation
    if side is 'right'
      @position.y += @speed * @dx * dtApproximation

    false

  onHitEnemy: (obstacle) ->
    false

  onHitAd: (obstacle) ->
    @speed *= .5