'use strict';

var ResultType = {
	UNSET: 0,
	SUCCESS: 1,
	FAILURE: -1,
	TIMEOUT: 2,
	ERROR: -2
};

var BlocklyUtils = BlocklyUtils || {};

BlocklyUtils.codeEditor = null;

BlocklyUtils.buildToolbox = function() {
	var toolbox = '<xml>';
	//console.log(Maze.level.blocks);
	_.each(Maze.level.editor[Maze.level.blocks], function(block){
		toolbox += ' <block type="' + block.b + '">';
		if (block.f) {
			toolbox += '<field name="' + block.f[0] + '">' + block.f[1] + '</field>';
		}
		toolbox += '</block>';
	});
	toolbox += '</xml>';
	return toolbox;
}

/**
 * If the user has executed too many actions, we're probably in an infinite
 * loop.  Sadly I wasn't able to solve the Halting Problem.
 * @param {?string} opt_id ID of loop block to highlight.
 * @throws {Infinity} Throws an error to terminate the user's program.
 */
BlocklyUtils.checkTimeout = function(opt_id) {
	if (opt_id) {
		Pegman.pegmanActions.push({command:null, blockId:opt_id});
	}
	if (BlocklyUtils.ticks-- < 0) {
		throw Infinity;
	}
	return true;
};

/**
 * Congratulates the user for completing the level and offers to
 * direct them to the next level, if available.
 */
BlocklyUtils.congratulations = function() {
	var content = document.getElementById('dialogDone');
	var buttonDiv = document.getElementById('dialogDoneButtons');
	buttonDiv.textContent = '';
	var style = {
		width: '40%',
		left: '30%',
		top: '5em'
	};

	if (Maze.LEVEL < Maze.MAX_LEVEL) {
		var text = "Congratulations! Are you ready to proceed to level %1?".replace("%1", (Maze.LEVEL + 1));
		var cancel = document.createElement('button');
		cancel.appendChild(document.createTextNode("Cancel"));
		cancel.addEventListener('click', Dialogs.hideDialog, true);
		cancel.addEventListener('touchend', Dialogs.hideDialog, true);
		buttonDiv.appendChild(cancel);

		var ok = document.createElement('button');
		ok.className = 'secondary';
		ok.appendChild(document.createTextNode("OK"));
		ok.addEventListener('click', BlocklyUtils.nextLevel, true);
		ok.addEventListener('touchend', BlocklyUtils.nextLevel, true);
		buttonDiv.appendChild(ok);

		Dialogs.showDialog(content, null, false, true, style, function() {
				document.body.removeEventListener('keydown', BlocklyUtils.congratulationsKeyDown_, true);
			});
		document.body.addEventListener('keydown', BlocklyUtils.congratulationsKeyDown_, true);
	} else {
		var text = "Congratulations! You have solved the final level.";
		var ok = document.createElement('button');
		ok.className = 'secondary';
		ok.addEventListener('click', Dialogs.hideDialog, true);
		ok.addEventListener('touchend', Dialogs.hideDialog, true);
		ok.appendChild(document.createTextNode("OK"));
		buttonDiv.appendChild(ok);
		Dialogs.showDialog(content, null, false, true, style, Dialogs.stopDialogKeyDown);
		Dialogs.startDialogKeyDown();
	}
	document.getElementById('dialogDoneText').textContent = text;
};

/**
 * If the user preses enter, escape, or space, hide the dialog.
 * Enter and space move to the next level, escape does not.
 * @param {!Event} e Keyboard event.
 * @private
 */
BlocklyUtils.congratulationsKeyDown_ = function(e) {
	if (e.keyCode == 13 ||
		e.keyCode == 27 ||
		e.keyCode == 32)
	{
		Dialogs.hideDialog(true);
		e.stopPropagation();
		e.preventDefault();
		if (e.keyCode != 27) {
			BlocklyUtils.nextLevel();
		}
	}
};

/**
 * Go to the next level.
 */
BlocklyUtils.nextLevelURL = function(nextLevel) {
	return window.location.protocol + '//' + window.location.host + window.location.pathname
		+ '?level=' + nextLevel;
}
BlocklyUtils.nextLevel = function() {
	window.location = BlocklyUtils.nextLevelURL(Maze.LEVEL + 1);
};
