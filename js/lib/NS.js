(function() {

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

	// Enable access to global space even in ECMAScript 5 Strict
	NS.global = (function(){ return this || (1,eval)('this') })();

	NS.baseURL = '';

	NS.queue = [];
	NS.loaded = [];
	NS.currentObj = null;
	NS.isProcessing = false;

	NS.load = function ( NSStrings, callback, scope ) {
		var isCallbackAdded = false;

		for (var i = 0; i < NSStrings.length; ++i) {
			var j = NS.loaded.length; while (j--) {
				if (NS.loaded[j] == NSStrings[i]) {
					continue;
				}
			}
			if (!isCallbackAdded) {
				isCallbackAdded = true;
				NS.processLoad ( NSStrings[i], callback, scope );
			}
			else NS.processLoad ( NSStrings[i] );
		}
		if (! NS.isProcessing) NS.processQueue();
	}

	NS.import = function ( NSString ) {
		var parts = NSString.split('.'),
		parent = NS.global,
		currentPart = '';

		for ( var i = 0, length = parts.length; i < length; i++ ) {
			currentPart = parts[i];
			if ( typeof parent[currentPart] == 'undefined') {
				throw ('ERROR::[ Namespace does not exist: ' + NSString + ' ]' );
				return;
			}
			parent = parent[currentPart];
		}

		return parent;
	}

	NS.processQueue = function () {
		if (NS.queue.length > 0) {
			NS.isProcessing = true;

			NS.currentObj = NS.queue.pop();
			var scriptURL = NS.currentObj.name;

			var i = NS.loaded.length; while (i--) {
				if (NS.loaded[i] == scriptURL) {
					NS.onLoadComplete();
					return;
				}
			}

			while (scriptURL.indexOf('.') != -1) {
				scriptURL = scriptURL.replace('.', '/');
			}
			scriptURL = scriptURL + '.js';

			var se = NS.global.document.createElement('script');
			se.type = "text/javascript";
			se.src=NS.baseURL + scriptURL;
			//real browsers
			se.onload=NS.onLoad;
			//Internet explorer
			se.onreadystatechange = function() {
				if (this.readyState == 'complete') {
					NS.onLoad();
				}
			}
			NS.global.document.getElementsByTagName('head')[0].appendChild(se);
			//var xhrObj = NS.createXMLHTTPObject();
			//xhrObj.onload = NS.onLoad;
			//xhrObj.open('GET', NS.baseURL + scriptURL, true);
			//xhrObj.send('');
		} else {
			NS.isProcessing = false;
		}
	}

	NS.processLoad = function ( NSString, callback, scope ) {
		var NSObj = {};
		NSObj.name = NSString;
		NSObj.callback = callback;
		NSObj.scope = scope;
		NS.queue.push(NSObj);
	}

	NS.onLoad = function () {
		console.log ('Loaded: ' + NS.currentObj.name);
		NS.loaded.push(NS.currentObj.name);

		//var se = NS.global.document.createElement('script');
		//se.type = "text/javascript";
		//se.text = this.responseText;
		//NS.global.document.getElementsByTagName('head')[0].appendChild(se);
		NS.onLoadComplete();
	}

	NS.onLoadComplete = function () {
		if ( typeof NS.currentObj.callback === 'function' ) {
			NS.currentObj.callback.call(NS.currentObj.scope);
		}

		NS.processQueue();
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

