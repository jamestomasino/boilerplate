(function() {
	window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
									window.mozRequestAnimationFrame ||
									window.msRequestAnimationFrame ||
									window.oRequestAnimationFrame ||
									function (callback) {
										return window.setTimeout(callback, 60);
									});
	window.cancelRequestAnimationFrame = (window.cancelAnimationFrame ||
										  window.webkitCancelRequestAnimationFrame ||
										  window.mozCancelRequestAnimationFrame ||
										  window.msCancelRequestAnimationFrame ||
										  window.oCancelRequestAnimationFrame ||
										  window.clearTimeout);
})();
