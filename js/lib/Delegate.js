(function(NS){
	"use strict";

	NS ( 'lib.Delegate', [], function(){
		return function(fn, context) {
			return function() {
				fn.apply(context, arguments);
			};
		};
	});

})(window.NS);
