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

    @speed = 100 # px/s
    super

  update: (dt) =>
    # just jitter around randomly for now...
    directionX = Math.ceil(Math.random()*3) - 2
    directionY = Math.ceil(Math.random()*3) - 2

    # divide speed by sqrt 2 to get constant speed on diagonals
    _speed = if (directionX and directionY) then (@speed / 1.41421) else @speed
    # distance (px) = speed (px / s) * time (s)
    @position.x += _speed * directionX * dt
    @position.y += _speed * directionY * dt
    super
