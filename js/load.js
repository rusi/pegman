
// 'use strict';

var loadState = {
	preload: function() {
		// game.add.sprite(0, 0, 'pegman');
		this.loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', {
			font: '30px Arial', fill: '#000000'
		});
		this.loadingLabel.anchor.setTo(0.5, 0.5);

		this.progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
		this.progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(this.progressBar);

		Maze.preload();
		Pegman.preload();
	},

	create: function() {
		// game.add.sprite(0, 0, 'tiles');
		// console.log("load done");
		// game.stage.backgroundColor = "#FFFFFF";
		game.state.start('maze');
	},

	shutdown: function() {
		this.loadingLabel.destroy(true);
		this.progressBar.destroy(true);
	}
};