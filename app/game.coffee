# atom = require "../vendor/javascripts/game-engine"

module.exports = class Game extends window.atom.Game
  constructor: () ->
    super

    # global variables
    @headerBarHeight
    @canvas = $('<canvas id="hh-canvas"></canvas>')[0]
    @ctx = @canvas.getContext '2d'

    ###
    SET UP PAGE WITH GAME HEADER AND STAGE
    ###
    headerBarView = new (require 'views/header_bar')()
    $('body').append headerBarView.el

    @headerBarHeight = $('#hh-header-bar').outerHeight()
    window.onresize = (e) =>
      @canvas.width = window.innerWidth
      @canvas.height = window.innerHeight - @headerBarHeight
    window.onresize()
    $.extend @canvas.style,
      position: 'fixed'
      top: @headerBarHeight + 'px'
      left: '0px'
      'z-index': 999999
    $('body').append @canvas

    # fps widget
    @stats = new Stats();
    @stats.setMode 0 # 0: fps, 1: ms
    @stats.domElement.style.position = 'fixed'
    @stats.domElement.style['z-index'] = 999999
    @stats.domElement.style.right = '0px'
    @stats.domElement.style.top = '0px'
    document.body.appendChild @stats.domElement 
    @stats.begin()

    # disable scrolling (mousewheel) - not perfect, but works good enough
    window.onmousewheel = document.onmousewheel = (e) -> e.preventDefault()
    # disable spacebar scrolling (arrow keys default behaviour prevented on player entity)
    window.onkeypress = document.onkeypress = (e) -> e.preventDefault()
    # disable links (even though the canvas covers them all)
    $("a").click (e) -> console.log "click on link prevented"; e.preventDefault(); return false;

    #load level data
    #TODO
    levelData = {numEnemies: 50}

    # director manages all game entities
    @director = new (require './director')(levelData)

    console.log "We have a game!"



  update: (dt) ->
    # update fps widget
    @stats.update()
    # tell director to update everything
    @director.update dt

  draw: () ->
    @ctx.clearRect 0, 0, @canvas.width, @canvas.height
    @ctx.save()
    # translate canvas to move stage to match dom with scroll
    @ctx.translate 0, -window.scrollY

    # tell director to draw everything
    @director.draw(@ctx)

    @ctx.restore()
