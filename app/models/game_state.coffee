module.exports = class GameState extends myBackbone.Model
  initialize: () ->
    @set 
      running: false
      level: localStorage.getItem "hh-level"
      url: window.currentUrl
      numLinks: "Calculating..."
      numLinksNeeded: "Calculating..."
      numCollectedLinks: 0
