/*global define, alert */

define(['player', 'platform'], function (Player, Platform) {
	var transform = $.fx.cssPrefix + 'transform';
	var VIEWPORT_PADDING = 200;
	/**
	 * Main game class.
	 * @param {Element} el DOM element containig the game.
	 * @constructor
	 */
	var Game = function (el) {
		this.el = el;
		this.platformsEl = el.find('.platforms');
		this.window = $(window);
		this.player = new Player(this.el.find('.player'), this);
		$('body').addClass('frozen');
		this.bottom = this.el.height();
		this.lastPlatformPos = { x:0, y:0};
		this.platformSize = { w:250, h:15, x:0, y:this.bottom}
		this.isPlaying = false;
		this.entities = [];
		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
		this.pauseEl = $('.pause');
		this.pauseEl.find('.playButton').on('click', this.unfreezeGame.bind(this));
		this.gameOverEl = $('.gameOver');
		this.gameOverEl.find('.playButton').on('click', this.restart.bind(this));
	};

	Game.prototype.onPlayClick = function (e) {
		e.preventDefault();
		this.unfreezeGame();
	}

	/**
	 * Reset all game state for a new game.
	 */
	Game.prototype.reset = function () {
		// Reset platforms.
		this.entities = [];
		this.lastPlatformPos.y = 0;
		$('.platforms > *').remove();
		this.viewport = {x: 0, y: 0, width: 1300, height:731};
		this.createPlatforms();
		this.player.pos = {x:380, y:this.bottom - this.bottom * 0.1};
	};

	Game.prototype.forEachPlatform = function (fun) {
		for (var i = 0, e; e = this.entities[i]; i++) {
			if (e instanceof Platform) {
				fun(e);
			}
		}
	};

	Game.prototype.createPlatforms = function () {
		this.lastPlatformPos.y = this.bottom - this.bottom * 0.1;
		// ground
		this.addPlatform(new Platform({
			x:0,
			y:this.lastPlatformPos.y,
			width:this.el.width(),
			height:this.platformSize.h
		}, this));
		for (var i = 1; i < 100; i++) {
			var x = this.getRandom(this.platformSize.w, this.el.width())-this.platformSize.w;
			if (this.lastPlatformPos.x > x + this.platformSize.w ) {
				x += this.platformSize.w + 200;
			}
			else if (this.lastPlatformPos.x < x - this.platformSize.w) {
				x -= this.platformSize.w - 200;
			}
			this.lastPlatformPos.x = x;
			this.lastPlatformPos.y -= 160;
			this.addPlatform(new Platform({
				x:this.lastPlatformPos.x,
				y:this.lastPlatformPos.y,
				width:this.platformSize.w,
				height:this.platformSize.h
			}, this));
		}

	};

	Game.prototype.addPlatform = function (platform) {
		this.entities.push(platform);
		this.platformsEl.append(platform.el);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game entity to update itself.
	 */
	Game.prototype.onFrame = function () {
		if (!this.isPlaying) {
			return;
		}

		var now = +new Date() / 1000,
			delta = now - this.lastFrame;
		this.lastFrame = now;

		if (delta > 1) {
			this.pause();
			return;
		}
		$('.score').text('20000');
		this.player.onFrame(delta);
		for (var i = 0, p; p = this.entities[i]; i++) {
			p.onFrame(delta);
		}

		for (var i = 0, e; e = this.entities[i]; i++) {
			e.onFrame(delta);
			if (e.dead) {
				this.entities.splice(i--, 1);
			}
		}

		this.updateViewport();

		// Request next frame.
		requestAnimFrame(this.onFrame);
	};

	/**
	 * Starts the game.
	 */
	Game.prototype.start = function () {
		this.isPlaying = false;
		this.reset();
	};

	Game.prototype.restart = function () {
		this.gameOverEl.hide();
		this.pauseEl.hide();
		this.reset();
		this.unfreezeGame();
	};

	/**
	 * Stop the game and notify user that he has lost.
	 */
	Game.prototype.gameover = function () {
		this.gameOverEl.show();
		this.freezeGame();
	};

	Game.prototype.pause = function () {
		this.pauseEl.show();
		this.freezeGame();
	};

	/**
	 * Freezes the game. Stops the onFrame loop and stops any CSS3 animations.
	 * Can be used both for game over and pause.
	 */
	Game.prototype.freezeGame = function () {
		this.isPlaying = false;
		$('body').addClass('frozen');
	};

	/**
	 * Unfreezes the game. Starts the game loop again.
	 */
	Game.prototype.unfreezeGame = function () {
		if (!this.isPlaying) {
			this.isPlaying = true;
			this.pauseEl.hide();
			this.gameOverEl.hide();
			$('body').removeClass('frozen');

			// Restart the onFrame loop
			this.lastFrame = +new Date() / 1000;
			requestAnimFrame(this.onFrame);
		}
	};

	Game.prototype.updateViewport = function () {
		// Find min and max Y for player in world coordinates.
		var minY = this.viewport.y + VIEWPORT_PADDING;

		// Player position
		var playerY = this.player.pos.y;

		//Update the viewport if needed.
		if (playerY < minY) {
			this.viewport.y = playerY - VIEWPORT_PADDING;
		}
		this.el.css(transform, 'translate(0, ' + (-this.viewport.y) + 'px)');
	};

	Game.prototype.getRandom = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	/**
	 * Cross browser RequestAnimationFrame
	 */
	var requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (/* function */ callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	return Game;
});