(function(){
	"use strict";

	var eventSubscribers = {}, logEvents = false, logIgnoredEvents = [];

	function trigger(eventName, data, context) {
		var subscribers = eventSubscribers[eventName], i, iMax,
		logThis = (logEvents && logIgnoredEvents.indexOf(eventName) === -1);

		data = (data instanceof Array) ? data : [data];
		context = context || window;
		if (typeof subscribers === 'undefined') {
			if (logThis) {
				console.log('[EventDispatcher] No current subscribers for {' + eventName + '}');
			}
			return;
		}

		if (logThis) {
			console.log(
				'[EventDispatcher] {' +  eventName + '} triggered with data: ',
				data,
				' and sent to {' + subscribers.length + '} subscribers.'
			);
		}

		for (i = 0, iMax = subscribers.length; i < iMax; i += 1) {
			subscribers[i].callback.apply(context, data);
		}
	}

	function subscribeSingle(eventName, callback, priority) {

		var subscribers = eventSubscribers[eventName];

		priority = parseInt(priority || 0, 10);

		if (typeof subscribers === 'undefined') {
			subscribers = eventSubscribers[eventName] = [];
		}

		subscribers.push({callback: callback, priority: priority});

		// Re-sort subscribers so highest priority is first
		subscribers = subscribers.sort(function(a, b) {
			return b.priority - a.priority
		});
	}

	function subscribeHash(eventHash, priority) {

		var eventName;

		for (eventName in eventHash) {
			if (eventHash.hasOwnProperty(eventName)) {
				subscribeSingle(eventName, eventHash[eventName], priority);
			}
		}
	}

	function subscribe(eventNameOrHash, callback, priority) {

		if (typeof eventNameOrHash === 'object') {
			return subscribeHash(eventNameOrHash);
		}

		return subscribeSingle(eventNameOrHash, callback);
	}

	function unsubscribe(eventName, existingCallback) {
		var
		subscribers = eventSubscribers[eventName],
		callbackIndex;

		// If we don't know this event, don't even worry about it.
		if (typeof subscribers === 'undefined') { return; }

		callbackIndex = subscribers.indexOf(existingCallback);

		// Not found among subscribers, don't even worry about it.
		if (callbackIndex === -1) { return; }

		//remove from subscribers
		subscribers.splice(callbackIndex, 1);
	}


	function unsubscribeAll(eventName) {
		delete eventSubscribers[eventName];
	}

	function toggleLogging(on) {
		logEvents = (typeof on === 'undefined') ? !logEvents : !!on;
	}

	var namespace = new NS ( 'lib' );
	namespace.Events = {
		trigger:        trigger,
		subscribe:      subscribe,
		unsubscribe:    unsubscribe,
		unsubscribeAll: unsubscribeAll,
		enableLogging:  function () { toggleLogging(true); },
		disableLogging: function () { toggleLogging(false); },
		dontLog:        function (eventName) {
			if (logIgnoredEvents.indexOf(eventName) === -1) {
				logIgnoredEvents.push(eventName);
			}
		}
	};

})();
