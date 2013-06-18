/*
INFO: some sites use requirejs or other libraries that overwrite brunch's own global require function, so we need to use our own require fuction `window.myRequire`.

SOURCE: this code is copied from brunch's auto compiling (see build/js/app.js), with the changes to use our own trusted require

CHANGES: assigning window.myRequire instead of window.require at the bottom and refering to it in `localRequire`.  Also `globals` is changed to `window`

USAGE: make sure this code gets called before any other code compiled by brunch (app.js and libs.js).  Put this code and other brunch compiled code above any other libraries that may overwrite window.require.  With the code in place, you can use `require` in your code as usual (the reason it works is because each module is defined with a local reference to `require`, which is a specially composited function for that modeule, returned by `localRequire`, which calls the global myRequire)
*/

(function(/*! Brunch !*/) {
  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return window.myRequire(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  // use the global `myRequire` instead of `require` so it won't get overwritten by other libraries
  window.myRequire = require;
  window.myRequire.define = define;
  window.myRequire.register = define;
  window.myRequire.brunch = true;
  // give the global the `require` function so lib.js and app.js see it exists and wont overwrite it
  window.require = require;
})();
