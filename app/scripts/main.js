require.config({
	shim:{
		zepto:{
			exports:'$'
		}
	}
});

require(['game'], function (Game) {
	var game = new Game($('.game'));
	game.start();
	$(function () {
		function resizeWindow() {
			var win = $(window);
			$('div.container').css({
				width:win.width() + 40,
				height:win.height()
			});
		}
		resizeWindow();

		$(window).on('resize', function (e) {
			resizeWindow();
		});

		setInterval(function () {
			var el = $('.player');
			el.addClass('closed');
			setTimeout(function () {
				el.removeClass('closed');
			}, 100);
		}, 5000);
	});
});