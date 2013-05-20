# define entities
# these could be models of their own (and pulled out to separate files)
# but I think it's best to avoid the overhead, and we don't reallly need
# backbone for game objects

class Player
  constructor: (@position, @speed = 3) ->
    @type = "player"
    @w = 40
    @h = 40

    if !@position
      windowSize = $('body').width()
      @position = 
        x: windowSize/2
        y: 200

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
    player = new Player()

    # crate playing field objects from the DirectorModel

    # create enemies


  update: =>
    startUpdate = new Date.now()
    # call update on each entity
    # or more likely, just fire the `enterframe` event
    # make sure to bind each new entity's update function to that event in @initialize
    console.log "update time", new Date.now() - startUpdate