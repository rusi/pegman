
'use strict';

var mazeState = {
	preload: function() {
	},

	create: function() {
		Maze.init();
		Pegman.init(Maze.START);
		$("#caption").text(Maze.level.caption);
		Maze.level.editor.init();
	}
};
