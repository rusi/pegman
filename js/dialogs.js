
/*  Blockly API is used here  */

var Dialogs = Dialogs || {};

/**
 * Is the dialog currently onscreen?
 * @private
 */
Dialogs.isDialogVisible_ = false;

/**
 * A closing dialog should animate towards this element.
 * @type Element
 * @private
 */
Dialogs.dialogOrigin_ = null;

/**
 * A function to call when a dialog closes.
 * @type Function
 * @private
 */
Dialogs.dialogDispose_ = null;

/**
 * Show the dialog pop-up.
 * @param {!Element} content DOM element to display in the dialog.
 * @param {Element} origin Animate the dialog opening/closing from/to this
 *     DOM element.  If null, don't show any animations for opening or closing.
 * @param {boolean} animate Animate the dialog opening (if origin not null).
 * @param {boolean} modal If true, grey out background and prevent interaction.
 * @param {!Object} style A dictionary of style rules for the dialog.
 * @param {Function} disposeFunc An optional function to call when the dialog
 *     closes.  Normally used for unhooking events.
 */
Dialogs.showDialog = function(content, origin, animate, modal, style,
                                  disposeFunc) {
  if (Dialogs.isDialogVisible_) {
    Dialogs.hideDialog(false);
  }
  Dialogs.isDialogVisible_ = true;
  Dialogs.dialogOrigin_ = origin;
  Dialogs.dialogDispose_ = disposeFunc;
  var dialog = document.getElementById('dialog');
  var shadow = document.getElementById('dialogShadow');
  var border = document.getElementById('dialogBorder');

  // Copy all the specified styles to the dialog.
  for (var name in style) {
    dialog.style[name] = style[name];
  }
  if (modal) {
    shadow.style.visibility = 'visible';
    shadow.style.opacity = 0.3;
    var header = document.createElement('div');
    header.id = 'dialogHeader';
    dialog.appendChild(header);
    Dialogs.dialogMouseDownWrapper_ =
        Blockly.bindEvent_(header, 'mousedown', null,
                           Dialogs.dialogMouseDown_);
  }
  dialog.appendChild(content);
  content.className = content.className.replace('dialogHiddenContent', '');

  function endResult() {
    // Check that the dialog wasn't closed during opening.
    if (Dialogs.isDialogVisible_) {
      dialog.style.visibility = 'visible';
      dialog.style.zIndex = 1;
      border.style.visibility = 'hidden';
    }
  }
  if (animate && origin) {
    Dialogs.matchBorder_(origin, false, 0.2);
    Dialogs.matchBorder_(dialog, true, 0.8);
    // In 175ms show the dialog and hide the animated border.
    window.setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
};

/**
 * Horizontal start coordinate of dialog drag.
 */
Dialogs.dialogStartX_ = 0;

/**
 * Vertical start coordinate of dialog drag.
 */
Dialogs.dialogStartY_ = 0;

/**
 * Handle start of drag of dialog.
 * @param {!Event} e Mouse down event.
 * @private
 */
Dialogs.dialogMouseDown_ = function(e) {
  Dialogs.dialogUnbindDragEvents_();
  if (Blockly.isRightButton(e)) {
    // Right-click.
    return;
  }
  // Left click (or middle click).
  // Record the starting offset between the current location and the mouse.
  var dialog = document.getElementById('dialog');
  Dialogs.dialogStartX_ = dialog.offsetLeft - e.clientX;
  Dialogs.dialogStartY_ = dialog.offsetTop - e.clientY;

  Dialogs.dialogMouseUpWrapper_ = Blockly.bindEvent_(document,
      'mouseup', null, Dialogs.dialogUnbindDragEvents_);
  Dialogs.dialogMouseMoveWrapper_ = Blockly.bindEvent_(document,
      'mousemove', null, Dialogs.dialogMouseMove_);
  // This event has been handled.  No need to bubble up to the document.
  e.stopPropagation();
};

/**
 * Drag the dialog to follow the mouse.
 * @param {!Event} e Mouse move event.
 * @private
 */
Dialogs.dialogMouseMove_ = function(e) {
  var dialog = document.getElementById('dialog');
  var dialogLeft = Dialogs.dialogStartX_ + e.clientX;
  var dialogTop = Dialogs.dialogStartY_ + e.clientY;
  dialogTop = Math.max(dialogTop, 0);
  dialogTop = Math.min(dialogTop, window.innerHeight - dialog.offsetHeight);
  dialogLeft = Math.max(dialogLeft, 0);
  dialogLeft = Math.min(dialogLeft, window.innerWidth - dialog.offsetWidth);
  dialog.style.left = dialogLeft + 'px';
  dialog.style.top = dialogTop + 'px';
};

/**
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
Dialogs.dialogUnbindDragEvents_ = function() {
  if (Dialogs.dialogMouseUpWrapper_) {
    Blockly.unbindEvent_(Dialogs.dialogMouseUpWrapper_);
    Dialogs.dialogMouseUpWrapper_ = null;
  }
  if (Dialogs.dialogMouseMoveWrapper_) {
    Blockly.unbindEvent_(Dialogs.dialogMouseMoveWrapper_);
    Dialogs.dialogMouseMoveWrapper_ = null;
  }
};

/**
 * Hide the dialog pop-up.
 * @param {boolean} opt_animate Animate the dialog closing.  Defaults to true.
 *     Requires that origin was not null when dialog was opened.
 */
Dialogs.hideDialog = function(opt_animate) {
  if (!Dialogs.isDialogVisible_) {
    return;
  }
  Dialogs.dialogUnbindDragEvents_();
  if (Dialogs.dialogMouseDownWrapper_) {
    Blockly.unbindEvent_(Dialogs.dialogMouseDownWrapper_);
    Dialogs.dialogMouseDownWrapper_ = null;
  }

  Dialogs.isDialogVisible_ = false;
  Dialogs.dialogDispose_ && Dialogs.dialogDispose_();
  Dialogs.dialogDispose_ = null;
  var origin = (opt_animate === false) ? null : Dialogs.dialogOrigin_;
  var dialog = document.getElementById('dialog');
  var shadow = document.getElementById('dialogShadow');
  var border = document.getElementById('dialogBorder');

  shadow.style.opacity = 0;

  function endResult() {
    shadow.style.visibility = 'hidden';
    border.style.visibility = 'hidden';
  }
  if (origin) {
    Dialogs.matchBorder_(dialog, false, 0.8);
    Dialogs.matchBorder_(origin, true, 0.2);
    // In 175ms hide both the shadow and the animated border.
    window.setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
  dialog.style.visibility = 'hidden';
  dialog.style.zIndex = -1;
  var header = document.getElementById('dialogHeader');
  if (header) {
    header.parentNode.removeChild(header);
  }
  while (dialog.firstChild) {
    var content = dialog.firstChild;
    content.className += ' dialogHiddenContent';
    document.body.appendChild(content);
  }
};

/**
 * Match the animated border to the a element's size and location.
 * @param {!Element} element Element to match.
 * @param {boolean} animate Animate to the new location.
 * @param {number} opacity Opacity of border.
 * @private
 */
Dialogs.matchBorder_ = function(element, animate, opacity) {
  if (!element) {
    return;
  }
  var border = document.getElementById('dialogBorder');
  var bBox = Dialogs.getBBox_(element);
  function change() {
    border.style.width = bBox.width + 'px';
    border.style.height = bBox.height + 'px';
    border.style.left = bBox.x + 'px';
    border.style.top = bBox.y + 'px';
    border.style.opacity = opacity;
  }
  if (animate) {
    border.className = 'dialogAnimate';
    window.setTimeout(change, 1);
  } else {
    border.className = '';
    change();
  }
  border.style.visibility = 'visible';
};

/**
 * Compute the absolute coordinates and dimensions of an HTML or SVG element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Dialogs.getBBox_ = function(element) {
  if (element.getBBox) {
    // SVG element.
    var bBox = element.getBBox();
    var height = bBox.height;
    var width = bBox.width;
    var xy = Blockly.getAbsoluteXY_(element);
    var x = xy.x;
    var y = xy.y;
  } else {
    // HTML element.
    var height = element.offsetHeight;
    var width = element.offsetWidth;
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
  }
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};

/**
 * If the user preses enter, escape, or space, hide the dialog.
 * @param {!Event} e Keyboard event.
 * @private
 */
Dialogs.dialogKeyDown_ = function(e) {
  if (Dialogs.isDialogVisible_) {
    if (e.keyCode == 13 ||
        e.keyCode == 27 ||
        e.keyCode == 32) {
      Dialogs.hideDialog(true);
      e.stopPropagation();
      e.preventDefault();
    }
  }
};

/**
 * Start listening for Dialogs.dialogKeyDown_.
 */
Dialogs.startDialogKeyDown = function() {
  document.body.addEventListener('keydown',
      Dialogs.dialogKeyDown_, true);
};

/**
 * Stop listening for Dialogs.dialogKeyDown_.
 */
Dialogs.stopDialogKeyDown = function() {
  document.body.removeEventListener('keydown',
      Dialogs.dialogKeyDown_, true);
};

