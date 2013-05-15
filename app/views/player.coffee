# player character, represented as a div
# controllable via arrow keys

module.exports = class Player extends Backbone.View

  className: "hp-player"

  initialize: (@position, @speed = 3) ->
    @w = 40
    @h = 40

    if !@position
      windowSize = $('body').width()
      @position = 
        x: windowSize/2
        y: 200

    @render()



  render: ->
    # inline styles from properites
    @$el.css
      width: @w
      height: @h
      top: @position.y
      left: @position.x

    # animation/sprite stuff will probably go here later

