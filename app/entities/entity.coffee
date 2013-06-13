module.exports = class Entity
  
  constructor: ->
    true

  update: (dt) =>
    # overwrite on subclass
    false
    
  draw: (ctx) ->
    # overwrite on subclass
    false  
