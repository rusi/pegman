'use strict';

var ResultType = {
	UNSET: 0,
	SUCCESS: 1,
	FAILURE: -1,
	TIMEOUT: 2,
	ERROR: -2
};

var BlocklyUtils = BlocklyUtils || {};

BlocklyUtils.buildToolbox = function() {
	var toolbox = '<xml>';
	//console.log(Maze.level.blocks);
	_.each(Maze.level.blocks, function(block){
		toolbox += ' <block type="' + block.b + '">';
		if (block.f) {
			toolbox += '<field name="' + block.f[0] + '">' + block.f[1] + '</field>';
		}
		toolbox += '</block>';
	});
	toolbox += '</xml>';
	return toolbox;
}

BlocklyUtils.init = function() {
	Blockly.inject(document.getElementById('editor'), {
		path: './blockly/',
		maxBlocks: Maze.level.maxBlocks,
		//toolbox: document.getElementById('toolbox'),
		toolbox: BlocklyUtils.buildToolbox(),
		trashcan: true,
		scrollbars: true,
	});

	Blockly.JavaScript.INFINITE_LOOP_TRAP = '  BlocklyUtils.checkTimeout(%1);\n';

	BlocklyUtils.ticks = 10;

	if (document.getElementById('codeButton')) {
		bindClick('codeButton', BlocklyUtils.showCode);
	};

	Blockly.addChangeListener(function() {
		BlocklyUtils.updateCapacity();
	});

	// Make connecting blocks easier for beginners.
	Blockly.SNAP_RADIUS *= 2;

	bindClick('runButton', BlocklyUtils.runProgram);
	bindClick('resetButton', BlocklyUtils.resetProgram);
}

BlocklyUtils.updateCapacity = function() {
	var cap = Blockly.mainWorkspace.remainingCapacity();
	if (cap == Infinity) {
		$("#capacity").css('display','none');
		return;
	}
	cap = Number(cap);
	$("#capacity").text("Remaining " + cap + " blocks.");
}

/**
 * Highlight the block (or clear highlighting).
 * @param {?string} id ID of block that triggered this action.
 */
BlocklyUtils.highlight = function(id) {
	if (id) {
		var m = id.match(/^block_id_(\d+)$/);
		if (m) {
			id = m[1];
		}
	}
	Blockly.mainWorkspace.highlightBlock(id);
};

/**
 * Convert the user's code to raw JavaScript.
 * @param {string} code Generated code.
 * @return {string} The code without serial numbers and timeout checks.
 */
 BlocklyUtils.stripCode = function(code) {
	// Strip out serial numbers.
	code = code.replace(/(,\s*)?'block_id_\d+'\)/g, ')');
	// Remove timeouts.
	var regex = new RegExp(Blockly.JavaScript.INFINITE_LOOP_TRAP
		.replace('(%1)', '\\((\'\\d+\')?\\)'), 'g');
	return code.replace(regex, '');
};

/**
 * Show the user's code in raw JavaScript.
 * @param {!Event} e Mouse or touch event.
 */
BlocklyUtils.showCode = function(e) {
	var origin = e.target;
	var code = Blockly.JavaScript.workspaceToCode();
	code = BlocklyUtils.stripCode(code);

	var pre = document.getElementById('containerCode');
	pre.textContent = code;
	if (typeof prettyPrintOne == 'function') {
		code = pre.innerHTML;
		code = prettyPrintOne(code, 'js');
		pre.innerHTML = code;
	}

	var content = document.getElementById('dialogCode');
	var style = {
		width: '40%',
		left: '30%',
		top: '5em'
	};

	Dialogs.showDialog(content, origin, true, true, style, Dialogs.stopDialogKeyDown);
	Dialogs.startDialogKeyDown();
};

/**
 * If the user has executed too many actions, we're probably in an infinite
 * loop.  Sadly I wasn't able to solve the Halting Problem.
 * @param {?string} opt_id ID of loop block to highlight.
 * @throws {Infinity} Throws an error to terminate the user's program.
 */
BlocklyUtils.checkTimeout = function(opt_id) {
	if (opt_id) {
		//BlocklyApps.log.push([null, opt_id]);
	}
	if (BlocklyUtils.ticks-- < 0) {
		throw Infinity;
	}
};

BlocklyUtils.runProgram = function() {
	// if (Blockly.mainWorkspace.getTopBlocks().length > 1) {
	// 	return;
	// }

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

	Blockly.mainWorkspace.traceOn(true);
	Pegman.reset(); // just in case
	BlocklyUtils.execute();
};

BlocklyUtils.resetProgram = function() {
	var runButton = document.getElementById('runButton');
	runButton.style.display = 'inline';
	document.getElementById('resetButton').style.display = 'none';
	// Prevent double-clicks or double-taps.
	runButton.disabled = false;

	BlocklyUtils.highlight(null);
	Blockly.mainWorkspace.traceOn(false);

	Pegman.reset();
}

BlocklyUtils.execute = function() {
	Pegman.reset();

	var code = Blockly.JavaScript.workspaceToCode();

	var result = ResultType.UNSET;

	// Try running the user's code.  There are four possible outcomes:
	// 1. If pegman reaches the finish [SUCCESS], true is thrown.
	// 2. If the program is terminated due to running too long [TIMEOUT],
	//    false is thrown.
	// 3. If another error occurs [ERROR], that error is thrown.
	// 4. If the program ended normally but without solving the maze [FAILURE],
	//    no error or exception is thrown.
	try {
		eval(code);
		result = ResultType.FAILURE;
	} catch (e) {
		// A boolean is thrown for normal termination.
		// Abnormal termination is a user error.
		if (e === Infinity) {
			result = ResultType.TIMEOUT;
		} else if (e === true) {
			result = ResultType.SUCCESS;
		} else if (e === false) {
			result = ResultType.ERROR;
		} else {
			// Syntax error, can't happen.
			result = ResultType.ERROR;
			window.alert(e);
		}
	}

	Pegman.play();
}

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
BlocklyUtils.nextLevel = function() {
	window.location = window.location.protocol + '//' + window.location.host + window.location.pathname
		+ '?level=' + (Maze.LEVEL + 1);
};
