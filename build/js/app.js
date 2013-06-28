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

window.require.register("director", function(exports, require, module) {
  var Director, Entities,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Entities = require('./entities');

  /*
  The director manages all game entities.  It initializes them based on level data, then delegates update and draw to each entity.  It stores entities in a data structure that allows for effcient lookups, and has ways to add and remov entities from this structure.
  */


  module.exports = Director = (function() {
    function Director(levelData, gameState) {
      var $, numEnemies, require, _i,
        _this = this;

      if (levelData == null) {
        levelData = {};
      }
      this.gameState = gameState;
      this.nextLevel = __bind(this.nextLevel, this);
      this.draw = __bind(this.draw, this);
      this.update = __bind(this.update, this);
      this.removeEntity = __bind(this.removeEntity, this);
      this.addEntity = __bind(this.addEntity, this);
      $ = window.myJQuery;
      require = window.require;
      console.log("Setting the main scene...");
      Entities.Entity.prototype.director = this;
      console.log("Putting the player on screen");
      this.addEntity(new Entities.Player({
        id: this.lastId
      }));
      numEnemies = levelData.numEnemies || 0;
      console.log("Putting " + numEnemies + " enemies on screen");
      for (_i = 1; 1 <= numEnemies ? _i <= numEnemies : _i >= numEnemies; 1 <= numEnemies ? _i++ : _i--) {
        this.addEntity(new Entities.Enemy({
          id: this.lastId
        }));
      }
      $(window).load(function() {
        return setTimeout((function() {
          var delay;

          delay = document.height > 7000 ? 1700 : 300;
          return setTimeout((function() {
            var headerBarEl, numExternalLinks, numInternalLinks, that;

            console.log("Converting hyperlinks to game entities");
            that = _this;
            numInternalLinks = 0;
            numExternalLinks = 0;
            headerBarEl = $('#hh-header-bar')[0];
            $('a:visible').filter(function() {
              var link;

              if ($.contains(headerBarEl, this)) {
                return false;
              }
              if (!this.href || this.href === "javascript:void(0);") {
                return false;
              }
              if (/#/.test(this.href)) {
                return false;
              }
              if (/mailto:|tel:/.test(this.href)) {
                return false;
              }
              link = $(this);
              if (link.parents("[class*='nav'], [class*='Nav'], [class*='NAV']").filter(function() {
                return $(link).parents('ul').length > 1;
              }).length) {
                return false;
              }
              return true;
            }).each(function() {
              var $this, child, domain, headerBarHeight, internalOrExternal, link, offset;

              $(this).trigger('mouseover')[0].href;
              link = this.href.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
              domain = that.gameState.get('url').replace("www.", "").split('/')[0];
              internalOrExternal = domain === link || link === window.location.origin.replace(/https?:\/\//, '') ? 'internal' : 'external';
              if (internalOrExternal === 'internal') {
                numInternalLinks++;
              } else {
                numExternalLinks++;
              }
              child = $(this).children();
              $this = child.length > 0 ? child : $(this);
              offset = $this.offset();
              headerBarHeight = $('#hh-header-bar').outerHeight();
              return that.addEntity(new Entities.Hyperlink({
                id: that.lastId,
                w: $this.width(),
                h: $this.height(),
                y: offset.top - headerBarHeight,
                x: offset.left,
                $el: $this,
                internalOrExternal: internalOrExternal,
                href: this.href
              }));
            });
            if (numExternalLinks === 0) {
              window.location.href = window.location.origin + "/play";
            }
            _this.gameState.set("numInternalLinks", numInternalLinks);
            _this.gameState.set('numExternalLinks', numExternalLinks);
            _this.gameState.set("numLinksNeeded", Math.ceil(numInternalLinks * (Math.min(_this.gameState.get('level', 10))) / 30));
            return _this.gameState.set('running', true);
          }), delay);
        }), 400);
      });
    }

    Director.prototype.lastId = 1;

    Director.prototype.entities = {};

    Director.prototype.addEntity = function(entity) {
      this.entities[entity.id] = entity;
      return this.lastId++;
    };

    Director.prototype.removeEntity = function(id) {
      return delete this.entities[id];
    };

    Director.prototype.update = function(dt) {
      var entity, id, _ref, _results;

      _ref = this.entities;
      _results = [];
      for (id in _ref) {
        entity = _ref[id];
        _results.push(entity.update(dt));
      }
      return _results;
    };

    Director.prototype.draw = function(ctx) {
      var entity, id, _ref, _results;

      _ref = this.entities;
      _results = [];
      for (id in _ref) {
        entity = _ref[id];
        _results.push(entity.draw(ctx));
      }
      return _results;
    };

    Director.prototype.nextLevel = function(url) {
      var level;

      this.gameState.set('running', false);
      console.log("NEXT LEVEL", url);
      level = localStorage.getItem('hh-level');
      level++;
      localStorage.setItem("hh-level", level);
      if (level === 10) {
        url = "http://hyperlinkharrypoc-jschomay.rhcloud.com";
        localStorage.removeItem("hh-level");
      }
      return myJQuery('<form method="post" action="' + window.location.origin + '/play">\
    <input type="hidden" name="nextLevelUrl" value="' + url + '">\
    </form>').submit();
    };

    return Director;

  })();
  
});
window.require.register("entities/components/collidable", function(exports, require, module) {
  module.exports = {
    _init: function() {
      this._onHit = function(obstacle) {
        var _ref;

        return (_ref = this.onHit[obstacle.type]) != null ? _ref.call(this, obstacle) : void 0;
      };
      return this.on('enterFrame', function() {
        var id, obstacle, obstacleBottom, obstacleLeft, obstacleRight, obstacleTop, potentialObstacles, thisBottom, thisLeft, thisRight, thisTop, _results;

        potentialObstacles = this.director.entities;
        _results = [];
        for (id in potentialObstacles) {
          obstacle = potentialObstacles[id];
          if (this.id !== id) {
            obstacleLeft = obstacle.position.x;
            obstacleRight = obstacle.position.x + obstacle.w;
            thisLeft = this.position.x;
            thisRight = this.position.x + this.w;
            obstacleTop = obstacle.position.y;
            obstacleBottom = obstacle.position.y + obstacle.h;
            thisTop = this.position.y;
            thisBottom = this.position.y + this.h;
            if (Math.max(obstacleRight, thisRight) - Math.min(obstacleLeft, thisLeft) <= obstacle.w + this.w && Math.max(obstacleBottom, thisBottom) - Math.min(obstacleTop, thisTop) <= obstacle.h + this.h) {
              _results.push(this._onHit(obstacle));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    }
  };
  
});
window.require.register("entities/components/index", function(exports, require, module) {
  module.exports = {
    Sprite: require('./spirte'),
    Collidable: require('./collidable'),
    mixin: function(ctx, components) {
      var component, key, requestedComponents, value, _i, _len, _ref, _results;

      requestedComponents = components.replace(' ', '').split(',');
      ctx.prototype._componentInitFunctions = [];
      _results = [];
      for (_i = 0, _len = requestedComponents.length; _i < _len; _i++) {
        component = requestedComponents[_i];
        _ref = this[component];
        for (key in _ref) {
          value = _ref[key];
          if (key !== '_init') {
            ctx.prototype[key] = value;
          }
        }
        if (this[component]._init != null) {
          _results.push(ctx.prototype._componentInitFunctions.push(this[component]._init));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };
  
});
window.require.register("entities/components/spirte", function(exports, require, module) {
  module.exports = {
    draw: function(ctx) {
      ctx.fillStyle = this.background;
      return ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
    },
    setPositionAndSize: function(x, y, w, h) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (w == null) {
        w = 30;
      }
      if (h == null) {
        h = 30;
      }
      this.w = w;
      this.h = h;
      return this.position = {
        x: x,
        y: y
      };
    },
    initializeSprite: function(options) {
      this.setPositionAndSize(options.x, options.y, options.w, options.h);
      this.type = options.type;
      this.id = this.type + options.id;
      return this.background = options.background || 'black';
    }
  };
  
});
window.require.register("entities/enemy", function(exports, require, module) {
  var Components, Enemy, Entity,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Components = require('./components');

  Entity = require('./entity');

  module.exports = Enemy = (function(_super) {
    __extends(Enemy, _super);

    Components.mixin(Enemy, 'Sprite, Collidable');

    function Enemy(options) {
      this.update = __bind(this.update, this);    this.initializeSprite({
        type: "enemy",
        id: options.id,
        w: options.w,
        h: options.h,
        x: options.x || (Math.random() * window.document.width),
        y: options.y || (Math.random() * window.document.height),
        background: 'brown'
      });
      this.speed = 100;
      Enemy.__super__.constructor.apply(this, arguments);
    }

    Enemy.prototype.update = function(dt) {
      var directionX, directionY, _speed;

      directionX = Math.ceil(Math.random() * 3) - 2;
      directionY = Math.ceil(Math.random() * 3) - 2;
      _speed = directionX && directionY ? this.speed / 1.41421 : this.speed;
      this.position.x += _speed * directionX * dt;
      this.position.y += _speed * directionY * dt;
      return Enemy.__super__.update.apply(this, arguments);
    };

    Enemy.prototype.onHit = function(obstacle) {
      var _ref;

      return (_ref = this._onHitFunctions[obstacle.type]) != null ? _ref.call(this, obstacle) : void 0;
    };

    Enemy.prototype.onHitHyperlink = function(obstacle) {
      return obstacle.background = 'brown';
    };

    Enemy.prototype.onHitEnemy = function(obstacle) {
      return false;
    };

    Enemy.prototype._onHitFunctions = {
      'hyperlink': Enemy.prototype.onHitHyperlink,
      'enemy': Enemy.prototype.onHitEnemy
    };

    return Enemy;

  })(Entity);
  
});
window.require.register("entities/entity", function(exports, require, module) {
  var Entity,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = Entity = (function() {
    myJQuery.extend(Entity.prototype, myBackbone.Events);

    function Entity() {
      this.update = __bind(this.update, this);
      var init, _i, _len, _ref;

      _ref = this._componentInitFunctions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        init = _ref[_i];
        init.call(this);
      }
    }

    Entity.prototype.update = function(dt) {
      return this.trigger('enterFrame');
    };

    Entity.prototype.draw = function(ctx) {
      return false;
    };

    return Entity;

  })();
  
});
window.require.register("entities/hyperlink", function(exports, require, module) {
  var Components, Entity, Hyperlink,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Components = require('./components');

  Entity = require('./entity');

  module.exports = Hyperlink = (function(_super) {
    __extends(Hyperlink, _super);

    Components.mixin(Hyperlink, 'Sprite');

    function Hyperlink(options) {
      this.initializeSprite({
        type: "hyperlink",
        id: options.id,
        w: options.w,
        h: options.h,
        x: options.x,
        y: options.y,
        background: 'green'
      });
      this.$el = options.$el;
      this.internalOrExternal = options.internalOrExternal;
      this.href = options.href;
      Hyperlink.__super__.constructor.apply(this, arguments);
    }

    Hyperlink.prototype.draw = function(ctx) {
      ctx.strokeStyle = this.internalOrExternal === 'internal' ? 'green' : 'orange';
      return ctx.strokeRect(this.position.x, this.position.y, this.w, this.h);
    };

    Hyperlink.prototype.destroy = function() {
      this.$el.animate({
        opacity: 0.1
      });
      return this.director.removeEntity(this.id);
    };

    return Hyperlink;

  })(Entity);
  
});
window.require.register("entities/index", function(exports, require, module) {
  module.exports = {
    Entity: require('./entity'),
    Player: require('./player'),
    Enemy: require('./enemy'),
    Hyperlink: require('./hyperlink')
  };
  
});
window.require.register("entities/player", function(exports, require, module) {
  var Components, Entity, Player,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Components = require('./components');

  Entity = require('./entity');

  module.exports = Player = (function(_super) {
    __extends(Player, _super);

    Components.mixin(Player, 'Sprite, Collidable');

    function Player(options) {
      this.update = __bind(this.update, this);
      var _ref, _ref1;

      this.initializeSprite({
        type: "player",
        id: options.id,
        w: 40,
        h: 40,
        x: (options != null ? (_ref = options.position) != null ? _ref.x : void 0 : void 0) || window.document.width / 2,
        y: (options != null ? (_ref1 = options.position) != null ? _ref1.y : void 0 : void 0) || 200,
        background: 'yellow'
      });
      this.acceleration = 100;
      this.maxSpeed = 5000;
      this.vx = 0;
      this.vy = 0;
      this.drag = .8;
      atom.input.bind(atom.key.LEFT_ARROW, 'left');
      atom.input.bind(atom.key.RIGHT_ARROW, 'right');
      atom.input.bind(atom.key.DOWN_ARROW, 'down');
      atom.input.bind(atom.key.UP_ARROW, 'up');
      this.onHit = {
        'hyperlink': this.onHitHyperlink,
        'enemy': this.onHitEnemy
      };
      Player.__super__.constructor.apply(this, arguments);
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
      this._wasAt = {
        x: this.position.x,
        y: this.position.y
      };
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
        this.vy = 0;
      } else if (this.position.y + dy + this.h + 58 > window.document.height) {
        this.position.y = window.document.height - this.h - 58;
        this.vy = 0;
      } else {
        this.position.y += dy;
        if (!(this.position.y < 200 || this.position.y > window.document.height - 200)) {
          window.scrollTo(0, this.position.y - window.innerHeight / 2 + this.h / 2 + 58);
        }
      }
      return Player.__super__.update.apply(this, arguments);
    };

    Player.prototype.onHitHyperlink = function(obstacle) {
      if (obstacle.internalOrExternal === "internal") {
        this.director.gameState.set('numInternalLinks', this.director.gameState.get('numInternalLinks') - 1);
        this.director.gameState.set('numCollectedLinks', this.director.gameState.get('numCollectedLinks') + 1);
        return obstacle.destroy();
      } else {
        if ((this.director.gameState.get("numCollectedLinks")) < (this.director.gameState.get("numLinksNeeded"))) {
          return;
        }
        return this.director.nextLevel(obstacle.href);
      }
    };

    Player.prototype.onHitEnemy = function(obstacle) {
      return this.background = 'purple';
    };

    return Player;

  })(Entity);
  
});
window.require.register("game", function(exports, require, module) {
  var Game,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Game = (function(_super) {
    __extends(Game, _super);

    function Game() {
      var $, headerBarHeight, headerBarView, levelData,
        _this = this;

      Game.__super__.constructor.apply(this, arguments);
      $ = window.myJQuery;
      this.gameState = new (require('models/game_state'))();
      this.canvas = $('<canvas id="hh-canvas"></canvas>')[0];
      this.ctx = this.canvas.getContext('2d');
      /*
      PREP PAGE
      */

      if (!localStorage.getItem("hh-level")) {
        localStorage.setItem("hh-level", 1);
        this.gameState.set("level", 1);
      }
      document.addEventListener('keydown', function(e) {
        var _ref;

        if (e.keyCode === 82) {
          window.location.href = window.location.origin + "/play";
          false;
        }
        if ((96 <= (_ref = e.keyCode) && _ref <= 105)) {
          console.log("cheat code - jump to level", e.keyCode - 96);
          _this.gameState.set('level', e.keyCode - 96);
          localStorage.setItem("hh-level", e.keyCode - 96);
        }
        if (e.keyCode === 80) {
          return _this.gameState.set("running", _this.gameState.get("running") ? false : true);
        }
      });
      $('a').click(function(e) {
        console.log("click on link prevented");
        e.preventDefault();
        return false;
      });
      $('*').filter(function() {
        return $(this).css('position') === 'fixed';
      }).css('position', 'absolute');
      window.onmousewheel = document.onmousewheel = function(e) {
        return e.preventDefault();
      };
      window.onkeypress = document.onkeypress = function(e) {
        return e.preventDefault();
      };
      /*
      SET UP GAME HEADER BAR AND STAGE
      */

      headerBarView = new (require('views/header_bar'))({
        model: this.gameState
      });
      $('body').append(headerBarView.el);
      headerBarHeight = $('#hh-header-bar').outerHeight();
      window.onresize = function(e) {
        _this.canvas.width = window.innerWidth;
        return _this.canvas.height = window.innerHeight - headerBarHeight;
      };
      window.onresize();
      $.extend(this.canvas.style, {
        position: 'fixed',
        top: headerBarHeight + 'px',
        left: '0px',
        'z-index': 9999999999
      });
      $('body').append(this.canvas);
      this.stats = new Stats();
      this.stats.setMode(0);
      this.stats.domElement.style.position = 'fixed';
      this.stats.domElement.style['z-index'] = 9999999999;
      this.stats.domElement.style.right = '0px';
      this.stats.domElement.style.top = '0px';
      this.stats.domElement.id = 'hh-stats-wdiget';
      document.body.appendChild(this.stats.domElement);
      this.stats.begin();
      /*
      SET UP BOARD
      */

      levelData = {
        numEnemies: Math.min(this.gameState.get('level') * 5, 50)
      };
      this.director = new (require('./director'))(levelData, this.gameState);
      console.log("We have a game!");
    }

    Game.prototype.update = function(dt) {
      if (!this.gameState.get('running')) {
        return;
      }
      this.stats.update();
      return this.director.update(dt);
    };

    Game.prototype.draw = function() {
      if (!this.gameState.get('running')) {
        return;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.translate(0, -window.scrollY);
      this.director.draw(this.ctx);
      return this.ctx.restore();
    };

    return Game;

  })(window.atom.Game);
  
});
window.require.register("index", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="css/app.css"><title>Hyperlink Harry - a browser based game where the web is the playing field</title></head><body><h1>Hyperlink Harry, a new spin on the browser-based game</h1><h2>Run around on top of random web pages.  Avoid enemies.  Escape through hyperlinks.  Find your way back home.</h2><h3>The story</h3><p>One day while surfing the net, Harry\'s modem had a power surge and sucked Harry into the web.  </p><p>Now Harry\'s digital consciousness is lost somewhere out in hyperspace, bouncing from site to site, evading antivirus bots and seach engine spiders, and looking for his way back home.</p><p>Can you help him?  </p><h3>How to play</h3><p>Use the keyboard arrows to move around.  Collect internal links by running over them.  Once you have enough "linkjuice", external links will "hyperjump" you to a new page.  Pressing \'R\' will take you to a new random page.  \'P\' will pause the game.</p><h3>WARNING: THIS IS IN ACTIVE DEVELOPMENT</h3><P>Which means it is incomplete (in design and functionality) and may have some bugs and may need optimizing.  Simple gameplay should work, but if you get stuck, just hit refresh (as long as you didn\'t somehow end up at a different site in the address bar, if so, press back).</P><p>This project is currently open source.  Check out the code, comment, and fork on <a href="https://github.com/jschomay/httpacman">github.</a></p><a href="/play" style="display:block;width:200px;text-align:center;padding:5px;background:lightgray;border:1px solid black;margin:auto;">PLAY NOW</a><h3>Credits/contact</h3><p>The game concept was concieved by Jeff Schomay, who also did most of the game design and coding.  Others contributed to the coding at verious points.</p><ul><li>Jeff Schomay - <a href="https://github.com/jschomay/">/jschomay</a>- <a href="http://jeffschomay.com/">jeffschomay.com</a></li><li>Steve Manuel - <a href="https://github.com/stevemanuel">/stevemanuel</a></li><li>Kevin Sylvestre - <a href="https://github.com/ksylvest">/ksylvest</a></li></ul><h3>Technology</h3><ul><li>node</li><li>coffeescript</li><li>canvas</li><li>backbone</li><li>sass</li><li>brunch</li></ul></body></html>');
  }
  return buf.join("");
  };
});
window.require.register("main", function(exports, require, module) {
  var Game;

  window.history.pushState('', 'Hyperlink Harry', window.location.origin + '/play');

  Game = require('game');

  window.myJQuery = $;

  $.noConflict();

  window.myBackbone = Backbone.noConflict();

  myJQuery(function() {
    var game;

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
window.require.register("models/game_state", function(exports, require, module) {
  var GameState, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = GameState = (function(_super) {
    __extends(GameState, _super);

    function GameState() {
      _ref = GameState.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GameState.prototype.initialize = function() {
      return this.set({
        running: false,
        level: localStorage.getItem("hh-level"),
        url: window.currentUrl,
        numInternalLinks: "Calculating...",
        numExternalLinks: "Calculating...",
        numLinksNeeded: "Calculating...",
        numCollectedLinks: 0
      });
    };

    return GameState;

  })(myBackbone.Model);
  
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

    HeaderBar.prototype.id = 'hh-header-bar';

    HeaderBar.prototype.template = require('./templates/header_bar');

    HeaderBar.prototype.initialize = function() {
      this.listenTo(this.model, "change", this.render);
      console.log("initiing level ", this.model.get("level"));
      return this.render();
    };

    HeaderBar.prototype.render = function() {
      var displayUrl, html;

      displayUrl = this.model.get('url').replace("www.", "");
      if (displayUrl.split("/")[1]) {
        displayUrl = displayUrl.split('/')[0] + "/...";
      }
      html = this.template(_.extend({}, this.model.attributes, {
        displayUrl: displayUrl
      }));
      return this.$el.html(html);
    };

    return HeaderBar;

  })(myBackbone.View);
  
});
window.require.register("views/templates/header_bar", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="hh-logo" class="hh-section"><h1>Hyperlink Harry</h1></div><div id="level-info" class="hh-section"><h2>level ' + escape((interp = level) == null ? '' : interp) + '</h2><h3> \nSite:&nbsp<a');
  buf.push(attrs({ 'href':('http://' + (url) + ''), 'target':('_blank') }, {"href":true,"target":true}));
  buf.push('>' + escape((interp = displayUrl) == null ? '' : interp) + '</a></h3></div><div class="hh-section"><p>Internal links remaining: ');
  var __val__ = numInternalLinks
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><p>External links: ');
  var __val__ = numExternalLinks
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p></div><div class="hh-section"><p>Links needed to escape: ');
  var __val__ = numLinksNeeded
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p><p>Links collected: ' + escape((interp = numCollectedLinks) == null ? '' : interp) + '</p></div>');
  }
  return buf.join("");
  };
});
