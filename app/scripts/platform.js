/*global $ define */

define(function () {
	var transform = $.fx.cssPrefix + 'transform';
	var Platform = function (config, game) {
		this.game = game;
		this.config = config;
		this.config.right = this.config.x + this.config.width;
		this.dead = false;

		this.el = $('<div class="platform">');
		this.el.css({
			width : this.config.width,
			height : this.config.height,
			'background-color' : this.config.background
		});
		this.el.css(transform, 'translate3d(' + this.config.x + 'px, ' + this.config.y + 'px, 0)');
	};

	Platform.prototype.onFrame = function (delta) {
		if (this.config.y > this.game.viewport.y + this.game.viewport.height) {
			this.dead = true;
			return;
		}
		if (this.config.velocity.x != 0) {
			if (this.config.x < 0) {
				this.config.velocity.x = -1*(this.config.velocity.x);
			}
			else if (this.config.right > this.game.viewport.width) {
				this.config.velocity.x = -1*(this.config.velocity.x);
			}
			this.config.x += this.config.velocity.x * delta;
			this.config.right += this.config.velocity.x * delta;
			this.el.css(transform, 'translate3d(' + this.config.x + 'px, ' + this.config.y + 'px, 0)');
		}
	};

	Platform.prototype.updateConfig = function(config) {
		this.el.css({
			width : config.platform.width,
			height : config.platform.height,
			'background-color' : config.platform.background
		});
	};

	return Platform;
});