(function(NS){
	"use strict";

	function classWrapper () {
		return function(fn, context) {
			return function() {
				fn.apply(context, arguments);
			};
		};
	}

	var libs = [];
	var polyfills = [];
	NS ( 'lib.Delegate', libs.concat(polyfills), classWrapper, this );

})(window.NS);
