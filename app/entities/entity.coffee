module.exports = class Entity

  # add event binding to Entity.prototype
  myJQuery.extend @::, myBackbone.Events
  
  # must call `super` when overriding
  constructor: ->
    for init in @_componentInitFunctions
      init.call @

  # must call `super` when overriding
  update: (dt) =>
    # fire 'enterFrame' event on entity on each update
    @trigger 'enterFrame'
    
  draw: (ctx) ->
    # overwrite on subclass or entity won't render
    false  
