/*global define, alert, Howl */

define(['player', 'platform'], function (Player, Platform) {
	var transformPrefixes = {
		WebkitTransform: '-webkit-transform',
		MozTransform: '-moz-transform',
		transform: 'transform'
	};
	var transform = transformPrefixes[Modernizr.prefixed('transform')];
	var VIEWPORT_PADDING = 200;
	/**
	 * Main game class.
	 * @param {Element} el DOM element containig the game.
	 * @constructor
	 */
	var Game = function (el, levels) {
		this.el = el;
		this.levels = levels;
		this.currentLevel = this.levels[1];
		this.platformsEl = el.find('.platforms');
		this.window = $(window);
		this.scoreBoard = $('.scoreBoard');
		this.scoreBoard.find('.soundIcon').on('click', this.toggleAudio.bind(this));
		this.scoreBoard.find('.pauseIcon').on('click', this.pause.bind(this));
		this.score = 0;
		this.player = new Player(this.el.find('.player'), this, this.currentLevel.player);
		this.body = $('body').addClass('frozen');
		this.bottom = this.el.height();
		this.lastPlatformPos = { x:0, y:0};
		this.isPlaying = false;
		this.entities = [];
		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
		this.pauseEl = $('.pause');
		this.pauseEl.find('.playButton').on('click', this.unfreezeGame.bind(this));
		this.gameOverEl = $('.gameOver');
		this.gameOverEl.find('.playButton').on('click', this.restart.bind(this));

		this.playAudio = true;

		this.music = new Howl({
			urls:['sounds/main.mp3'],
			loop: true
		});

		this.sound = new Howl({
			urls:['sounds/sheep.mp3']
		});
	};

	/**
	 * Reset all game state for a new game.
	 */
	Game.prototype.reset = function () {
		this.currentLevel = this.levels[1];
		// Reset platforms.
		this.entities = [];
		this.lastPlatformPos.y = 0;
		$('.platforms > *').remove();
		this.viewport = {x: 0, y: 0, width: 1300, height:731};
		this.player.pos = {x:380, y:this.bottom - 200};
		this.updateViewport();
		this.lastPlatformPos.y = this.bottom - 200;
		// ground
		this.addPlatform(new Platform({
			x: 0,
			y: this.lastPlatformPos.y,
			width: this.el.width(),
			height: this.currentLevel.platform.height,
			background: this.currentLevel.platform.background,
			velocity :  { x: 0, y: 0 }
		}, this));
		this.createPlatforms();
	};

	Game.prototype.forEachPlatform = function (fun) {
		for (var i = 0, e; e = this.entities[i]; i++) {
			if (e instanceof Platform) {
				fun(e);
			}
		}
	};

	Game.prototype.createPlatforms = function () {
		for (var i = 1; i < 10; i++) {
			var x = this.getRandom(this.currentLevel.platform.width, this.el.width())-this.currentLevel.platform.width;
			if (this.lastPlatformPos.x > x + this.currentLevel.platform.width + 40) {
				x += this.currentLevel.platform.width + 200;
			}
			else if (this.lastPlatformPos.x < x - this.currentLevel.platform.width) {
				x -= this.currentLevel.platform.width - 200;
			}
			var velX = 0;
			var power = false;
			var background = this.currentLevel.platform.background;
			if (i % this.currentLevel.platform.moveEach == 0) {
				velX = this.currentLevel.platform.velocity.x;
			}
			if (this.currentLevel.platform.power) {
				if (i % this.currentLevel.platform.power.each == 0) {
					background = this.currentLevel.platform.power.background;
					power = true;
				}
			}
			this.lastPlatformPos.x = x;
			this.lastPlatformPos.y -= 160;
			this.addPlatform(new Platform({
				x: this.lastPlatformPos.x,
				y: this.lastPlatformPos.y,
				width: this.currentLevel.platform.width,
				height: this.currentLevel.platform.height,
				background: background,
				velocity :  { x: velX, y: 0 },
				power : power
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

		this.player.onFrame(delta);

		for (var i = 0, e; e = this.entities[i]; i++) {
			e.onFrame(delta);
			if (e.dead) {
				this.entities.splice(i--, 1);
				e.el.remove();
			}
		}
		if (this.entities.length < 10) {
			this.createPlatforms();
		}

		this.updateViewport();
		if (this.score > 2000 && this.score < 2010) {
			this.currentLevel = this.levels[2];
		}
		else if (this.score > 4000 && this.score < 4010) {
			this.currentLevel = this.levels[3];
		}
		else if (this.score > 6000 && this.score < 6010) {
			this.currentLevel = this.levels[4];
		}
		else if (this.score > 8000 && this.score < 8010) {
			this.currentLevel = this.levels[5];
		}
		this.player.updateConfig(this.currentLevel.player);
		this.scoreBoard.find('.score .data').text(this.score);

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
		if(this.playAudio) {
			this.sound.play();
		}
		this.gameOverEl.show();
		var highScore = 0;
		if (Modernizr.localstorage) {
			highScore = localStorage.getItem('sheepjump.highScore') || 0;
			if (this.score > highScore) {
				highScore = this.score;
				localStorage.setItem('sheepjump.highScore', highScore)
			}
		} else {
			highScore = this.score;
		}
		this.gameOverEl.find('.highscore .data').text(highScore);
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
		this.body.addClass('frozen');
		this.music.stop();
	};

	/**
	 * Unfreezes the game. Starts the game loop again.
	 */
	Game.prototype.unfreezeGame = function () {
		if (!this.isPlaying) {
			this.isPlaying = true;
			this.pauseEl.hide();
			this.gameOverEl.hide();
			this.body.removeClass('frozen');
			if (this.playAudio) {
				this.music.play();
			}

			// Restart the onFrame loop
			this.lastFrame = +new Date() / 1000;
			requestAnimFrame(this.onFrame);
		}
	};

	Game.prototype.toggleAudio = function() {
		this.playAudio = (this.playAudio) ? false : true;
		this.scoreBoard.find('.soundIcon').toggleClass('off');
		if (this.playAudio) {
			this.music.play();
		}
		else {
			this.music.stop();
		}
	}

	Game.prototype.updateViewport = function (delta) {
		// Find min and max Y for player in world coordinates.
		var minY = this.viewport.y + VIEWPORT_PADDING;
		var maxY = this.viewport.y + this.viewport.height - VIEWPORT_PADDING;

		// Player position
		var playerY = this.player.pos.y;

		this.viewport.y -= this.currentLevel.viewport.velocity.y;

		//Update the viewport if needed.
		if (playerY < minY) {
			this.viewport.y = playerY - VIEWPORT_PADDING;
		}
		this.el.css(transform, 'translate3d(0, ' + (-this.viewport.y) + 'px, 0)');

		// update scoreboard
		this.score = Math.round(-(this.viewport.y));
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