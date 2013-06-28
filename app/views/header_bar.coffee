# top header bar that floats over all pages to give branding and 
# level number and hotkey options, etc

module.exports = class HeaderBar extends myBackbone.View

  id: 'hh-header-bar'
  template: require './templates/header_bar'

  initialize: ()->
    @listenTo(@model, "change", @render);


    console.log "initiing level ", @model.get "level"
    @render()

  render: ->
    displayUrl = @model.get('url').replace("www.", "")
    displayUrl = displayUrl.split('/')[0] + "/..." if displayUrl.split("/")[1]
    html = @template(_.extend({}, @model.attributes,{displayUrl: displayUrl}))
    @$el.html html