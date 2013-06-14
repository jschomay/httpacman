module.exports = class Entity
  
  constructor: ->
    for init in @_componentInitFunctions
      init.call @

  update: (dt) =>
    # overwrite on subclass
    false
    
  draw: (ctx) ->
    # overwrite on subclass
    false  
