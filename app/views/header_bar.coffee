# top header bar that floats over all pages to give branding and 
# level number and hotkey options, etc

module.exports = class HeaderBar extends Backbone.View

  id: 'hh-header-bar'
  template: require './templates/header_bar'

  initialize: (@level=1)->
    console.log "initiing level ", @level
    @render()

  render: ->
    html = @template({level: @level})
    @$el.html html