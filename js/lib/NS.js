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

	NS.global = (function(){ return this || (1,eval)('this') })();

	NS.baseURL = '';

	NS.queue = [];
	NS.callbacks = [];
	NS.loaded = [];
	NS.currentObj = null;
	NS.isProcessing = false;

	NS.use = function ( NSString ) {
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

			NS.currentObj = NS.queue.pop();
			var scriptURL = NS.currentObj;

			var i = NS.loaded.length; while (i--) {
				if (NS.loaded[i] == scriptURL) {
					NS.onLoadComplete();
					return;
				}
			};

			while (scriptURL.indexOf('.') != -1) {
				scriptURL = scriptURL.replace('.', '/');
			}

			scriptURL = scriptURL + '.js';

			var xhrObj = NS.createXMLHTTPObject();
			//xhrObj.onload = NS.onLoad;

			var done = false;

			xhrObj.onload = xhrObj.onreadystatechange = function() {
				if ( !done && (!this.readyState || this.readyState === 4) ) {
					done = true;
					NS.onLoad(xhrObj);
					xhrObj.onload = xhrObj.onreadystatechange = null;
				}
			};
			xhrObj.open('GET', NS.baseURL + scriptURL, true);
			xhrObj.send('');
		} else {
			NS.isProcessing = false;
			NS.processCallbacks();
		}
	}

	NS.onLoad = function (xhrObj) {
		NS.loaded.push(NS.currentObj);
		var f = new Function (xhrObj.responseText);
		f.call(NS.global);
		NS.onLoadComplete();
	}

	NS.onLoadComplete = function () {
		NS.processQueue();
	}

	NS.processCallbacks = function () {
		var callbacksTrigger = "";
		var i = NS.callbacks.length; while (i--) {
			if (! NS.callbacks[i].fired) {
				if ( typeof NS.callbacks[i].callback === 'function' ) {
					callbacksTrigger += "NS.callbacks[" + i + "].callback.call(NS.callbacks[" + i + "].scope);\n"
				}
				NS.callbacks[i].fired = true;
			}
		}
		NS.global.eval(callbacksTrigger);
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

