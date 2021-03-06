(function(window) {
	(function() {
		if (!window.console) {
			window.console = {};
		}
		var m = [
			"log", "info", "warn", "error", "debug", "trace", "dir", "group",
			"groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
			"dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
		];
		for (var i = 0; i < m.length; i++) {
			if (!window.console[m[i]]) {
				window.console[m[i]] = function() {};
			}
		}
	})();

	NS.global = window;
	NS.baseURL = '';
	NS.debug = false;

	// Loading Process Sequence
	NS.objs = []; // add all new objects here
	NS.queue = []; // add to queue & remove as they're being loaded
	NS.loading = []; // add to loading when removed from queue, during load
	NS.loaded = []; // add to loaded when loading complete, never remove
	NS.processed = []; // add to processed after executing
	NS.callbacks = []; // Add callbacks in order, but only when all processed

	NS.isProcessing = false;

	NS._dc = []; // Used for doublechecking recursive dependencies

	function NS ( id, NSStrings, callback, scope ) {

		if (typeof callback === 'function') {
			NS.callbacks.push ( {'id':id, 'callback':callback, 'scope':scope, 'NSStrings':NSStrings} );
		}

		for (var i = 0; i < NSStrings.length; ++i) {

			// Push required libs to the top of stack if requested
			NS.pushToEnd (NSStrings[i], NS.callbacks);

			if ( !NS.exists( NSStrings[i] ) ) {
				var NSObj = {};
				NSObj.id = NSStrings[i];
				NSObj.path = NSObj.id;
				while (NSObj.path.indexOf('.') !== -1) {
					NSObj.path = NSObj.path.replace('.', '/');
				}
				NSObj.path = NS.baseURL + NSObj.path + '.js';
				NSObj.isLoaded = false;
				NSObj.isProcessed = false;
				NSObj.source = '';

				NS.objs.push(NSObj);
				NS.queue.push(NSObj);

			} else if ( NS.isLoaded( NSStrings[i] ) && !NS.isProcessed( NSStrings[i]) ) {
				var moveItem = NS.removeItem( NSStrings[i], NS.loaded );
				NS.loaded.push(moveItem);
			}
		}

		if ( !NS.isProcessing ) NS.process();
	}

	NS.makePath = function (NSString, obj) {
		var parts = NSString.split('.');
		var parent = NS.global;
		var currentPart = '';

		for(var i = 0, length = parts.length; i < length; i++) {
			currentPart = parts[i];
			parent[currentPart] = parent[currentPart] || {};
			parent = parent[currentPart];
		}

		return parent;
	};

	NS.use = function ( NSString ) {
		if (NS.isProcessed(NSString)) {

			var parts = NSString.split('.'),
			parent = NS.global,
			currentPart = '';

			for ( var i = 0, length = parts.length; i < length; i++ ) {
				currentPart = parts[i];
				if ( typeof parent[currentPart] === 'undefined') {
					throw ('ERROR::[ Namespace improperly loaded: ' + NSString + ' ]' );
				}
				parent = parent[currentPart];
			}
			return parent;
		} else {
			throw ('ERROR::[ Namespace does not exist: ' + NSString + ' ]' );
		}
	};


	NS.exists = function ( NSString ) {
		var i = NS.objs.length; while (i--) {
			if (NS.objs[i].id === NSString) {
				return true;
			}
		}
		return false;
	};

	NS.isLoaded = function ( NSString ) {
		var i = NS.objs.length; while (i--) {
			if (NS.objs[i].id === NSString && NS.objs[i].isLoaded === true) {
				return true;
			}
		}
		return false;
	};

	NS.isProcessed = function ( NSString ) {
		var i = NS.objs.length; while (i--) {
			if (NS.objs[i].id === NSString && NS.objs[i].isProcessed === true) {
				return true;
			}
		}
		return false;
	};

	NS.pushToEnd = function ( NSString, queue ) {
		var i = queue.length; while (i--) {
			if (queue[i].id === NSString) {
				var qi =  queue.splice(i,1)[0];
				queue.push (qi);
				var j = qi.NSStrings.length; while (j--) {
					var ns = qi.NSStrings[j];
					if (NS._dc.indexOf(ns) !== -1) {
						throw ('ERROR::[ infinite recursive dependency for ' + ns + '. Halting.]' );
					} else {
						NS._dc.push(ns);
						NS.pushToEnd(ns, NS.callbacks);
						NS._dc.pop();
					}
				}
				return;
			}
		}
	};

	NS.removeItem = function ( NSString, queue ) {
		var i = queue.length; while (i--) {
			if (queue[i].id === NSString) {
				return queue.splice(i,1)[0];
			}
		}
	};

	NS.process = function () {
		NS.isProcessing = true;

		if (NS.queue.length) {
			NS.processQueue();
		} else if (NS.loading.length) {
			return;
		} else if (NS.loaded.length) {
			NS.processLoaded();
		} else if (NS.callbacks.length) {
			NS.processCallbacks();
		} else {
			NS.isProcessing = false;
		}
	};

	NS.processQueue = function () {
		var currentObj = NS.queue.pop();
		NS.loading.push(currentObj);

		var xhrObj = NS.createXMLHTTPObject();
		var done = false;

		xhrObj.id = currentObj.id; // for referencing on load
		xhrObj.onload = xhrObj.onreadystatechange = function() {
			if ( !done && (!this.readyState || this.readyState === 4) ) {
				if (!this.status || this.status === 200) {
					done = true;
					var currentObj = NS.removeItem(xhrObj.id, NS.loading);
					if (currentObj) {
						currentObj.isLoaded = true;
						NS.loaded.push(currentObj);
						currentObj.source = xhrObj.responseText;
					} else {
						throw ('ERROR::[ Cannot find ' + xhrObj.id + ' in loaded array ]' );
					}
					xhrObj.onload = xhrObj.onreadystatechange = null;
					NS.process();
				} else {
					console.log("Error", xhrObj.statusText);
				}
			}
		};
		xhrObj.open('GET', currentObj.path, true);
		xhrObj.send('');
		NS.process();
	}

	NS.processLoaded = function () {
		var currentObj = NS.loaded.pop();
		currentObj.isProcessed = true;
		NS.processed.push(currentObj);
		var f = new Function (currentObj.source);
		f.call(NS.global);
		NS.process();
	};

	NS.processCallbacks = function () {
		var callObj = NS.callbacks.pop();
		if (NS.debug) console.log ('[NS] Processing:', callObj.id);
		var returnObj = callObj.callback.call( callObj.scope || window );
		if (returnObj) {
			NS.makePath (callObj.id);
			str = callObj.id.split(".");
			obj = NS.global;
			while (str.length > 1)
				obj = obj[str.shift()];
			obj[str.shift()] = returnObj;
		}
		NS.process();
	}

	NS.XMLHttpFactories = [
		function () {return new ActiveXObject("Microsoft.XMLHTTP")},
		function () {return new ActiveXObject("Msxml3.XMLHTTP")},
		function () {return new ActiveXObject("Msxml2.XMLHTTP")},
		function () {return new XMLHttpRequest()}
	];

	NS.createXMLHTTPObject = function () {
		var xmlhttp = false;
		var i = NS.XMLHttpFactories.length; while (i--) {
			try {
				xmlhttp = NS.XMLHttpFactories[i]();
			} catch (e) {
				continue;
			}
			break;
		}
		return xmlhttp;
	};

	NS.global.NS = NS;

})(window);
