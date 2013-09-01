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
    displayUrl = @model.get('url').replace(/https?:\/\/(www\.)?/, '')
    displayUrl = displayUrl.split('/')[0] + "/..." if displayUrl.split("/")[1]
    html = @template(my_.extend({}, @model.attributes,{displayUrl: displayUrl}))
    @$el.html html
    # set styles for progress bar
    goal = @model.get('numLinksNeeded')/@model.get('numLinks')*100
    @$('#hh-goal').css(left: goal + '%', display: 'inline-block')
    collected = @model.get('numCollectedLinks')
    @$('#hh-collected').css display: 'inline-block'
    progress = @model.get('numCollectedLinks')/@model.get('numLinks')*100
    @$('#hh-progress').css(width: progress+'%', display: 'inline-block')
    # show hyper jump ready text
    if (@model.get "numCollectedLinks") >= (@model.get "numLinksNeeded")
      myJQuery('#hh-meter-full').addClass 'show'
    else
      myJQuery('#hh-meter-full').removeClass 'show'
