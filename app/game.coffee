# atom = require "../vendor/javascripts/game-engine"

module.exports = class Game extends window.atom.Game
  constructor: () ->
    super
    $ = window.myJQuery

    @gameState = new (require 'models/game_state')()
    @canvas = $('<canvas id="hh-canvas"></canvas>')[0]
    @ctx = @canvas.getContext '2d'


    ###
    PREP PAGE
    ###

    # make sure we have a level set
    if not localStorage.getItem "hh-level"
      localStorage.setItem "hh-level", 1
      @gameState.set "level", 1

    # keyboard shortcuts
    document.addEventListener 'keydown', (e) => 
      # press 'R' (or command R for restart) to "refresh" - gets around the "resubmit form comfirmation" prompt
      if e.keyCode is 82
        window.location.href = window.location.origin+"/play"
        false
      # pressing a number key will take you to that level (0-9 on the num pad)
      if 96 <= e.keyCode <= 105
        console.log "cheat code - jump to level", e.keyCode - 96
        @gameState.set 'level', e.keyCode - 96
        localStorage.setItem "hh-level", e.keyCode - 96
      #  press 'P' to pause
      if e.keyCode is 80
        @gameState.set "running", if (@gameState.get "running") then false else true


    # disable links (even though the canvas covers them all)
    $('a').click (e) -> console.log "click on link prevented"; e.preventDefault(); return false;
    
    # make fixed elements absolute so they scroll with the rest of the page
    $('*').filter(-> $(this).css('position') is 'fixed').css 'position', 'absolute'

    # disable scrolling (mousewheel) - not perfect, but works good enough
    window.onmousewheel = document.onmousewheel = (e) -> e.preventDefault()
    
    # disable spacebar scrolling (arrow keys default behaviour prevented on player entity)
    window.onkeypress = document.onkeypress = (e) -> e.preventDefault()


    ###
    SET UP GAME HEADER BAR AND STAGE
    ###

    headerBarView = new (require 'views/header_bar')(model: @gameState)
    $('body').append headerBarView.el

    headerBarHeight = $('#hh-header-bar').outerHeight()
    window.onresize = (e) =>
      @canvas.width = window.innerWidth
      @canvas.height = window.innerHeight - headerBarHeight
    window.onresize()
    $.extend @canvas.style,
      position: 'fixed'
      top: headerBarHeight + 'px'
      left: '0px'
      'z-index': 9999999999
    $('body').append @canvas

    # fps widget
    @stats = new Stats();
    @stats.setMode 0 # 0: fps, 1: ms
    @stats.domElement.style.position = 'fixed'
    @stats.domElement.style['z-index'] = 9999999999
    @stats.domElement.style.right = '0px'
    @stats.domElement.style.top = '0px'
    @stats.domElement.id = 'hh-stats-wdiget'
    document.body.appendChild @stats.domElement 
    @stats.begin()
    

    ###
    SET UP BOARD
    ###
    
    # load level data
    #TODO
    levelData = {numEnemies: Math.min(@gameState.get('level')*5, 50)}

    # director manages all game entities
    @director = new (require './director')(levelData, @gameState)

    console.log "We have a game!"



  update: (dt) ->
    return if not @gameState.get 'running'
    # update fps widget
    @stats.update()
    # tell director to update everything
    @director.update dt

  draw: () ->
    return if not @gameState.get 'running'
    @ctx.clearRect 0, 0, @canvas.width, @canvas.height
    @ctx.save()
    # translate canvas to move stage to match dom with scroll
    @ctx.translate 0, -window.scrollY

    # tell director to draw everything
    @director.draw(@ctx)

    @ctx.restore()
