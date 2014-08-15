'use strict';

var App = App || {};

App.init = function() {
	bindClick('runButton', this.runProgram);
	bindClick('resetButton', this.resetProgram);
};

App.runProgram = function() {
	var runButton = document.getElementById('runButton');
	var resetButton = document.getElementById('resetButton');
	// Ensure that Reset button is at least as wide as Run button.
	if (!resetButton.style.minWidth) {
		resetButton.style.minWidth = runButton.offsetWidth + 'px';
	}
	runButton.style.display = 'none';
	resetButton.style.display = 'inline';
	// Prevent double-clicks or double-taps.
	resetButton.disabled = false;

	Pegman.reset(); // just in case
	BlocklyUtils.ticks = 100;
	Maze.level.editor.runProgram();
};

App.resetProgram = function() {
	var runButton = document.getElementById('runButton');
	runButton.style.display = 'inline';
	document.getElementById('resetButton').style.display = 'none';
	// Prevent double-clicks or double-taps.
	runButton.disabled = false;

	Pegman.reset();
	Maze.level.editor.resetProgram();
}
