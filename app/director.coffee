Entities = require './entities'


###
The director manages all game entities.  It initializes them based on level data, then delegates update and draw to each entity.  It stores entities in a data structure that allows for effcient lookups, and has ways to add and remov entities from this structure.
###
module.exports = class Director
  constructor: (levelData = {}, @gameState) ->
    $ = window.myJQuery
    require = window.require


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
      # start with all links on page...
      $('a')
      # filter out links in the header bar...
      .filter(-> !$.contains(headerBarEl, @))
      # and filter out links under a nav system, but only 2nd tier ones (to avoid hidden drop nav menues)...
      .filter(-> 
        link = $ this
        !link.parents("[class*='nav']")
          .filter(-> $(link).parents('ul').length>1)
          .length)
      .each ->
        numInternalLinks++;
        # if the anchor element wraps another element, return that, otherwise return the anchor
        # this way the hyperlink entity will hopefully always have a width and height > 0
        child = $(this).children()
        $this = if child.length > 0 then child else $ @
        offset = $this.offset()
        headerBarHeight = $('#hh-header-bar').outerHeight()
        that.addEntity new Entities.Hyperlink
          id: that.lastId
          w: $this.width()
          h: $this.height()
          y: offset.top - headerBarHeight
          x: offset.left
          $el: $this
      @gameState.set "numInternalLinks", numInternalLinks
      @gameState.set "numLinksNeeded", Math.floor(numInternalLinks/2) + 1
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
