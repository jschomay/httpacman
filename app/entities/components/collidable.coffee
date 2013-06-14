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
          obstacleLeft = obstacle.position.x
          obstacleRight = obstacle.position.x + obstacle.w
          thisLeft = @.position.x
          thisRight = @.position.x + @.w
          obstacleTop = obstacle.position.y
          obstacleBottom = obstacle.position.y + obstacle.h
          thisTop = @.position.y
          thisBottom = @.position.y + @.h
          if Math.max(obstacleRight, thisRight) - Math.min(obstacleLeft, thisLeft) <= obstacle.w + @w and
          Math.max(obstacleBottom, thisBottom) - Math.min(obstacleTop, thisTop) <= obstacle.h + @h
            @_hit = true
            obstacle.background = 'black'
      if @_hit    
        @.background = 'red'
      else
        @background = 'yellow'
          
      # for each collision run the @onHit method for the collided type
      # (in onHit) move back to @_wasAt (may want to issolate x and y??)