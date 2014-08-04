
// http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml

function includeJS(filename){
	var fileref = document.createElement('script');
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", filename);

	document.getElementsByTagName("head")[0].appendChild(fileref)
}

function includeCSS(filename) {
	var fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", filename);

	document.getElementsByTagName("head")[0].appendChild(fileref)
}

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if paramater not found.
 * @return {string} The parameter value or the default value if not found.
 */
 function getStringParamFromUrl(name, defaultValue) {
 	var val = window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
 	return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
 }
/**
 * Extracts a numeric parameter from the URL.
 * If the parameter is absent or less than min_value, min_value is
 * returned.  If it is greater than max_value, max_value is returned.
 * @param {string} name The name of the parameter.
 * @param {number} minValue The minimum legal value.
 * @param {number} maxValue The maximum legal value.
 * @return {number} A number in the range [min_value, max_value].
 */
 function getNumberParamFromUrl(name, minValue, maxValue) {
 	var val = Number(getStringParamFromUrl(name, 'NaN'));
 	return isNaN(val) ? minValue : Math.min(Math.max(minValue, val), maxValue);
 }

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
function bindClick(el, func) {
	if (typeof el == 'string') {
		el = document.getElementById(el);
	}
	el.addEventListener('click', func, true);
	el.addEventListener('touchend', func, true);
};

/**
 * Keep the variable within 0-MAX, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds value.
 * @param {number} max Max
 * @return {number} Legal value.
 */
function constrain(d, max) {
	d = Math.round(d) % max;
	if (d < 0) {
		d += max;
	}
	return d;
};

