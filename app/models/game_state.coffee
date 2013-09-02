module.exports = class GameState extends myBackbone.Model
  initialize: () ->
    gameOptions = JSON.parse window.hhGameOptions
    @set 
      running: false
      level: localStorage.getItem "hh-level"
      gameOptions: gameOptions
      url: gameOptions.currentUrl
      numLinks: "Calculating..."
      numLinksNeeded: "Calculating..."
      numCollectedLinks: 0
    console.log @attributes.gameOptions
