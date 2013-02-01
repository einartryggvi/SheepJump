/*global define, alert */

define(['player', 'platform'], function (Player, Platform) {
	/**
	 * Main game class.
	 * @param {Element} el DOM element containig the game.
	 * @constructor
	 */
	var Game = function (el) {
		this.el = el;
		this.platformsEl = el.find('.platforms');
		this.window =  $(window);
		this.player = new Player(this.el.find('.player'), this);
		this.platformSize = { w: this.window.width() * 0.2, h: this.window.height() * 0.02}
		this.bottom = this.window.height();
		console.log(this.bottom);
		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Reset all game state for a new game.
	 */
	Game.prototype.reset = function () {
		// Reset platforms.
		this.platforms = [];
		this.createPlatforms();

		this.player.pos = {x: 380, y: this.bottom-this.bottom*0.1};

		// Start game
		this.unfreezeGame();
	};

	Game.prototype.createPlatforms = function () {
		// ground
		this.addPlatform(new Platform({
			x: 0,
			y: this.bottom-this.bottom*0.1,
			width: $(window).width(),
			height: this.platformSize.h
		}));
		this.addPlatform(new Platform({
			x: 100,
			y: this.bottom - 200,
			width: this.platformSize.w,
			height: this.platformSize.h
		}));
		this.addPlatform(new Platform({
			x: 250,
			y: this.bottom - 380,
			width: this.platformSize.w,
			height: this.platformSize.h
		}));
		this.addPlatform(new Platform({
			x: 500,
			y: this.bottom - 300,
			width: this.platformSize.w,
			height: this.platformSize.h
		}));
		this.addPlatform(new Platform({
			x: 700,
			y: this.bottom - 550,
			width: this.platformSize.w,
			height: this.platformSize.h
		}));
	};

	Game.prototype.addPlatform = function (platform) {
		this.platforms.push(platform);
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

		this.player.onFrame(delta);

		// Request next frame.
		requestAnimFrame(this.onFrame);
	};

	/**
	 * Starts the game.
	 */
	Game.prototype.start = function () {
		this.reset();
	};

	/**
	 * Stop the game and notify user that he has lost.
	 */
	Game.prototype.gameover = function () {
		alert('You are game over!');
		this.freezeGame();

		var game = this;
		setTimeout(function () {
			game.reset();
		}, 0);
	};

	/**
	 * Freezes the game. Stops the onFrame loop and stops any CSS3 animations.
	 * Can be used both for game over and pause.
	 */
	Game.prototype.freezeGame = function () {
		this.isPlaying = false;
		this.el.addClass('frozen');
	};

	/**
	 * Unfreezes the game. Starts the game loop again.
	 */
	Game.prototype.unfreezeGame = function () {
		if (!this.isPlaying) {
			this.isPlaying = true;
			this.el.removeClass('frozen');

			// Restart the onFrame loop
			this.lastFrame = +new Date() / 1000;
			requestAnimFrame(this.onFrame);
		}
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