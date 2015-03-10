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
	NS.callbacks = [];
	NS.loaded = [];
	NS.currentObj = null;
	NS.isProcessing = false;
	NS.isCallbacksSetup = false;

	NS.import = function ( NSString ) {
		var parts = NSString.split('.'),
		parent = NS.global,
		currentPart = '';

		for ( var i = 0, length = parts.length; i < length; i++ ) {
			currentPart = parts[i];
			if ( typeof parent[currentPart] === 'undefined') {
				throw ('ERROR::[ Namespace does not exist: ' + NSString + ' ]' );
				return;
			}
			parent = parent[currentPart];
		}

		return parent;
	}

	NS.load = function ( NSStrings, callback, scope ) {
		var isCallbackAdded = false;

		if (typeof callback === 'function') {
			NS.callbacks.push ( {'callback':callback, 'scope':scope, 'fired':false} );
		}

		for (var i = 0; i < NSStrings.length; ++i) {
			var j = NS.loaded.length; while (j--) {
				if (NS.loaded[j] == NSStrings[i]) {
					continue;
				}
			}
			NS.queue.push(NSStrings[i]);
		}

		if (! NS.isProcessing) NS.processQueue();
	}

	NS.processQueue = function () {
		if (NS.queue.length > 0) {
			NS.isProcessing = true;

			var NSString = NS.queue.pop();
			var scriptURL = NSString;

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
			se.text = 'document.write(\'<script type="text/javascript" src="' + NS.baseURL + scriptURL + '"><\/script>\');';
			NS.global.document.getElementsByTagName('head')[0].appendChild(se);
			NS.loaded.push(NSString);

			NS.onLoadComplete();
		} else {
			NS.isProcessing = false;
			NS.setupCallbacks();
		}
	}

	NS.onLoadComplete = function () {
		NS.processQueue();
	}

	NS.setupCallbacks = function () {
		if (! NS.isCallbacksSetup) {
			var se = NS.global.document.createElement('script');
			se.id = "callbacksHook";
			se.type = "text/javascript";
			se.text = "window.onload = function() { NS.processCallbacks(); };";
			NS.global.document.getElementsByTagName('head')[0].appendChild(se);
			NS.isCallbacksSetup = true;
		}
	}

	NS.processCallbacks = function () {
		var i = NS.callbacks.length; while (i--) {
			if (! NS.callbacks[i].fired) {
				if ( typeof NS.callbacks[i].callback === 'function' ) {
					var se = NS.global.document.createElement('script');
					se.type = "text/javascript";
					se.text = "NS.callbacks[" + i + "].callback.call(NS.callbacks[" + i + "].scope);"
					NS.global.document.getElementsByTagName('head')[0].appendChild(se);
				}
				NS.callbacks[i].fired = true;
			}
		}
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

