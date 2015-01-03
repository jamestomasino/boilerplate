define(function () {
	return function(fn, context) {
		return function() {
			fn.apply(context, arguments);
		};
	};
});
