(function () {
	"use strict";

	/*************************************************************************/
	/***************************** Analytics *********************************/
	/*************************************************************************/

	/* This lib is a bit of overkill if you're only using a single analytics
	* toolset, like GoogleAnalytics. If you are using multiple, you can
	* connect them here and use the same methods to drive each. */

	var Analytics = function ( google_id ) {

		// Add Google Analytics script tag
		(function (win, doc, o, url, r, a, m) {
			win.GoogleAnalyticsObject = r;
			win[r] = win[r] || function () {
				(win[r].q = win[r].q || []).push(arguments);
			};
			win[r].l = 1 * new Date();
			a = doc.createElement(o);
			m = doc.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = url;
			m.parentNode.insertBefore(a, m);
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		// Set up Tracking object (allow localhost testing)
		if (/localhost/i.test(document.location.origin)) {
			window.ga('create', google_id, {
				'cookieDomain': 'none'
			});
		} else {
			window.ga('create', google_id);
		}
		window.ga('send', 'pageview');

	};

	var p = Analytics.prototype;

	p.trackTime = function ( category, variable, value, label) {
		var trackObj = {
			'timingCategory': category,
			'timingVar': variable
		};

		if (typeof value == 'number') trackObj.timingValue = value;
		if (typeof label !== 'undefined') trackObj.timingLabel = label;

		ga('send', 'timing', trackObj );
	};

	p.trackEvent = function ( category, action, label, value ) {
		var trackObj = {
			'hitType': 'event',
			'eventCategory': category,
			'eventAction': action
		};

		if (typeof label !== 'undefined') trackObj.eventLabel = label;
		if (typeof value == 'number' && value >= 0) trackObj.eventValue = value;

		ga('send', trackObj, {'nonInteraction': 1});
	};

	var namespace = new NS ( 'lib' );
	namespace.Analytics = Analytics;

})();
