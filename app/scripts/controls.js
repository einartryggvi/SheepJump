/*global define, $ */

define([], function () {
	var KEYS = {
		32:'space',
		37:'left',
		38:'up',
		39:'right',
		40:'down'
	};

	var touchPrevX = -1;
	/**
	 * Controls singleton class.
	 * @constructor
	 */
	var Controls = function () {
		this.keys = {};

		$(window)
			.on('keydown', this.onKeyDown.bind(this))
			.on('keyup', this.onKeyUp.bind(this))
			.on('touchstart', this.onTouchStart.bind(this))
			.on('touchend', this.onTouchEnd.bind(this))
			.on('touchmove', this.onTouchMove.bind(this));
	};

	Controls.prototype.onKeyDown = function (e) {
		if (e.keyCode in KEYS) {
			this.keys[KEYS[e.keyCode]] = true;
		}
	};

	Controls.prototype.onKeyUp = function (e) {
		if (e.keyCode in KEYS) {
			this.keys[KEYS[e.keyCode]] = false;
		}
	};

	Controls.prototype.onTouchStart = function (e) {
		this.keys[KEYS[32]] = true;
	};

	Controls.prototype.onTouchEnd = function (e) {
		touchPrevX = -1;
		for (var i in KEYS) {
			this.keys[KEYS[i]] = false;
		}
	};

	Controls.prototype.onTouchMove = function (e) {
		e.preventDefault();
		this.keys[KEYS[32]] = false;
		if (touchPrevX === -1) { /* First touch event */
			touchPrevX = e.pageX;
		}
		else if (touchPrevX > e.pageX) { /* Touch going left */
			this.keys[KEYS[37]] = true;
			this.keys[KEYS[39]] = false;
			touchPrevX = e.pageX;
		}
		else if (touchPrevX < e.pageX) { /* Touch going right */
			this.keys[KEYS[39]] = true;
			this.keys[KEYS[37]] = false;
			touchPrevX = e.pageX;
		}
	};
	// Export singleton.
	return new Controls();
});