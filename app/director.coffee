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
    @addEntity(new Entities.Player({id: @lastId}))

    # create enemies
    numEnemies = levelData.numEnemies || 0
    console.log "Putting #{numEnemies} enemies on screen"
    for [1..numEnemies]
      @addEntity(new Entities.Enemy {id:@lastId})


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
          that = @
          numInternalLinks = 0;
          numExternalLinks = 0;
          headerBarEl = $('#hh-header-bar')[0]
          # start with all links on page...
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
            # is this an internal or external link?

            # quick hack to get around facebook's linkswap on mouseover to get the real like destination
            $(this).trigger('mouseover')[0].href
            link = this.href.replace(/https?:\/\/(www\.)?/, '').split('/')[0]
            domain = that.gameState.get('url').replace("www.", "").split('/')[0]

            internalOrExternal = if domain is link or link is window.location.origin.replace(/https?:\/\//,'') then 'internal' else 'external'
            
            if internalOrExternal is 'internal'
              numInternalLinks++
            else
              numExternalLinks++

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
              internalOrExternal: internalOrExternal
              href: this.href

          # set game state variables based on number of links scraped
          if numExternalLinks is 0
            # No links to grab, what should we do?  For now we just refresh
            window.location.href = window.location.origin+"/play"

          @gameState.set "numInternalLinks", numInternalLinks
          @gameState.set 'numExternalLinks', numExternalLinks

          # 1/30th to 1/3 of all internal links, based on level
          # this will need to be adjusted later...
          @gameState.set "numLinksNeeded", Math.ceil(numInternalLinks*(Math.min(@gameState.get('level', 10)))/30)


          ################
          # ads
          ################
          # $('script, iframe').filter(function(){return this.src.match(/ad|doubleclick/i)}).parent('div').css('border','6px solid magenta')

          @gameState.set 'running', true
        ),  delay
      ), 400


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

  nextLevel: (url) =>
    @gameState.set 'running', false
    # tell server to send us to a new level
    console.log "NEXT LEVEL", url
    level = localStorage.getItem 'hh-level'
    level++
    localStorage.setItem "hh-level", level
    if level is 10
      url = "http://hyperlinkharrypoc-jschomay.rhcloud.com"
      localStorage.removeItem "hh-level"
    myJQuery('<form method="post" action="'+window.location.origin+'/play">
    <input type="hidden" name="nextLevelUrl" value="'+url+'">
    </form>').submit()
    

