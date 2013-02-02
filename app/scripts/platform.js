/*global $ define */

define(function () {
	var Platform = function (rect) {
		this.rect = rect;
		this.rect.right = rect.x + rect.width;

		this.el = $('<div class="platform">');
		this.el.css({
			left:rect.x,
			top:rect.y,
			width:rect.width,
			height:rect.height
		});
		this.vel = { x:0, y:40 };
	};

	Platform.prototype.onFrame = function (delta) {
		this.vel.y += 0.05;
		this.rect.y += this.vel.y * delta;
		this.el.css('top', this.rect.y + 'px');
	};

	// Collision?

	return Platform;
});