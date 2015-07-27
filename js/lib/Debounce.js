(function (NS) {

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

	var namespace = new NS ( 'lib' );
	namespace.Debounce = Debounce;

})(window.NS);
