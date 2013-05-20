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
module.exports = class DirectorView extends Backbone.View
  initialize: (@entities) ->
    # for each entity, add a div to the html with it's id as type+id
    # and put a handle to the div in @$entityDivs under it's id
    # ISSUES, ** NEED TO FIGURE THESE OUT:
    #  - some might alrady be in the dom, like the game field elements
    #  - what about elements that get added/removed during the game?
    @$body = $ 'body'
    console.log "entities", @entities
    @addEntties @entities

  addEntties: (entities) =>
    for id, entity of entities
      console.log "drawing to the dom:", id
      @$entityDivs[id] = $("<div id=\"hp-#{id}\" class=\"hp-entity\">#{id}</div>")
      @$body.append @$entityDivs[id]
      @renderFunctons[entity.type].call entity, @$entityDivs[id]

  removeEntities: (entities) =>
    # TODO
    false

  renderFunctons:
    "player": ($el) ->
      $el.css
        background: 'yellow'
        width: @w
        height: @h
        top: @position.y
        left: @position.x

  $entityDivs: {}

  draw: =>
    # render each entity in scene
    for id, entity of @entities
      #use proper render function on the right element for each entity
      @renderFunctons[entity.type].call entity, @$entityDivs[id]

