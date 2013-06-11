(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

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
      return globals.require(absolute);
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

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("game", function(exports, require, module) {
  var Game,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Game = (function(_super) {
    __extends(Game, _super);

    function Game(entities) {
      this.entities = entities;
      Game.__super__.constructor.apply(this, arguments);
      this.directorModel = new (require('models/director'))();
      this.directorView = new (require('views/director'))(this.directorModel.entities);
      console.log("We have a game!");
      this.stats = new Stats();
      this.stats.setMode(0);
      this.stats.domElement.style.position = 'fixed';
      this.stats.domElement.style['z-index'] = 9999;
      this.stats.domElement.style.right = '0px';
      this.stats.domElement.style.top = '0px';
      document.body.appendChild(this.stats.domElement);
      this.stats.begin();
    }

    Game.prototype.update = function(dt) {
      this.stats.update();
      return this.directorModel.update(dt);
    };

    Game.prototype.draw = function() {
      return this.directorView.draw();
    };

    return Game;

  })(window.atom.Game);
  
});
window.require.register("main", function(exports, require, module) {
  var Game;

  Game = require('game');

  $(function() {
    var HeaderBarView, game, headerBarView;

    console.log('Main app starting...');
    $("a").click(function(e) {
      console.log("click on link prevented");
      e.preventDefault();
      return false;
    });
    HeaderBarView = require('views/header_bar');
    headerBarView = new HeaderBarView();
    $('body').append(headerBarView.el);
    game = new Game();
    game.run();
    window.onblur = function() {
      return game.stop();
    };
    return window.onfocus = function() {
      return game.run();
    };
  });
  
});
window.require.register("models/director", function(exports, require, module) {
  var DirectorModel, Entities, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Entities = require('./entities');

  /*
  The director model is in charge of initializing (and destroying) all game entities based on level data.
  It holds all the entities in some form of a scene graph, which may be rather straight forward at this point (backbone collection?).
  It may also need to create one or more quad trees to handle collision (or at least pass the entities off to a collision module)
  It also makes sure each entity's `update` function gets called when it's own update method gets called
  */


  module.exports = DirectorModel = (function(_super) {
    __extends(DirectorModel, _super);

    function DirectorModel() {
      this.update = __bind(this.update, this);
      this.removeEntity = __bind(this.removeEntity, this);
      this.addEntity = __bind(this.addEntity, this);    _ref = DirectorModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DirectorModel.prototype.initialize = function(levelData) {
      var numEnemies, _i, _results;

      if (levelData == null) {
        levelData = {};
      }
      console.log("Setting the main scene...");
      console.log(Entities);
      console.log("Putting the player on screen");
      this.addEntity(new Entities.Player({
        id: this.lastId
      }));
      numEnemies = 50;
      console.log("Putting " + numEnemies + " enemies on screen");
      _results = [];
      for (_i = 1; 1 <= numEnemies ? _i <= numEnemies : _i >= numEnemies; 1 <= numEnemies ? _i++ : _i--) {
        _results.push(this.addEntity(new Entities.Enemy({
          id: this.lastId
        })));
      }
      return _results;
    };

    DirectorModel.prototype.lastId = 1;

    DirectorModel.prototype.entities = {};

    DirectorModel.prototype.addEntity = function(entity) {
      this.entities[entity.id] = entity;
      return this.lastId++;
    };

    DirectorModel.prototype.removeEntity = function(id) {
      return delete this.entities[id];
    };

    DirectorModel.prototype.update = function(dt) {
      var entity, id, _ref1, _results;

      _ref1 = this.entities;
      _results = [];
      for (id in _ref1) {
        entity = _ref1[id];
        _results.push(entity.update(dt));
      }
      return _results;
    };

    return DirectorModel;

  })(Backbone.Model);
  
});
window.require.register("models/entities/enemy", function(exports, require, module) {
  var Enemy,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = Enemy = (function() {
    function Enemy(options) {
      this.update = __bind(this.update, this);    this.type = "enemy";
      this.id = this.type + options.id;
      this.w = 30;
      this.h = 30;
      this.background = 'brown';
      this.speed = 100;
      this.position = {
        x: Math.random() * window.document.width,
        y: Math.random() * window.document.height
      };
    }

    Enemy.prototype.update = function(dt) {
      var directionX, directionY, _speed;

      directionX = Math.ceil(Math.random() * 3) - 2;
      directionY = Math.ceil(Math.random() * 3) - 2;
      _speed = directionX && directionY ? this.speed / 1.41421 : this.speed;
      this.position.x += _speed * directionX * dt;
      return this.position.y += _speed * directionY * dt;
    };

    return Enemy;

  })();
  
});
window.require.register("models/entities/index", function(exports, require, module) {
  module.exports = {
    Player: require('./player'),
    Enemy: require('./enemy')
  };
  
});
window.require.register("models/entities/player", function(exports, require, module) {
  var Player,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = Player = (function() {
    function Player(options) {
      this.update = __bind(this.update, this);    this.positiond = options.positiond;
      this.type = "player";
      this.id = this.type + options.id;
      this.w = 40;
      this.h = 40;
      this.background = 'yellow';
      this.acceleration = 50;
      this.maxSpeed = 500;
      this.vx = 0;
      this.vy = 0;
      this.drag = .8;
      if (!this.position) {
        this.position = {
          x: window.document.width / 2,
          y: 200
        };
      }
      atom.input.bind(atom.key.LEFT_ARROW, 'left');
      atom.input.bind(atom.key.RIGHT_ARROW, 'right');
      atom.input.bind(atom.key.DOWN_ARROW, 'down');
      atom.input.bind(atom.key.UP_ARROW, 'up');
    }

    Player.prototype.update = function(dt) {
      var dx, dy;

      if (atom.input.down('left')) {
        if (!(this.vx <= -this.maxSpeed)) {
          this.vx -= this.acceleration;
        }
      }
      if (atom.input.down('right')) {
        if (!(this.vx >= this.maxSpeed)) {
          this.vx += this.acceleration;
        }
      }
      if (atom.input.down('up')) {
        if (!(this.vy <= -this.maxSpeed)) {
          this.vy -= this.acceleration;
        }
      }
      if (atom.input.down('down')) {
        if (!(this.vy >= this.maxSpeed)) {
          this.vy += this.acceleration;
        }
      }
      dx = this.vx * dt;
      dy = this.vy * dt;
      this.vx *= this.drag;
      this.vy *= this.drag;
      if (this.position.x + dx < 0) {
        this.position.x = 0;
        this.vx = 0;
      } else if (this.position.x + dx + this.w > window.document.width) {
        this.position.x = window.document.width - this.w;
        this.vx = 0;
      } else {
        this.position.x += dx;
      }
      if (this.position.y + dy < 0) {
        this.position.y = 0;
        return this.vy = 0;
      } else if (this.position.y + dy + this.h + 58 > window.document.height) {
        this.position.y = window.document.height - this.h - 58;
        return this.vy = 0;
      } else {
        this.position.y += dy;
        if (!(this.position.y < 200 || this.position.y > window.document.height - 200)) {
          return window.scrollTo(0, this.position.y - window.innerHeight / 2 + this.h / 2 + 58);
        }
      }
    };

    return Player;

  })();
  
});
window.require.register("views/director", function(exports, require, module) {
  /*
  The director view knows how to render each type of game entity, and has a reference to the scene graph.
  It renders each entity with the proper render function when its own draw method gets called.
  It will know how to run sprite animations.
  It may also hold certain special effects.
  */

  /*
  TODO
  - method to add and remove elements outside of the initialize
  */

  var DirectorView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = DirectorView = (function(_super) {
    __extends(DirectorView, _super);

    function DirectorView() {
      this.draw = __bind(this.draw, this);    _ref = DirectorView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DirectorView.prototype.initialize = function(entities) {
      var $body, canvasHeight, canvasWidth, headerBarHeight,
        _this = this;

      this.entities = entities;
      window.onmousewheel = document.onmousewheel = function(e) {
        return e.preventDefault();
      };
      window.onkeypress = document.onkeypress = function(e) {
        return e.preventDefault();
      };
      $body = $('body');
      headerBarHeight = 58;
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight - headerBarHeight;
      this.canvas = $('<canvas id="hp-canvas"></canvas>')[0];
      window.onresize = function(e) {
        _this.canvas.width = window.innerWidth;
        return _this.canvas.height = window.innerHeight - headerBarHeight;
      };
      window.onresize();
      this.ctx = this.canvas.getContext('2d');
      $.extend(this.canvas.style, {
        position: 'fixed',
        top: headerBarHeight + 'px',
        left: '0px',
        'z-index': 9999
      });
      return $body.append(this.canvas);
    };

    DirectorView.prototype.draw = function() {
      var entity, id, _ref1;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.translate(0, -window.scrollY);
      _ref1 = this.entities;
      for (id in _ref1) {
        entity = _ref1[id];
        this.ctx.fillStyle = entity.background;
        this.ctx.fillRect(entity.position.x, entity.position.y, entity.w, entity.h);
      }
      return this.ctx.restore();
    };

    return DirectorView;

  })(Backbone.View);
  
});
window.require.register("views/header_bar", function(exports, require, module) {
  var HeaderBar, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = HeaderBar = (function(_super) {
    __extends(HeaderBar, _super);

    function HeaderBar() {
      _ref = HeaderBar.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HeaderBar.prototype.className = 'hp-header-bar';

    HeaderBar.prototype.template = require('views/templates/header_bar');

    HeaderBar.prototype.initialize = function(level) {
      this.level = level != null ? level : 1;
      console.log("initiing level ", this.level);
      return this.render();
    };

    HeaderBar.prototype.render = function() {
      var html;

      html = this.template({
        level: this.level
      });
      return this.$el.html(html);
    };

    return HeaderBar;

  })(Backbone.View);
  
});
window.require.register("views/templates/header_bar", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<h2 class="hp-logo">httpacman://</h2><div id="hp-level"><h3 class="hp-level--title">level #' + escape((interp = level) == null ? '' : interp) + '</h3></div>');
  }
  return buf.join("");
  };
});
