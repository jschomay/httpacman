module.exports =

  _init: -> 
    console.log @.id, 'checks for collision'

    @once 'enterFrame', ->
      # check for collisions
      # get all other collidable entities (currently all are, probably need to filter them by some kind of scene graph/quad tree)
      potentialObstacles = @director.entities
      # for each, compare positions
      for id, entity of potentialObstacles
        console.log  entity.id is @.id
          
      # for each collision run the @onHit method for the collided type
      # (in onHit) move back to @_wasAt (may want to issolate x and y??)