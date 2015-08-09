(function (NS) {
	"use strict";

	var libs = [];
	var polyfills = [];

	NS ( 'lib.Debounce', libs.concat(polyfills), function(){

		var Debounce = function(func, wait, immediate, extra) {
			var timeout, result;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate || extra) result = func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) result = func.apply(context, args);
				return result;
			};
		};

		return Debounce;
	});

})(window.NS);
