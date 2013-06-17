module.exports = class Entity
  $ = window.myJQuery

  # add event binding to Entity.prototype
  $.extend @::, Backbone.Events
  
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
