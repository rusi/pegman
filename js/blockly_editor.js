'use strict';

var BlocklyEditor = BlocklyEditor || {};

BlocklyEditor.blockIdToLineNumberMap = {};

BlocklyEditor.init = function() {
	Blockly.inject(document.getElementById('blockly'), {
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

	this.codeEditor = ace.edit("editor");
	// this.codeEditor.setTheme("ace/theme/monokai");
	// this.codeEditor.setTheme("ace/theme/twilight");
	// this.codeEditor.setTheme("ace/theme/vibrant_ink");
	this.codeEditor.getSession().setMode("ace/mode/javascript");
	this.codeEditor.setReadOnly(true);

	bindClick('runButton', BlocklyUtils.runProgram);
	bindClick('resetButton', BlocklyUtils.resetProgram);
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
