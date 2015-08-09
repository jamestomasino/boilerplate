(function (NS) {
	"use strict";

	NS ( 'lib.JSONP', [], function(){

		return function (url, callbackFunction, errorFunction)
		{
			// Create temporary global callback function, but delete reference on use
			var callbackName = 'JSONP_CALLBACK_' + Math.round(100000 * Math.random());
			var script = document.createElement('script');
			script.onerror = function(err) {
				delete window[callbackName];
				document.body.removeChild(script);
				errorFunction(err);
			};

			window[callbackName] = function(data) {
				delete window[callbackName];
				document.body.removeChild(script);
				callbackFunction(data);
			};

			script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
			document.body.appendChild(script);
		}
	});

})(window.NS);
