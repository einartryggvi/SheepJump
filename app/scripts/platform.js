/*global $ define */

define(function () {
	var transform = $.fx.cssPrefix + 'transform';
	var Platform = function (rect, vel, game) {
		this.game = game;
		this.rect = rect;
		this.rect.right = rect.x + rect.width;
		this.dead = false;
		this.vel = vel;

		this.el = $('<div class="platform">');
		this.el.css({
			width:rect.width,
			height:rect.height
		});
		this.el.css(transform, 'translate3d(' + this.rect.x + 'px, ' + this.rect.y + 'px, 0)');
	};

	Platform.prototype.onFrame = function (delta) {
		if (this.rect.y > this.game.viewport.y + this.game.viewport.height) {
			this.dead = true;
			return;
		}
		if (this.vel.x != 0) {
			if (this.rect.x < 0) {
				this.vel.x = -1*(this.vel.x);
			}
			else if (this.rect.right > this.game.viewport.width) {
				this.vel.x = -1*(this.vel.x);
			}
			this.rect.x += this.vel.x * delta;
			this.rect.right += this.vel.x * delta;
			this.el.css(transform, 'translate3d(' + this.rect.x + 'px, ' + this.rect.y + 'px, 0)');
		}
	};
	return Platform;
});