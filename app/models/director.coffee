# define entities
# these are just regular obects, rather than backbone models.
Entities = require './entities'


###
The director model is in charge of initializing (and destroying) all game entities based on level data.
It holds all the entities in some form of a scene graph, which may be rather straight forward at this point (backbone collection?).
It may also need to create one or more quad trees to handle collision (or at least pass the entities off to a collision module)
It also makes sure each entity's `update` function gets called when it's own update method gets called
###
module.exports = class DirectorModel extends Backbone.Model
  initialize: (levelData = {}) ->
    console.log "Setting the main scene..."
    console.log Entities

    # create a player entity
    console.log "Putting the player on screen"
    @addEntity(new Entities.Player({id: @lastId}))

    numEnemies = 100
    console.log "Putting #{numEnemies} enemies on screen"
    for [1..numEnemies]
      @addEntity(new Entities.Enemy {id:@lastId})


    # crate playing field objects from the DirectorModel

    # create enemies

  lastId: 1

  entities: {}

  addEntity: (entity) =>
    @entities[entity.id] = entity
    @lastId++

  removeEntity: (id) =>
    delete @entities[id]

  update: (dt) =>
    # call update on each entity
    # TODO, consider just firing the `enterframe` event
    # make sure to bind each new entity's update function to that event in @initialize
    for id, entity of @entities
      entity.update dt
