(function() {

	// Enable access to global space even in ECMAScript 5 Strict
	NS.global = (function(){ return this || (1,eval)('this') })();

	function NS (NSString) {
		var parts = NSString.split('.');
		var parent = NS.global;
		var currentPart = '';

		for(var i = 0, length = parts.length; i < length; i++) {
			currentPart = parts[i];
			parent[currentPart] = parent[currentPart] || {};
			parent = parent[currentPart];
		}

		return parent;
	}

	NS.baseURL = '';

	NS.import = function ( NSString ) {
		var parts = NSString.split('.'),
		parent = NS.global,
		currentPart = '';

		for ( var i = 0, length = parts.length; i < length; i++ ) {
			currentPart = parts[i];
			if ( typeof parent[currentPart] == 'undefined') {
				NS.load ( NSString );
				if ( typeof parent[currentPart] == 'undefined') {
					throw ('ERROR::[ Namespace does not exist: ' + NSString + ' ]' );
					return;
				}
			}
			parent = parent[currentPart];
		}

		return parent;
	}

	NS.load = function ( NSString ) {
		var xhrObj = NS.createXMLHTTPObject();
		var scriptURL = NSString;
		while (scriptURL.indexOf('.') != -1) {
			scriptURL = scriptURL.replace('.', '/');
		}
		scriptURL = scriptURL + '.js';
		xhrObj.open('GET', NS.baseURL + scriptURL, false);
		xhrObj.send('');
		var se = NS.global.document.createElement('script');
		se.type = "text/javascript";
		se.text = xhrObj.responseText;
		NS.global.document.getElementsByTagName('head')[0].appendChild(se);
	}

	NS.XMLHttpFactories = [
		function () {return new XMLHttpRequest()},
		function () {return new ActiveXObject("Msxml2.XMLHTTP")},
		function () {return new ActiveXObject("Msxml3.XMLHTTP")},
		function () {return new ActiveXObject("Microsoft.XMLHTTP")}
	];

	NS.createXMLHTTPObject = function () {
		var xmlhttp = false;
		for (var i = 0; i < NS.XMLHttpFactories.length; i++) {

			try {
				xmlhttp = NS.XMLHttpFactories[i]();
			} catch (e) {
				continue;
			}
			break;
		}
		return xmlhttp;
	}

	NS.global.NS = NS;

})();

