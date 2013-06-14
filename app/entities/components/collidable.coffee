module.exports =

  _init: -> 
    console.log @.id, 'checks for collision'

    @on 'enterFrame', ->
      console.log "enterFrame"
