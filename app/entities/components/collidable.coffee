module.exports =

  _init: -> 

    # run right behaviour based on obstacle type
    # must define @onHit object in @constructor with obstacle.type keys for appropriate function values
    @_onHit = (obstacle) ->
      @onHit[obstacle.type]?.call(@, obstacle)


    @on 'enterFrame', ->
      # check for collisions
      # get all other collidable entities (may need to filter them by some kind of scene graph/quad tree, for now just get all entities)
      potentialObstacles = @director.entities
      # check each entity for a collision
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
            # for each collision run the @onHit method for the collided type
            @_onHit(obstacle)
          