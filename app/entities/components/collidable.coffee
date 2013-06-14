module.exports =

  _init: -> 
    console.log @.id, 'checks for collision'

    @on 'enterFrame', ->
      @_hit = false
      # check for collisions
      # get all other collidable entities (currently all are, probably need to filter them by some kind of scene graph/quad tree)
      potentialObstacles = @director.entities
      # for each, compare positions
      for id, obstacle of potentialObstacles
        unless @.id is id
          if obstacle.position.x < @.position.x < obstacle.position.x + obstacle.w and
          obstacle.position.y < @position.y < obstacle.position.y + obstacle.h
            @_hit = true
            obstacle.background = 'black'
      if @_hit    
        @.background = 'red'
      else
        @background = 'yellow'
          
      # for each collision run the @onHit method for the collided type
      # (in onHit) move back to @_wasAt (may want to issolate x and y??)