
// 'use strict';

var mazeState = {
	preload: function() {
		Maze.preload();
		Pegman.preload();
		// game.add.sprite(0, 0, 'tiles');
		// game.add.sprite(0, 0, 'pegman');
	},

	create: function() {
		Maze.init();
		Pegman.init(Maze.START);
	}
};
