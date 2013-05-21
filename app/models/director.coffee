# define entities
# these could be models of their own (and pulled out to separate files)
# but I think it's best to avoid the overhead, and we don't reallly need
# backbone for game objects

class Player
  # expects and object with 'id', 'position', and 'speed'.  Only 'id' is required.
  constructor: (options) ->
    {@positiond} = options
    @type = "player"
    @id = @type + options.id
    @w = 40
    @h = 40

    @speed = 200 # px/s
    if !@position
      windowSize = $('body').width()
      @position = 
        x: windowSize/2
        y: 200

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
    # console.log _speed
    # console.log dt
    # distance (px) = speed (px/s) * time (s)
    @position.x += _speed * directionX * dt
    @position.y += _speed * directionY * dt



###
The director model is in charge of initializing (and destroying) all game entities based on level data.
It holds all the entities in some form of a scene graph, which may be rather straight forward at this point (backbone collection?).
It may also need to create one or more quad trees to handle collision (or at least pass the entities off to a collision module)
It also makes sure each entity's `update` function gets called when it's own update method gets called
###
module.exports = class DirectorModel extends Backbone.Model
  initialize: (levelData = {}) ->
    console.log "Setting the main scene..."

    # create a player entity
    console.log "Putting the player on screen"
    @addEntity(new Player({id: @lastId}))


    # crate playing field objects from the DirectorModel

    # create enemies

  lastId: 1

  entities: {}

  addEntity: (entity) =>
    @entities[entity.id] = entity

  removeEntity: (id) =>
    delete @entities[id]

  update: (dt) =>
    # call update on each entity
    # TODO, consider just firing the `enterframe` event
    # make sure to bind each new entity's update function to that event in @initialize
    for id, entity of @entities
      entity.update dt
