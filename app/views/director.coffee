###
The director view knows how to render each type of game entity, and has a reference to the scene graph.
It renders each entity with the proper render function when its own draw method gets called.
It will know how to run sprite animations.
It may also hold certain special effects.
###

###
TODO
- method to add and remove elements outside of the initialize
###
module.exports = class DirectorView extends Backbone.view
  initialize: () ->
    console.log arguments, @options, @model

    # for each entity, add a div to the html with it's id as type+id (some might alrady be in the dom...)
    # and put a handle to the div in @$entityElements under it's id
    # ...

  renderFunctons:
    "player": ($el) ->
      $el.css
        width: @w
        height: @h
        top: @position.y
        left: @position.x

  $entityElements: {}

  draw: (dt) =>
    startDraw = new Date.now()

    # render each entity in scene

    # test with just player (put in loop later)
    entity = @model.player.type
    id = @model.player.id
    #use proper render function on the right element for each entity
    @renderFunctons[entity](@$entityElements[id])

    console.log "draw time", new Date.now() - startDraw
