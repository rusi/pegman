'use strict';

var BlocklyEditor = BlocklyEditor || {};

BlocklyEditor.blockIdToLineNumberMap = {};

BlocklyEditor.init = function() {
	Blockly.inject(document.getElementById('editorPaneA'), {
		path: './blockly/',
		maxBlocks: Maze.level.maxBlocks,
		//toolbox: document.getElementById('toolbox'),
		toolbox: BlocklyUtils.buildToolbox(),
		trashcan: true,
		scrollbars: true,
	});

	Blockly.JavaScript.INFINITE_LOOP_TRAP = 'BlocklyUtils.checkTimeout(%1)';

	// if (document.getElementById('codeButton')) {
	// 	bindClick('codeButton', BlocklyUtils.showCode);
	// };

	Blockly.addChangeListener(function() {
		BlocklyEditor.updateCapacity();
		BlocklyEditor.showCodeInAce();
	});

	// Make connecting blocks easier for beginners.
	Blockly.SNAP_RADIUS *= 2;

	this.codeEditor = ace.edit("editorPaneB");
	// this.codeEditor.setTheme("ace/theme/monokai");
	// this.codeEditor.setTheme("ace/theme/twilight");
	// this.codeEditor.setTheme("ace/theme/vibrant_ink");
	this.codeEditor.getSession().setMode("ace/mode/javascript");
	this.codeEditor.setReadOnly(true);
}

BlocklyEditor.updateCapacity = function() {
	var cap = Blockly.mainWorkspace.remainingCapacity();
	if (cap == Infinity) {
		$("#capacity").css('display','none');
		return;
	}
	cap = Number(cap);
	$("#capacity").text("Remaining " + cap + " blocks. ");
	if (cap == 0 && Maze.level.helpText) {
		$("#capacity").append(Maze.level.helpText.replace("#NEXT_LEVEL", Maze.LEVEL + 1));
	}
}

BlocklyEditor.showCodeInAce = function() {
	if (!this.codeEditor)
		return;
	var code = Blockly.JavaScript.workspaceToCode();
	this.blockIdToLineNumberMap = this.getBlockIdToLineNumberMap(code);
	//console.log(this.blockIdToLineNumberMap);

	code = this.stripCode(code);
	this.codeEditor.setValue(code, 1);
}

/**
 * Convert the user's code to raw JavaScript.
 * @param {string} code Generated code.
 * @return {string} The code without serial numbers and timeout checks.
 */
 BlocklyEditor.stripCode = function(code) {
	// Strip out serial numbers.
	code = code.replace(/(,\s*)?'block_id_\d+'\)/g, ')');
	// Remove timeouts.
	var regex = new RegExp(" && " + Blockly.JavaScript.INFINITE_LOOP_TRAP
		.replace('(%1)', '\\((\'\\d+\')?\\)'), 'g');
	return code.replace(regex, '');
};

/**
 * Show the user's code in raw JavaScript.
 * @param {!Event} e Mouse or touch event.
 */
BlocklyEditor.showCode = function(e) {
	var origin = e.target;
	var code = Blockly.JavaScript.workspaceToCode();
	code = this.stripCode(code);

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
 * Highlight the block (or clear highlighting).
 * @param {?string} id ID of block that triggered this action.
 */
BlocklyEditor.highlight = function(id) {
	if (id) {
		if (this.codeEditor)
			this.codeEditor.gotoLine(this.blockIdToLineNumberMap[id]);
		var m = id.match(/^block_id_(\d+)$/);
		if (m) {
			id = m[1];
		}
	}
	Blockly.mainWorkspace.highlightBlock(id);
};

BlocklyEditor.getBlockIdToLineNumberMap = function(code) {
	var lines = code.match(/^.*((\r\n|\n|\r)|$)/gm);
	var lines = _.map(lines, function(line) {
		var matches = line.match(/(,\s*)?'(block_id_\d+)'\)/);
		if (matches && matches.length >= 3)
			return matches[2];
		return "";
	});
	var vals = {};
	_.each(lines, function(line, n){
		if (line !== "" && line != null)
			vals[line] = n+1;
	});
	return vals;
	//return _.extend({}, lines);
	// return _.map(lines, function(lines, n){
	// 	var o = {}; o[lines] = n;
	// 	return o;
	// });
};

BlocklyEditor.runProgram = function() {
	Blockly.mainWorkspace.traceOn(true);
	this.execute();
};

BlocklyEditor.resetProgram = function() {
	this.highlight(null);
	Blockly.mainWorkspace.traceOn(false);
};

BlocklyEditor.execute = function() {
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

