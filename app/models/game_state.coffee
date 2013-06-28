module.exports = class GameState extends myBackbone.Model
  initialize: () ->
    @set 
      running: false
      level: localStorage.getItem "hh-level"
      url: window.currentUrl
      numInternalLinks: "Calculating..."
      numExternalLinks: "Calculating..."
      numLinksNeeded: "Calculating..."
      numCollectedLinks: 0
