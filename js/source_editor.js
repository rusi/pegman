'use strict';

var SourceEditor = SourceEditor || {};

SourceEditor.init = function() {
	this.codeEditor = ace.edit("editorPaneA");
	// this.codeEditor.setTheme("ace/theme/monokai");
	// this.codeEditor.setTheme("ace/theme/twilight");
	// this.codeEditor.setTheme("ace/theme/vibrant_ink");
	this.codeEditor.getSession().setMode("ace/mode/javascript");
	// this.codeEditor.setReadOnly(true);

	$('#editorPaneB').addClass('apiPane');
	$('#editorPaneB').append(this.buildHelpBox());
};

SourceEditor.buildHelpBox = function() {
	var helpBox = "<h3>API / Instructions</h3><pre>";
	_.each(Maze.level.editor[Maze.level.blocks], function(block){
		helpBox += block + "\n";
	});
	helpBox += "</pre>";
	return $(helpBox);
}

SourceEditor.highlight = function(id) {

};

SourceEditor.runProgram = function() {
	this.execute();
};

SourceEditor.resetProgram = function() {
};

SourceEditor.getExecutableCode = function() {
	var code = this.codeEditor.getValue();
	var trap = "BlocklyUtils.checkTimeout()";
	return code.replace(new RegExp('true.*\\)', 'g'), 'true && ' + trap + ')');
}

SourceEditor.execute = function() {
	// BlocklyUtils.ticks = 100;
	var code = this.getExecutableCode();
	// console.log(code);
	// var result = ResultType.UNSET;

	// Try running the user's code.  There are four possible outcomes:
	// 1. If pegman reaches the finish [SUCCESS], true is thrown.
	// 2. If the program is terminated due to running too long [TIMEOUT],
	//    false is thrown.
	// 3. If another error occurs [ERROR], that error is thrown.
	// 4. If the program ended normally but without solving the maze [FAILURE],
	//    no error or exception is thrown.
	try {
		eval(code);
		// result = ResultType.FAILURE;
	} catch (e) {
		// A boolean is thrown for normal termination.
		// Abnormal termination is a user error.
		// if (e === Infinity) {
		// 	result = ResultType.TIMEOUT;
		//} else
		if (e === true) {
			// result = ResultType.SUCCESS;
		} else if (e === false) {
			// result = ResultType.ERROR;
		} else {
		// 	// Syntax error, can't happen.
		// 	result = ResultType.ERROR;
		 	window.alert(e);
		}
	}

	Pegman.play();
}