(function () {
	"use strict"

	/*
	jsonp('http://www.helloword.com/something.json', callback, error);
	*/

	function JSONP(url, callbackFunction, errorFunction)
	{
		// Create temporary global callback function, but delete reference on use
		var callbackName = 'JSONP_CALLBACK_' + Math.round(100000 * Math.random());
		var script = document.createElement('script');
		script.onerror = function(err) {
			delete window[callbackName];
			document.body.removeChild(script);
			errorFunction();
		};

		window[callbackName] = function(data) {
			delete window[callbackName];
			document.body.removeChild(script);
			callbackFunction(data);
		};

		script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
		document.body.appendChild(script);
	}

	var namespace = new NS ( 'lib' );
	namespace.JSONP = JSONP;

})();
