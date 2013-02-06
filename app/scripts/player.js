/*global $ define */

define(['controls'], function (controls) {

	var PLAYER_SPEED = 800;
	var JUMP_VELOCITY = 1000;
	var GRAVITY = 2500;
	var COLLISION_EDGE = 40;
	var extraTransform = '';

	var transform = $.fx.cssPrefix + 'transform';

	var Player = function (el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x:0, y:0 };
		this.vel = { x:0, y:0 };
		EDGE_OF_LIFE = game.bottom;
	};

	Player.prototype.onFrame = function (delta) {
		// Player input
		if (controls.keys.right) {
			this.vel.x = PLAYER_SPEED;
		} else if (controls.keys.left) {
			this.vel.x = -PLAYER_SPEED;
		} else {
			this.vel.x = 0;
		}

		JUMP_VELOCITY += 0.02;
		GRAVITY += 0.01;
		// Jump
		if (this.vel.y === 0) {
			this.vel.y = -JUMP_VELOCITY;
		}

		// Gravity
		this.vel.y += GRAVITY * delta;

		// Update state
		var oldY = this.pos.y;
		this.pos.x += this.vel.x * delta;
		this.pos.y += this.vel.y * delta;
		if (this.pos.x < 0) {
			this.pos.x = this.game.viewport.width;
		}
		else if (this.pos.x > this.game.viewport.width) {
			this.pos.x = 0 ;
		}

		// Check collisions
		this.checkPlatforms(oldY);
		this.checkGameover();

		// Update UI.
		this.el.toggleClass('walking', this.vel.x !== 0);
		this.el.toggleClass('jumping', this.vel.y < 0);
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
		var pos = this.pos;
		var vel = this.vel;
		this.game.forEachPlatform(function (p) {
			// Are we crossing Y.
			if (p.rect.y >= oldY && p.rect.y < pos.y) {
				// Is our X within platform width
				if (pos.x + COLLISION_EDGE > p.rect.x && pos.x - COLLISION_EDGE < p.rect.right) {
					// Collision. Let's stop gravity.
					pos.y = p.rect.y;
					vel.y = 0;
				}
			}
		});
	};

	Player.prototype.checkGameover = function () {
		if (this.pos.y-this.game.viewport.y > this.game.window.height() + this.el.height()) {
			this.game.gameover();
		}
	};

	return Player;
});