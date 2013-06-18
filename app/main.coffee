Game = require 'game'
# some sites use requirejs or other libraries that overwrite brunch's own require function, so we need to use our own require fuction `window.myRequire`.  Note that `require` is still availalbe inside the modules, but it is different than `window.require` and calls window.require, which will not be ours, so be careful not to use it.
# this code is copied from brunch's auto compiling, with the changes to use our own version of require
# `
# (function(/*! Brunch !*/) {
#   var modules = {};
#   var cache = {};

#   var has = function(object, name) {
#     return ({}).hasOwnProperty.call(object, name);
#   };

#   var expand = function(root, name) {
#     var results = [], parts, part;
#     if (/^\.\.?(\/|$)/.test(name)) {
#       parts = [root, name].join('/').split('/');
#     } else {
#       parts = name.split('/');
#     }
#     for (var i = 0, length = parts.length; i < length; i++) {
#       part = parts[i];
#       if (part === '..') {
#         results.pop();
#       } else if (part !== '.' && part !== '') {
#         results.push(part);
#       }
#     }
#     return results.join('/');
#   };

#   var dirname = function(path) {
#     return path.split('/').slice(0, -1).join('/');
#   };

#   var localRequire = function(path) {
#     return function(name) {
#       var dir = dirname(path);
#       var absolute = expand(dir, name);
#       return window.myRequire(absolute);
#     };
#   };

#   var initModule = function(name, definition) {
#     var module = {id: name, exports: {}};
#     definition(module.exports, localRequire(name), module);
#     var exports = cache[name] = module.exports;
#     return exports;
#   };

#   var require = function(name) {
#     var path = expand(name, '.');

#     if (has(cache, path)) return cache[path];
#     if (has(modules, path)) return initModule(path, modules[path]);

#     var dirIndex = expand(path, './index');
#     if (has(cache, dirIndex)) return cache[dirIndex];
#     if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

#     throw new Error('Cannot find module "' + name + '"');
#   };

#   var define = function(bundle, fn) {
#     if (typeof bundle === 'object') {
#       for (var key in bundle) {
#         if (has(bundle, key)) {
#           modules[key] = bundle[key];
#         }
#       }
#     } else {
#       modules[bundle] = fn;
#     }
#   };

#   window.myRequire = require;
#   window.myRequire.define = define;
#   window.myRequire.register = define;
#   window.myRequire.brunch = true;
# })();

# `

# some sites already use backbone, jquery, etc, and often older versions, so we need to be sure to use our own
# Here's an ugly hack to make sure we are using our versions
# Unfortunately, as is, you need to use `myExpectedFunction` like `myJQuery` anywhere you want to be sure you're using our own
# Test for jquery version with `console.log "$ version", $().jquery` to know if you have your own version
window.myJQuery = $
$.noConflict()
window.myBackbone = Backbone.noConflict();


jQuery () ->
  game = new Game()

  # start off game loop
  game.run()
  # stop the game after a few seconds to help view console for debugging
  window.onblur = -> game.stop()
  window.onfocus = -> game.run()
