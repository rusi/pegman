'use strict';

// Extensions to Blockly's language and JavaScript generator.
var Pegman = Pegman || {}

Blockly.Blocks['pegman_moveForward'] = {
	// Block for moving forward.
	init: function() {
		this.setColour(290);
		this.appendDummyInput().appendField("move forward");
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		// this.setTooltip(BlocklyApps.getMsg('Maze_moveForwardTooltip'));
	}
};
Blockly.JavaScript['pegman_moveForward'] = function(block) {
	// Generate JavaScript for moving forward.
	return 'Pegman.moveForward(\'block_id_' + block.id + '\');\n';
};

Blockly.Blocks['pegman_turn'] = {
	// Block for turning left or right.
	init: function() {
		var DIRECTIONS =
			[["turn left", 'turnLeft'],
			 ["turn right", 'turnRight']];
		// Append arrows to direction messages.
		DIRECTIONS[0][0] += ' \u21BA';
		DIRECTIONS[1][0] += ' \u21BB';
		this.setColour(290);
		this.appendDummyInput().appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		// this.setTooltip(BlocklyApps.getMsg('Maze_turnTooltip'));
	}
};
Blockly.JavaScript['pegman_turn'] = function(block) {
	// Generate JavaScript for turning left or right.
	var dir = block.getFieldValue('DIR');
	return 'Pegman.' + dir + '(\'block_id_' + block.id + '\');\n';
};

Blockly.Blocks['block_forever'] = {
	// Block for forever loop.
	init: function() {
		this.setColour(120);
		this.appendDummyInput()
				.appendField("repeat until")
				.appendField(new Blockly.FieldImage(Maze.SKIN.marker, 12, 16));
		this.appendStatementInput('DO')
				.appendField("do");
		this.setPreviousStatement(true);
		// this.setTooltip(BlocklyApps.getMsg('Maze_whileTooltip'));
	}
};
Blockly.JavaScript['block_forever'] = function(block) {
	// Generate JavaScript for forever loop.
	var branch = Blockly.JavaScript.statementToCode(block, 'DO');
	if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
		branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
				'\'block_id_' + block.id + '\'') + branch;
	}
	return 'while (true) {\n' + branch + '}\n';
};

Blockly.Blocks['block_if'] = {
	// Block for 'if' conditional if there is a path.
	init: function() {
		var DIRECTIONS =
				[["ahead", 'isPathForward'],
				 ["to the left", 'isPathLeft'],
				 ["to the right", 'isPathRight']];
		// Append arrows to direction messages.
		DIRECTIONS[1][0] += ' \u21BA';
		DIRECTIONS[2][0] += ' \u21BB';
		this.setColour(210);
		this.appendDummyInput()
				.appendField("if path")
				.appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
		this.appendStatementInput('DO')
				.appendField("do");
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		// this.setTooltip(BlocklyApps.getMsg('Maze_ifTooltip'));
	}
};
Blockly.JavaScript['block_if'] = function(block) {
	// Generate JavaScript for 'if' conditional if there is a path.
	var argument = 'Pegman.' + block.getFieldValue('DIR') +
			'(\'block_id_' + block.id + '\')';
	var branch = Blockly.JavaScript.statementToCode(block, 'DO');
	var code = 'if (' + argument + ') {\n' + branch + '}\n';
	return code;
};

Blockly.Blocks['block_ifElse'] = {
	// Block for 'if/else' conditional if there is a path.
	init: function() {
		var DIRECTIONS =
				[["ahead", 'isPathForward'],
				 ["to the left", 'isPathLeft'],
				 ["to the right", 'isPathRight']];
		// Append arrows to direction messages.
		DIRECTIONS[1][0] += ' \u21BA';
		DIRECTIONS[2][0] += ' \u21BB';
		this.setColour(210);
		this.appendDummyInput()
				.appendField("if path")
				.appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
		this.appendStatementInput('DO')
				.appendField("do");
		this.appendStatementInput('ELSE')
				.appendField("else");
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		// this.setTooltip(BlocklyApps.getMsg('Maze_ifelseTooltip'));
	}
};
Blockly.JavaScript['block_ifElse'] = function(block) {
	// Generate JavaScript for 'if/else' conditional if there is a path.
	var argument = 'Pegman.' + block.getFieldValue('DIR') +
			'(\'block_id_' + block.id + '\')';
	var branch0 = Blockly.JavaScript.statementToCode(block, 'DO');
	var branch1 = Blockly.JavaScript.statementToCode(block, 'ELSE');
	var code = 'if (' + argument + ') {\n' + branch0 +
						 '} else {\n' + branch1 + '}\n';
	return code;
};

