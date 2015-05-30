/*global $ define Modernizr */

define(['controls'], function (controls) {
	var COLLISION_EDGE = 40;
	var extraTransform = '';

	var transformPrefixes = {
		WebkitTransform: '-webkit-transform',
		MozTransform: '-moz-transform',
		transform: 'transform'
	};
	var transform = transformPrefixes[Modernizr.prefixed('transform')];

	var Player = function (el, game, config) {
		this.el = el;
		this.game = game;
		this.pos = { x:0, y:0 };
		this.vel = { x:0, y:0 };
		this.PLAYER_SPEED = config.speed;
		this.JUMP_VELOCITY = config.jump;
		this.GRAVITY = config.gravity
	};

	Player.prototype.onFrame = function (delta) {
		// Player input
		if (controls.keys.right) {
			this.vel.x = this.PLAYER_SPEED;
		}
		else if (controls.keys.left) {
			this.vel.x = -this.PLAYER_SPEED;
		}
		else {
			this.vel.x = 0;
		}

		// Jump
		if (this.vel.y === 0) {
			this.vel.y = -this.JUMP_VELOCITY;
		}

		// Gravity
		this.vel.y += this.GRAVITY * delta;

		// Update state
		var oldY = this.pos.y;
		this.pos.x += this.vel.x * delta;
		this.pos.y += this.vel.y * delta;
		if (this.pos.x < 0) {
			this.pos.x = this.game.viewport.width;
		}
		else if (this.pos.x > this.game.viewport.width) {
			this.pos.x = 0;
		}

		// Check collisions
		this.checkPlatforms(oldY);
		this.checkGameover();

		// Update UI.
		if (this.vel.x > 0) {
			this.el.addClass('right');
			extraTransform = 'scaleX(-1)';
		}
		else if (this.vel.x < 0) {
			this.el.removeClass('right');
			extraTransform = 'scaleX(1)';
		}

		this.el.css(transform, 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px, 0) ' + extraTransform);
	};

	Player.prototype.checkPlatforms = function (oldY) {
		var self = this;
		var pos = this.pos;
		var vel = this.vel;
		this.game.forEachPlatform(function (p) {
			// Are we crossing Y.
			if (p.config.y >= oldY && p.config.y < pos.y) {
				// Is our X within platform width
				if (pos.x + COLLISION_EDGE > p.config.x && pos.x - COLLISION_EDGE < p.config.right) {
					// Collision. Let's stop gravity.
					pos.y = p.config.y;
					if (p.config.power) {
						vel.y = -1800;
					}
					else {
						vel.y = 0;
					}
				}
			}
		});
	};

	Player.prototype.checkGameover = function () {
		if (this.pos.y-this.game.viewport.y > this.game.window.height() + this.el.height()) {
			this.game.gameover();
		}
	};

	Player.prototype.updateConfig = function(config) {
		this.PLAYER_SPEED = config.speed;
		this.JUMP_VELOCITY = config.jump;
		this.GRAVITY = config.gravity;
	};

	return Player;
});