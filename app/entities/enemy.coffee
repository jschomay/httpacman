Components = require './components'
Entity = require './entity'

module.exports = class Enemy extends Entity
  
  Components.mixin(@, 'Sprite, Collidable')
  
  # expects and object with 'id', 'position'.  Only 'id' is required.
  constructor: (options) ->
    @initializeSprite
      type:  "enemy"
      id: options.id
      w: options.w
      h: options.h
      x: options.x || (Math.random() * window.document.width)
      y: options.y || (Math.random() * window.document.height)
      background: 'brown'
      @player = options.player


    @speed = 100
    @dx = 0
    @dy = 0
    super

  update: (dt) =>
    # just jitter around randomly for now...
    # directionX = Math.ceil(Math.random()*3) - 2
    # directionY = Math.ceil(Math.random()*3) - 2

    # divide speed by sqrt 2 to get constant speed on diagonals
    # _speed = if (directionX and directionY) then (@speed / 1.41421) else @speed

    # move towards player
    tx = @player.position.x - @position.x
    ty = @player.position.y - @position.y
    tl = Math.sqrt(Math.pow(tx,2) + Math.pow(ty,2))
    @dx = tx/tl
    @dy = ty/tl

    # distance (px) = speed (px / s) * time (s)
    @position.x += @speed * @dx * dt
    @position.y += @speed * @dy * dt
    super

  onHit: (obstacle) ->
    # @background = 'red'
    # run right behaviour based on obstacle type
    @_onHitFunctions[obstacle.type]?.call(@, obstacle)

  onHitHyperlink: (obstacle) ->
    obstacle.background = 'brown'

  onHitEnemy: (obstacle) ->
    false

  _onHitFunctions: 
    'hyperlink': @::onHitHyperlink
    'enemy': @::onHitEnemy
