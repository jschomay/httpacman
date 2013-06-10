module.exports = class Player
  # expects and object with 'id', 'position'.  Only 'id' is required.
  constructor: (options) ->
    {@positiond} = options
    @type = "player"
    @id = @type + options.id
    @w = 40
    @h = 40
    @background = 'yellow'

    @speed = 400 # px/s
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
    dx = _speed * directionX * dt
    dy = _speed * directionY * dt

    # move x
    if (@position.x + dx < 0)
      @position.x = 0
    else if (@position.x + dx + @w > window.document.width)
      @position.x = window.document.width - @w
    else
      @position.x += dx

    # move y
    if (@position.y + dy < 0)
      @position.y = 0
    else if (@position.y + dy + @h + 58 > window.document.height)
      @position.y = window.document.height - @h - 58
    else
      @position.y += dy
      # scroll window/stage unless player is right near the top or bottom of the page
      unless @position.y < 200 or @position.y > window.document.height - 200
        window.scrollTo 0, @position.y - window.innerHeight/2 + @h/2 + 58 
