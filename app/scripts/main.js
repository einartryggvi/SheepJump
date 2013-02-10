require.config({
	shim:{
		zepto:{
			exports:'$'
		}
	}
});

require(['game'], function (Game) {
	var levels = {
		1 : {
			player : {
				speed : 800,
				jump : 1000,
				gravity : 2500
			},
			platform : {
				width : 300,
				height : 15,
				moveEach : 8,
				velocity : { x: -100, y : 0 },
				background : '#76481e',
				power : {
					each: 9,
					background: 'white'
				}
			},
			viewport : {
				velocity : { x : 0, y : 1 }
			}
		},
		2 : {
			player : {
				speed : 800,
				jump : 1100,
				gravity : 2500
			},
			platform : {
				width : 280,
				height : 15,
				moveEach : 6,
				velocity : { x: -200, y : 0 },
				background : 'blue',
				power : {
					each: 8,
					background: 'white'
				}
			},
			viewport : {
				velocity : { x : 0, y : 2 }
			}
		},
		3 : {
			player : {
				speed : 800,
				jump : 1200,
				gravity : 2500
			},
			platform : {
				width : 250,
				height : 15,
				moveEach : 4,
				velocity : { x: -300, y : 0 },
				background : 'red',
				power : {
					each: 5,
					background: 'white'
				}
			},
			viewport : {
				velocity : { x : 0, y : 2.5 }
			}
		},
		4 : {
			player : {
				speed : 800,
				jump : 1300,
				gravity : 2500
			},
			platform : {
				width : 220,
				height : 15,
				moveEach : 6,
				velocity : { x: -400, y : 0 },
				background : 'green',
				power : {
					each: 2,
					background: 'white'
				}
			},
			viewport : {
				velocity : { x : 0, y : 3 }
			}
		},
		5 : {
			player : {
				speed : 800,
				jump : 1400,
				gravity : 2500
			},
			platform : {
				width : 190,
				height : 15,
				moveEach : 1,
				velocity : { x: -500, y : 0 },
				background : 'black',
				power : {
					each: 9,
					background: 'white'
				}
			},
			viewport : {
				velocity : { x : 0, y : 3.5 }
			}
		}
	}
	var game = new Game($('.game'), levels);
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