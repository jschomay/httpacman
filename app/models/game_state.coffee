module.exports = class GameState extends Backbone.Model
  initialize: () ->
    @set 
      level: 1 # TODO - figure out where to store and manage level
      url: window.currentUrl
      numInternalLinks: 0
      numExternalLinks: 0
      numCollectedLinks: 0
