
'use strict';

var bootState = {
	preload: function() {
		game.load.image('progressBar', './assets/progressBarBlack.png');
	},

	create: function() {
		// game.stage.backgroundColor = '#ffffff';
		// game.physics.startSystem(Phaser.Physics.ARCADE);

		game.state.start('load');
	},
};
