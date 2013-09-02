Entities = require './entities'


###
The director manages all game entities.  It initializes them based on level data, then delegates update and draw to each entity.  It stores entities in a data structure that allows for effcient lookups, and has ways to add and remov entities from this structure.
###
module.exports = class Director
  constructor: (levelData = {}, @gameState) ->
    $ = window.myJQuery
    require = window.require



    #####################
    # INITIALIZE ENTITIES
    #####################

    console.log "Setting the main scene..."

    # give each entity a reference to the director
    Entities.Entity::director  = @

    # create a player entity
    console.log "Putting the player on screen"

    player = @addEntity(new Entities.Player({id: @lastId}))

    # create enemies
    unless @gameState.get('gameOptions').specialLevel is 'virus'
      numEnemies = levelData.numEnemies || 0
      console.log "Putting #{numEnemies} enemies on screen"
      for [1..numEnemies]
        @addEntity(new Entities.Enemy {id:@lastId, player: player})


    ###################################################
    # crate playing field objects from the DirectorModel
    ###################################################
    $(window).load =>
      # wait just a bit after page loads, to catch content appended with ajax
      setTimeout (=>
        # wait just a bit more, trying to optimize delay time by speculating on load time based on page height
        delay = if document.height > 7000 then 1700 else 300
        setTimeout (=>
          # Page should be ready to scrape by now

          ############
          # hyperlinks
          ############
          console.log "Converting hyperlinks to game entities"
          internalLinks = []
          that = @
          numLinks = 0;
          headerBarEl = $('#hh-header-bar')[0]
          # start with all links on page...
          # unless we are on a virus level
          unless @gameState.get('gameOptions').specialLevel is 'virus'
            $('a:visible')
            # filter out links we dont want to use, including:
            .filter -> 
              # links in the header bar
              return false if $.contains(headerBarEl, this)
              # links that have no href or javascript (like pagers in sliders)
              return false if !this.href or this.href is "javascript:void(0);"
              # links that are just anchors
              return false if /#/.test(this.href)
              # mailto: and tel:
              return false if /mailto:|tel:/.test this.href
              # links under a nav system, but only 2nd tier ones (to avoid hidden drop nav menues)
              link = $ this
              return false if link.parents("[class*='nav'], [class*='Nav'], [class*='NAV']").filter(-> $(link).parents('ul').length>1).length
              # if we're still going then don't filter out this link
              return true
            .each ->
              # is this an internal or external link? (not using anymore)

              # quick hack to get around facebook's linkswap on mouseover to get the real like destination
              $(this).trigger('mouseover')[0].href
              link = this.href#.replace(/https?:\/\/(www\.)?/, '').split('/')[0]
              domain = that.gameState.get('url').split('/')[0]
              domainRegex = new RegExp domain, 'i'

              if domainRegex.test link or link is window.location.origin
                internalLinks.push this.href
              
              numLinks++

              # if the anchor element wraps another element, return that, otherwise return the anchor
              # this way the hyperlink entity will hopefully always have a width and height > 0
              child = $(this).children()
              $this = if child.length > 0 then child else $ @
              offset = $this.offset()
              headerBarHeight = $('#hh-header-bar').outerHeight()

              # add entity
              that.addEntity new Entities.Hyperlink
                id: that.lastId
                w: $this.width()
                h: $this.height()
                y: offset.top - headerBarHeight
                x: offset.left
                $el: $this
                href: this.href

          if numLinks is 0
            # No links to grab, what should we do?  For now we just refresh
            # window.location.href = window.location.origin+"/play"
            # or...
            # let's populate a single link in a random place
            manualLink = $('<a href="'+@gameState.get('gameOptions').lastUrl+'">Find me to escape!</a>').appendTo('body').css
              'position': 'absolute'
              'top': Math.floor(Math.random()*(window.document.height-150)) + 100 + 'px'
              'left': Math.floor(Math.random()*(window.document.width-400)) + 200 + 'px'
              'z-index': 99999999
              'opacity': 1
              'display': 'block'
              'visibility': 'visible'
            offset = manualLink.offset()
            headerBarHeight = $('#hh-header-bar').outerHeight()

            # add entity
            @addEntity new Entities.Hyperlink
              id: @lastId
              w: manualLink.width()
              h: manualLink.height()
              y: offset.top - headerBarHeight
              x: offset.left
              $el: manualLink
              href: manualLink[0].href

            numLinks++
            internalLinks.push manualLink[0].href
            console.log manualLink[0].href

          # set game state variables based on number of links scraped
          @gameState.set "numLinks", numLinks

          # 1/20th to 1/2 of all internal links, based on level
          # this will need to be adjusted later...
          @gameState.set "numLinksNeeded", Math.ceil(numLinks*(Math.min(@gameState.get('level', 10)))/20)

          # set randome internal link for when user is caught in "domain purgatory"
          randomIndex = Math.ceil(Math.random()*internalLinks.length)-1
          @gameState.set 'purgatoryLink', internalLinks[randomIndex]

          ################
          # ads
          ################
          $('script, iframe').add('div').filter( -> 
            adIdentifiers = [this.src, this.class, this.id, this.name].join '  '
            adIdentifiers.match(/[\s\._-]ads?[\s\._A-Z-]|doubleclick/)
            )
          .map ->
            if this.nodeName.match /script|iframe/i
              return $(this).parent('div')[0]
            else
              return this
          .each  ->
            $this = $ this
            offset = $this.offset()
            headerBarHeight = $('#hh-header-bar').outerHeight()

            # add entity
            that.addEntity new Entities.Ad
              id: that.lastId
              w: $this.width()
              h: $this.height()
              y: offset.top - headerBarHeight
              x: offset.left
              $el: $this



          # All entities have been loaded, start the game!
          @gameState.set 'running', true
        ),  delay
      ), 400


  lastId: 1

  entities: {}

  addEntity: (entity) =>
    @entities[entity.id] = entity
    @lastId++
    entity

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

  hyperjump: ->    
    if (@gameState.get "numCollectedLinks") >= (@gameState.get "numLinksNeeded")
      if @gameState.get('gameOptions').specialLevel is 'virus'
        # no level up from virus levels
        @nextLevel '', true
      else
        @nextLevel()
    else
      # if you press space before the links load you get undefined, so don't allow that
      return if !@gameState.get('purgatoryLink')
      @gameState.set 'running', false
      if confirm "You don't have enough linkjuice to escape this domain.  You can try to collect more links, or you can hyperjump within this current domain right now (without leveling up).  Do you want to do that?"
        # unbind keys so you don't press space again
        myJQuery(document).off 'keydown' 
        @nextLevel @gameState.get('purgatoryLink'), true
      else
        @gameState.set 'running', true




  nextLevel: (url, noLevelUp = false, params = {}) =>
    unless noLevelUp
      level = localStorage.getItem 'hh-level'
      level++
      localStorage.setItem "hh-level", level
      if level is 5
        url = "https://www.facebook.com/FunnyPikz"
      if level is 10
        url = "http://hyperlinkharrypoc-jschomay.rhcloud.com"
      if level is 15
        url = "https://github.com/jschomay/httpacman"
        # localStorage.removeItem "hh-level"


    # my_.each @entities, (entity) =>
    #   @removeEntity entity.id unless entity.type is "player"
    
    @gameState.set 'running', false

    # fancy page exploding effect
    explodePage = -> 
      keepOnPage = myJQuery("#hh-header-bar, #hh-canvas, #hh-stats-widget")
      keepOnPage.remove()
      elems = myJQuery("body *")
      myJQuery("body").append keepOnPage
      l = elems.length
      i = undefined
      c = undefined
      move = undefined
      x = 1

      A = ->
        i = 0
        while i - l
          c = elems[i].style
          move = elems[i].move
          move = (Math.random() * 8 * ((if Math.round(Math.random()) then 1 else -1)))  unless move
          move *= x
          elems[i].move = move
          c["-webkit-transform"] = "translateX(" + move + "px)"
          i++
        x++

      #Loop
      timer = setInterval(->
        A()
      , 60)

      # jump after page has time to explode
      setTimeout (->
        clearInterval timer
        jump url, params
      ), 2000

    explodePage()
    

    jump = (url, params) =>
      # note that url params get removed from url on page load
      if not url?
        url = ''
      nextLevelUrl = window.location.origin + "/play?hhNextLevelUrl="+url+"&hhCurrentUrl="+@gameState.get('gameOptions').currentUrl
      for param, value of params
        nextLevelUrl += '&'+param+'='+value
      window.location.href = nextLevelUrl

    # alternate POST based method to "jump"
    # needs server.js to use POST vars instead of GET vars to work
    # jump = ->
    #   myJQuery('<form method="post" action="'+window.location.origin+'/play">
    #     <input type="hidden" name="hhNextLevelUrl" value="'+url+'">
    #     </form>').submit()
    

