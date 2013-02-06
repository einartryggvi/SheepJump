/*global $ define */

define(function () {
	var transform = $.fx.cssPrefix + 'transform';
	var Platform = function (rect, game) {
		this.game = game;
		this.rect = rect;
		this.rect.right = rect.x + rect.width;
		this.dead = false;

		this.el = $('<div class="platform">');
		this.el.css({
			top: rect.y,
			left: rect.x,
			width:rect.width,
			height:rect.height
		});
		this.vel = { x:0, y:20 };
	};

	Platform.prototype.onFrame = function (delta) {
		if (this.rect.y > this.game.viewport.y + this.game.viewport.height) {
			this.dead = true;
		}
	};

	// Collision?

	return Platform;
});