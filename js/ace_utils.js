'use strict';

var AceUtils = AceUtils || {};

AceUtils.editor = null;

AceUtils.init = function() {
	this.editor = ace.edit("editor");
	// this.editor.setTheme("ace/theme/monokai");
	// this.editor.setTheme("ace/theme/twilight");
	// this.editor.setTheme("ace/theme/vibrant_ink");
	this.editor.getSession().setMode("ace/mode/javascript");
	this.editor.setReadOnly(true);
}
