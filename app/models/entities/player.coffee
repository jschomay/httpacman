module.exports = class Player
  # expects and object with 'id', 'position'.  Only 'id' is required.
  constructor: (options) ->
    {@positiond} = options
    @type = "player"
    @id = @type + options.id
    @w = 40
    @h = 40
    @background = 'yellow'

    @speed = 200 # px/s
    if !@position
      @position = 
        x: window.document.width/2
        y: 200

    # key bindings
    atom.input.bind atom.key.LEFT_ARROW, 'left'
    atom.input.bind atom.key.RIGHT_ARROW, 'right'
    atom.input.bind atom.key.DOWN_ARROW, 'down'
    atom.input.bind atom.key.UP_ARROW, 'up'


  update: (dt) =>
    directionX = 0
    directionY = 0

    if atom.input.down 'left'
      directionX = -1
    if atom.input.down 'right'
      directionX = 1
    if atom.input.down 'up'
      directionY = -1
    if atom.input.down 'down'
      directionY = 1

    # divide speed by sqrt 2 to get constant speed on diagonals
    _speed = if (directionX and directionY) then (@speed/1.41421) else @speed
    # distance (px) = speed (px/s) * time (s)
    @position.x += _speed * directionX * dt
    @position.y += _speed * directionY * dt
