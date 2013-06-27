module.exports = class GameState extends myBackbone.Model
  initialize: () ->
    @set 
      running: false
      level: 1 # TODO - figure out where to store and manage level
      url: window.currentUrl
      numInternalLinks: "Calculating..."
      numExternalLinks: "Calculating..."
      numLinksNeeded: "Calculating..."
      numCollectedLinks: 0
