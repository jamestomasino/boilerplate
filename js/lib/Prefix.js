(function (NS) {
	"use strict";

	var libs = [];
	var polyfills = [];

	NS ( 'lib.Prefix', libs.concat(polyfills), function(){
		var Prefix = function () {};

		Prefix.hasStyle = function ( prefixlist ) {
			var prefixes = prefixlist.split(' ');
			var div = document.createElement('div');
			for(var i = 0; i < prefixes.length; i++) {
				if(div && div.style[prefixes[i]] !== undefined) {
					return true;
				}
			}
			return false;
		}

		Prefix.getStyle = function ( prefixlist, fallback ) {
			var prefixes = prefixlist.split(' ');
			var div = document.createElement('div');
			for(var i = 0; i < prefixes.length; i++) {
				if(div && div.style[prefixes[i]] !== undefined) {
					return prefixes[i];
				}
			}

			return fallback;
		}

		return Prefix;
	});

})(window.NS);
