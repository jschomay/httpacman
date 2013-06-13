module.exports = 

  # list of available components:
  Sprite: require './spirte'
  Collidable:  require './collidable'


  # call Components.mixin on any entitie to add desired compoents
  # params are: ctx = 'this' refernce to entity, components = comma separated string of existing components
  mixin: (ctx, components) ->
    #  mixin methods for each specified component
    requestedComponents = components.replace(' ', '').split ','
    for component in requestedComponents
      for key, value of @[component]
        ctx::[key] = value
