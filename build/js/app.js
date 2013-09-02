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
      var $, numEnemies, player, require, _i,
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
      player = this.addEntity(new Entities.Player({
        id: this.lastId
      }));
      if (this.gameState.get('gameOptions').specialLevel !== 'virus') {
        numEnemies = levelData.numEnemies || 0;
        console.log("Putting " + numEnemies + " enemies on screen");
        for (_i = 1; 1 <= numEnemies ? _i <= numEnemies : _i >= numEnemies; 1 <= numEnemies ? _i++ : _i--) {
          this.addEntity(new Entities.Enemy({
            id: this.lastId,
            player: player
          }));
        }
      }
      $(window).load(function() {
        return setTimeout((function() {
          var delay;

          delay = document.height > 7000 ? 1700 : 300;
          return setTimeout((function() {
            var headerBarEl, headerBarHeight, internalLinks, manualLink, numLinks, offset, randomIndex, that;

            console.log("Converting hyperlinks to game entities");
            internalLinks = [];
            that = _this;
            numLinks = 0;
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
              var $this, child, domain, domainRegex, headerBarHeight, link, offset;

              $(this).trigger('mouseover')[0].href;
              link = this.href;
              domain = that.gameState.get('url').split('/')[0];
              domainRegex = new RegExp(domain, 'i');
              if (domainRegex.test(link || link === window.location.origin)) {
                internalLinks.push(this.href);
              }
              numLinks++;
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
                href: this.href
              }));
            });
            if (numLinks === 0) {
              manualLink = $('<a href="' + _this.gameState.get('gameOptions').lastUrl + '">Escape here!</a>').appendTo('body').css({
                'position': 'absolute',
                'top': Math.floor(Math.random() * (window.document.height - 150)) + 100 + 'px',
                'left': Math.floor(Math.random() * (window.document.width - 400)) + 200 + 'px',
                'z-index': 99999999
              });
              offset = manualLink.offset();
              headerBarHeight = $('#hh-header-bar').outerHeight();
              _this.addEntity(new Entities.Hyperlink({
                id: _this.lastId,
                w: manualLink.width(),
                h: manualLink.height(),
                y: offset.top - headerBarHeight,
                x: offset.left,
                $el: manualLink,
                href: manualLink[0].href
              }));
              numLinks++;
              internalLinks.push(manualLink[0].href);
              console.log(manualLink[0].href);
            }
            _this.gameState.set("numLinks", numLinks);
            _this.gameState.set("numLinksNeeded", Math.ceil(numLinks * (Math.min(_this.gameState.get('level', 10))) / 20));
            randomIndex = Math.ceil(Math.random() * internalLinks.length) - 1;
            _this.gameState.set('purgatoryLink', internalLinks[randomIndex]);
            $('script, iframe').add('div').filter(function() {
              var adIdentifiers;

              adIdentifiers = [this.src, this["class"], this.id, this.name].join('  ');
              return adIdentifiers.match(/[\s\._-]ads?[\s\._A-Z-]|doubleclick/);
            }).map(function() {
              if (this.nodeName.match(/script|iframe/i)) {
                return $(this).parent('div')[0];
              } else {
                return this;
              }
            }).each(function() {
              var $this;

              $this = $(this);
              offset = $this.offset();
              headerBarHeight = $('#hh-header-bar').outerHeight();
              return that.addEntity(new Entities.Ad({
                id: that.lastId,
                w: $this.width(),
                h: $this.height(),
                y: offset.top - headerBarHeight,
                x: offset.left,
                $el: $this
              }));
            });
            return _this.gameState.set('running', true);
          }), delay);
        }), 400);
      });
    }

    Director.prototype.lastId = 1;

    Director.prototype.entities = {};

    Director.prototype.addEntity = function(entity) {
      this.entities[entity.id] = entity;
      this.lastId++;
      return entity;
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

    Director.prototype.hyperjump = function() {
      if ((this.gameState.get("numCollectedLinks")) >= (this.gameState.get("numLinksNeeded"))) {
        if (this.gameState.get('gameOptions').specialLevel === 'virus') {
          return this.nextLevel('', true);
        } else {
          return this.nextLevel();
        }
      } else {
        if (!this.gameState.get('purgatoryLink')) {
          return;
        }
        this.gameState.set('running', false);
        if (confirm("You don't have enough linkjuice to escape this domain.  You can try to collect more links, or you can hyperjump within this current domain right now (without leveling up).  Do you want to do that?")) {
          myJQuery(document).off('keydown');
          return this.nextLevel(this.gameState.get('purgatoryLink'), true);
        } else {
          return this.gameState.set('running', true);
        }
      }
    };

    Director.prototype.nextLevel = function(url, noLevelUp, params) {
      var explodePage, jump, level,
        _this = this;

      if (noLevelUp == null) {
        noLevelUp = false;
      }
      if (params == null) {
        params = {};
      }
      if (!noLevelUp) {
        level = localStorage.getItem('hh-level');
        level++;
        localStorage.setItem("hh-level", level);
        if (level === 5) {
          url = "https://www.facebook.com/FunnyPikz";
        }
        if (level === 10) {
          url = "http://hyperlinkharrypoc-jschomay.rhcloud.com";
        }
        if (level === 15) {
          url = "https://github.com/jschomay/httpacman";
        }
      }
      this.gameState.set('running', false);
      explodePage = function() {
        var A, c, elems, i, keepOnPage, l, move, timer, x;

        keepOnPage = myJQuery("#hh-header-bar, #hh-canvas, #hh-stats-widget");
        keepOnPage.remove();
        elems = myJQuery("body *");
        myJQuery("body").append(keepOnPage);
        l = elems.length;
        i = void 0;
        c = void 0;
        move = void 0;
        x = 1;
        A = function() {
          i = 0;
          while (i - l) {
            c = elems[i].style;
            move = elems[i].move;
            if (!move) {
              move = Math.random() * 8 * (Math.round(Math.random()) ? 1 : -1);
            }
            move *= x;
            elems[i].move = move;
            c["-webkit-transform"] = "translateX(" + move + "px)";
            i++;
          }
          return x++;
        };
        timer = setInterval(function() {
          return A();
        }, 60);
        return setTimeout((function() {
          clearInterval(timer);
          return jump(url, params);
        }), 2000);
      };
      explodePage();
      return jump = function(url, params) {
        var nextLevelUrl, param, value;

        if (url == null) {
          url = '';
        }
        nextLevelUrl = window.location.origin + "/play?hhNextLevelUrl=" + url + "&hhCurrentUrl=" + _this.gameState.get('gameOptions').currentUrl;
        for (param in params) {
          value = params[param];
          nextLevelUrl += '&' + param + '=' + value;
        }
        return window.location.href = nextLevelUrl;
      };
    };

    return Director;

  })();
  
});
window.require.register("entities/ad", function(exports, require, module) {
  var Ad, Components, Entity,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Components = require('./components');

  Entity = require('./entity');

  module.exports = Ad = (function(_super) {
    __extends(Ad, _super);

    Components.mixin(Ad, 'Sprite');

    function Ad(options) {
      this.initializeSprite({
        type: "ad",
        id: options.id,
        w: options.w,
        h: options.h,
        x: options.x,
        y: options.y,
        background: 'magenta'
      });
      this.$el = options.$el;
      Ad.__super__.constructor.apply(this, arguments);
    }

    Ad.prototype.draw = function(ctx) {};

    return Ad;

  })(Entity);
  
});
window.require.register("entities/components/collidable", function(exports, require, module) {
  module.exports = {
    _init: function() {
      this._onHit = function(obstacle, side) {
        var _ref;

        return (_ref = this.onHit[obstacle.type]) != null ? _ref.call(this, obstacle, side) : void 0;
      };
      return this.on('enterFrame', function() {
        var id, obstacle, obstacleBottom, obstacleLeft, obstacleRight, obstacleTop, potentialObstacles, sideOfHit, thisBottom, thisLeft, thisRight, thisTop, _results,
          _this = this;

        sideOfHit = function() {
          var sideDeltas, sideHit;

          sideDeltas = my_.map([
            {
              delta: obstacleTop - thisBottom,
              side: 'bottom'
            }, {
              delta: obstacleRight - thisLeft,
              side: 'left'
            }, {
              delta: obstacleBottom - thisTop,
              side: 'top'
            }, {
              delta: obstacleLeft - thisRight,
              side: 'right'
            }
          ], function(item) {
            return {
              delta: Math.abs(item.delta),
              side: item.side
            };
          });
          return sideHit = (my_.reduce(sideDeltas, function(lowestItem, item) {
            if (lowestItem) {
              if (lowestItem.delta < item.delta) {
                return lowestItem;
              } else {
                return item;
              }
            } else {
              return item;
            }
          }, null)).side;
        };
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
              _results.push(this._onHit(obstacle, sideOfHit()));
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
      }, this.player = options.player);
      this.speed = 100;
      this.dx = 0;
      this.dy = 0;
      this.onHit = {
        'hyperlink': this.onHitHyperlink,
        'enemy': this.onHitEnemy,
        'ad': this.onHitAd
      };
      Enemy.__super__.constructor.apply(this, arguments);
    }

    Enemy.prototype.update = function(dt) {
      var tl, tx, ty;

      if (Math.floor(Math.random() * 5)) {
        tx = this.player.position.x - this.position.x;
        ty = this.player.position.y - this.position.y;
        tl = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
        this.dx = tx / tl;
        this.dy = ty / tl;
      }
      this.position.x += this.speed * this.dx * dt;
      this.position.y += this.speed * this.dy * dt;
      this.speed = 100;
      return Enemy.__super__.update.apply(this, arguments);
    };

    Enemy.prototype.onHitHyperlink = function(obstacle, side) {
      var dtApproximation;

      dtApproximation = 0.016;
      if (side === 'top') {
        this.position.y += this.speed * this.dy * dtApproximation;
      }
      if (side === 'bottom') {
        this.position.y -= this.speed * this.dy * dtApproximation;
      }
      if (side === 'left') {
        this.position.x -= this.speed * this.dx * dtApproximation;
      }
      if (side === 'right') {
        this.position.y += this.speed * this.dx * dtApproximation;
      }
      return false;
    };

    Enemy.prototype.onHitEnemy = function(obstacle) {
      return false;
    };

    Enemy.prototype.onHitAd = function(obstacle) {
      return this.speed *= .5;
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
      this.href = options.href;
      Hyperlink.__super__.constructor.apply(this, arguments);
    }

    Hyperlink.prototype.draw = function(ctx) {
      return ctx.strokeStyle = 'green';
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
    Hyperlink: require('./hyperlink'),
    Ad: require('./ad')
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
      this.acceleration = 50;
      this.maxSpeed = 500;
      this.vx = 0;
      this.vy = 0;
      this.drag = .8;
      atom.input.bind(atom.key.LEFT_ARROW, 'left');
      atom.input.bind(atom.key.RIGHT_ARROW, 'right');
      atom.input.bind(atom.key.DOWN_ARROW, 'down');
      atom.input.bind(atom.key.UP_ARROW, 'up');
      this.onHit = {
        'hyperlink': this.onHitHyperlink,
        'enemy': this.onHitEnemy,
        'ad': this.onHitAd
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
      this.director.gameState.set('numCollectedLinks', this.director.gameState.get('numCollectedLinks') + 1);
      return obstacle.destroy();
    };

    Player.prototype.onHitEnemy = function(obstacle) {
      return this.director.nextLevel('', true, {
        hhVirus: true
      });
    };

    Player.prototype.onHitAd = function(obstacle) {
      this.vx *= .5;
      return this.vy *= .5;
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
      myJQuery(document).on('keydown', function(e) {
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
          _this.gameState.set("running", _this.gameState.get("running") ? false : true);
        }
        if (e.keyCode === 32) {
          return _this.director.hyperjump();
        }
      });
      window.cheat = function(level) {
        _this.gameState.set('level', level);
        return localStorage.setItem("hh-level", level);
      };
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
      if (dt > 1) {
        dt = 0;
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
  buf.push('<!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="css/app.css"><title>Hyperlink Harry - a browser based game where the web is the playing field</title></head><body id="hh-home"><header><div id="logo"><div id="headline"><h1>&lt;Hyperlink&gt;&lt;/Harry&gt;</h1><h2>A HTML5 game set across the landscape of the web</h2></div></div><section id="about"><div id="harry"></div><p>One day while surfing the net, Harry\'s modem had a power surge and he got sucked into the web.  </p><p>Now Harry\'s digital consciousness is lost somewhere out in hyperspace, bouncing from site to site, evading antivirus bots and seach engine spiders, and looking for his way back home.</p><p>Can you help him?  </p><div id="baddies" style="text-align:center;"><div id="bot"></div><div id="spider"></div></div><h3>How to play</h3><p>Use the keyboard arrows to move around.  Collect links to fill up your hyperlink bar.  Once you have enough "linkjuice", press \'space\' to "hyperjump" to a new level.  \'P\' will pause the game.</p><a id="play" href="/play">PLAY NOW</a><p><b>Please note: This game is in active development! </b>It is fully playable, but lacks many features, may have bugs, and uses stand in art.  If you get stuck, try refreshing for a new level.</p></section></header><section id="bottom"><section id="technology"><h3>Technology</h3><p>Built with:</p><ul><li>node.js</li><li>coffeescript</li><li>jade</li><li>sass</li><li>html5 canvas</li><li>custom game engine based on atom and crafty</li><li>brunch</li></ul><p>This project is currently open source.  View the source, comment, and fork on <a href="https://github.com/jschomay/httpacman">Github.</a></p></section><section id="contact"><h3>Credits/contact</h3><p>Game concept, game design, and principle coding by Jeff Schomay.  A few others contributed to the coding at verious points.</p><ul><li>Jeff Schomay<br><a href="https://github.com/jschomay/">On Github</a> / <a href="http://jeffschomay.com/">jeffschomay.com</a></li><li>Steve Manuel (helped with backend)<br><a href="https://github.com/stevemanuel">On Github</a></li><li>Kevin Sylvestre (helped with component system)<br><a href="https://github.com/ksylvest">On Github</a></li></ul></section></section></body></html>');
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

  window.my_ = window._;

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
      var gameOptions;

      gameOptions = JSON.parse(window.hhGameOptions);
      this.set({
        running: false,
        level: localStorage.getItem("hh-level"),
        gameOptions: gameOptions,
        url: gameOptions.currentUrl,
        numLinks: "Calculating...",
        numLinksNeeded: "Calculating...",
        numCollectedLinks: 0
      });
      return console.log(this.attributes.gameOptions);
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
      var collected, displayUrl, goal, html, progress;

      displayUrl = this.model.get('url').replace(/https?:\/\/(www\.)?/, '');
      if (displayUrl.split("/")[1]) {
        displayUrl = displayUrl.split('/')[0] + "/...";
      }
      html = this.template(my_.extend({}, this.model.attributes, {
        displayUrl: displayUrl
      }));
      this.$el.html(html);
      goal = this.model.get('numLinksNeeded') / this.model.get('numLinks') * 100;
      this.$('#hh-goal').css({
        left: goal + '%',
        display: 'inline-block'
      });
      collected = this.model.get('numCollectedLinks');
      this.$('#hh-collected').css({
        display: 'inline-block'
      });
      progress = this.model.get('numCollectedLinks') / this.model.get('numLinks') * 100;
      this.$('#hh-progress').css({
        width: progress + '%',
        display: 'inline-block'
      });
      if ((this.model.get("numCollectedLinks")) >= (this.model.get("numLinksNeeded"))) {
        return myJQuery('#hh-meter-full').addClass('show');
      } else {
        return myJQuery('#hh-meter-full').removeClass('show');
      }
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
  buf.push('<div id="hh-logo" class="hh-section"><h1>&lt;Hyperlink&gt;&lt;/Harry&gt;</h1></div><div id="hh-level-info" class="hh-section"><h2>level ' + escape((interp = level) == null ? '' : interp) + '</h2><h3> \nSite:&nbsp<a');
  buf.push(attrs({ 'href':('http://' + (url) + ''), 'target':('_blank') }, {"href":true,"target":true}));
  buf.push('>' + escape((interp = displayUrl) == null ? '' : interp) + '</a></h3></div><div class="hh-section"><div id="hh-progress-bar-container" class="hh-bar"><div id="hh-progress" class="hh-bar"></div><div id="hh-collected">' + escape((interp = numCollectedLinks) == null ? '' : interp) + '</div><div id="hh-goal" class="hh-bar"></div></div></div><div class="hh-section"><p>Total links on page: ');
  var __val__ = numLinks
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('<br/>Links needed to escape: ');
  var __val__ = numLinksNeeded
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</p></div><div class="hh-section"><p id="hh-meter-full">Ready to hyperjump! <br/>(Press \'space\')</p></div>');
  }
  return buf.join("");
  };
});
