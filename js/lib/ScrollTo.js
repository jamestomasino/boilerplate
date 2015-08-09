(function (NS) {
	"use strict";

	var libs = ['lib.Easing'];
	var polyfills = [];
	if (!window.requestAnimationFrame) {
		polyfills.push("polyfill.requestAnimationFrame");
	}

	NS ( 'lib.ScrollTo', libs.concat(polyfills), function(){

		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

		function ScrollTo(to, callback, duration, easing) {

			function move(amount) {
				document.documentElement.scrollTop = document.body.parentNode.scrollTop = document.body.scrollTop = amount;
			}

			function position() {
				return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
			}

			if (typeof(to) === 'string') {
				to = parseInt(to,10) + position();
			}

			var start = position();
			var change = to - start;
			var currentTime = 0;
			var increment = 20;

			duration = (typeof(duration) === 'undefined') ? 500 : duration;
			easing = (typeof(easing) === 'undefined') ? Math.easeInOutQuad : easing;

			var animateScroll = function() {
				currentTime += increment;
				var val = easing.call(this, currentTime, start, change, duration);
				move(val);
				if (currentTime < duration) {
					requestAnimationFrame(animateScroll);
				} else {
					if (callback && typeof(callback) === 'function') {
						callback();
					}
				}
			};

			animateScroll();
		}

		return ScrollTo;
	});

})(window.NS);
