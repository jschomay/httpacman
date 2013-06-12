module.exports = 
  Sprite: require './spirte'
  mixin: (ctx) ->
    for key, value of @Sprite
      ctx::[key] = value