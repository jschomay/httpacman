module.exports = class Enemy
  # expects and object with 'id', 'position'.  Only 'id' is required.
  constructor: (options) ->
    @type = "enemy"
    @id = @type + options.id
    @w = 30
    @h = 30
    @background = 'brown'

    @speed = 100 # px/s
    @position = 
      x: Math.random() * window.document.width
      y: Math.random() * window.document.height

  update: (dt) =>
    # just jitter around randomly for now...
    directionX = Math.ceil(Math.random()*3) - 2
    directionY = Math.ceil(Math.random()*3) - 2

    # divide speed by sqrt 2 to get constant speed on diagonals
    _speed = if (directionX and directionY) then (@speed/1.41421) else @speed
    # distance (px) = speed (px/s) * time (s)
    @position.x += _speed * directionX * dt
    @position.y += _speed * directionY * dt
