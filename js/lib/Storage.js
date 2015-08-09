(function (NS) {
	"use strict";

	var libs = [];
	var polyfills = [];

	NS ( 'lib.Storage', libs.concat(polyfills), function(){

		var Storage;
		if ( NS.global.localStorage && JSON ) {
			Storage = {
				get: function( key ) {
					return NS.global.localStorage[key] && JSON.parse(NS.global.localStorage[key]);
				},
				set: function( key, data ) {
					NS.global.localStorage[key] = JSON.stringify(data);
				}
			};
		} else {
			console.log ('Warning: This browser doesn\'t support localStorage or JSON');
			Storage = {
				get: function( key ) { return },
				set: function( key, data ) { return }
			};
		}

		return Storage;
	});

})(window.NS);
