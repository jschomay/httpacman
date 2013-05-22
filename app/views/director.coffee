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
    # and put a handle to the div in @entityDivs under it's id
    # ISSUES, ** NEED TO FIGURE THESE OUT:
    #  - some might alrady be in the dom, like the game field elements
    #  - what about elements that get added/removed during the game?
    
    # disable scrolling (mousewheel)
    # TODO probably want to do something if user uses the actual scroll bar
    # right now it slides the page under the canvas, which is a bug
    window.onmousewheel = document.onmousewheel = (e) -> e.preventDefault()
    # disable spacebar scrolling
    window.onkeypress = document.onkeypress = (e) -> e.preventDefault()


    $body = $ 'body'
    headerBarHeight = 58
    canvasWidth = window.innerWidth
    canvasHeight = window.innerHeight - headerBarHeight
    @canvas = $('<canvas id="hp-canvas"></canvas>')[0]
    window.onresize = (e) =>
      @canvas.width = window.innerWidth
      @canvas.height = window.innerHeight - headerBarHeight
    window.onresize()
    @ctx = @canvas.getContext '2d'
    $.extend @canvas.style,
      position: 'fixed'
      top: headerBarHeight + 'px'
      left: '0px'
      'z-index': 9999
    $body.append @canvas

  draw: =>
    @ctx.clearRect 0, 0, @canvas.width, @canvas.height
    # render each entity in scene
    for id, entity of @entities
      @ctx.fillStyle = entity.background
      @ctx.fillRect entity.position.x, entity.position.y, entity.w, entity.h
