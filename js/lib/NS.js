(function() {

	// Enable access to global space even in ECMAScript 5 Strict
	Namespace.global = (function(){ return this || (1,eval)('this') })();

	function Namespace (namespaceString) {
		var parts = namespaceString.split('.');
		var parent = Namespace.global;
		var currentPart = '';

		for(var i = 0, length = parts.length; i < length; i++) {
			currentPart = parts[i];
			parent[currentPart] = parent[currentPart] || {};
			parent = parent[currentPart];
		}

		return parent;
	}

	Namespace.baseURL = '';

	Namespace.import = function ( namespaceString ) {
		var parts = namespaceString.split('.'),
		parent = Namespace.global,
		currentPart = '';

		for ( var i = 0, length = parts.length; i < length; i++ ) {
			currentPart = parts[i];
			if ( typeof parent[currentPart] == 'undefined') {
				Namespace.load ( namespaceString );
				if ( typeof parent[currentPart] == 'undefined') {
					throw ('ERROR::[ Namespace does not exist: ' + namespaceString + ' ]' );
					return;
				}
			}
			parent = parent[currentPart];
		}

		return parent;
	}

	Namespace.load = function ( namespaceString ) {
		var xhrObj = Namespace.createXMLHTTPObject();
		var scriptURL = namespaceString;
		while (scriptURL.indexOf('.') != -1) {
			scriptURL = scriptURL.replace('.', '/');
		}
		scriptURL = scriptURL + '.js';
		xhrObj.open('GET', Namespace.baseURL + scriptURL, false);
		xhrObj.send('');
		var se = Namespace.global.document.createElement('script');
		se.type = "text/javascript";
		se.text = xhrObj.responseText;
		Namespace.global.document.getElementsByTagName('head')[0].appendChild(se);
	}

	Namespace.XMLHttpFactories = [
		function () {return new XMLHttpRequest()},
		function () {return new ActiveXObject("Msxml2.XMLHTTP")},
		function () {return new ActiveXObject("Msxml3.XMLHTTP")},
		function () {return new ActiveXObject("Microsoft.XMLHTTP")}
	];

	Namespace.createXMLHTTPObject = function () {
		var xmlhttp = false;
		for (var i = 0; i < Namespace.XMLHttpFactories.length; i++) {

			try {
				xmlhttp = Namespace.XMLHttpFactories[i]();
			} catch (e) {
				continue;
			}
			break;
		}
		return xmlhttp;
	}

	Namespace.global.NS = Namespace;

})();

