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

    # move towards player
    if Math.floor Math.random()*5
      tx = @player.position.x - @position.x
      ty = @player.position.y - @position.y
      tl = Math.sqrt(Math.pow(tx,2) + Math.pow(ty,2))
      @dx = tx/tl
      @dy = ty/tl

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