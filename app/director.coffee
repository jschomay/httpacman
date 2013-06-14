Entities = require './entities'


###
The director manages all game entities.  It initializes them based on level data, then delegates update and draw to each entity.  It stores entities in a data structure that allows for effcient lookups, and has ways to add and remov entities from this structure.
###
module.exports = class Director
  constructor: (levelData = {}, @gameState) ->
    ###
    INITIALIZE ENTITIES
    ###

    console.log "Setting the main scene..."

    # give each entity a reference to the director
    Entities.Entity::director  = @

    # create a player entity
    console.log "Putting the player on screen"
    @addEntity(new Entities.Player({id: @lastId}))

    # create enemies
    numEnemies = levelData.numEnemies || 10
    console.log "Putting #{numEnemies} enemies on screen"
    for [1..numEnemies]
      @addEntity(new Entities.Enemy {id:@lastId})


    # crate playing field objects from the DirectorModel
    $(window).load =>
      # hyperlinks
      console.log "Converting hyperlinks to game entities"
      that = @
      numInternalLinks = 0;
      numExternalLinks = 0;
      headerBarEl = $('#hh-header-bar')[0]
      $('a:visible')
      .filter(-> !$.contains(headerBarEl,this))
      .each ->
        numInternalLinks++;
        $this = $(@)
        offset = $this.offset()
        that.addEntity new Entities.Hyperlink
          id: that.lastId
          w: $this.width()
          h: $this.height()
          y: offset.top
          x: offset.left
      @gameState.set "numInternalLinks", numInternalLinks
      @gameState.set 'running', true


  lastId: 1

  entities: {}

  addEntity: (entity) =>
    @entities[entity.id] = entity
    @lastId++

  removeEntity: (id) =>
    delete @entities[id]

  update: (dt) =>
    # call update on each entity
    for id, entity of @entities
      entity.update dt

  draw: (ctx) =>
    # render each entity in scene
    for id, entity of @entities
      entity.draw(ctx)
