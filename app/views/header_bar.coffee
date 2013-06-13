# top header bar that floats over all pages to give branding and 
# level number and hotkey options, etc

module.exports = class HeaderBar extends Backbone.View

  id: 'hh-header-bar'
  template: require './templates/header_bar'

  initialize: ()->
    @listenTo(@model, "change", @render);


    console.log "initiing level ", @model.get "level"
    @render()

  render: ->
    html = @template(@model.attributes)
    @$el.html html