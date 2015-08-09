(function(NS){
	"use strict";

	var libs = [];
	var polyfills = [];

	NS('app.model.CONST', libs.concat(polyfills), function(){

		var CONST = {};

		// APPLICATION
		CONST.APPLICATION_READY = 'APPLICATION_READY';

		// MODES
		CONST.MODE_SAMPLE       = 'MODE_SAMPLE';

		// UI EVENTS
		CONST.UI_EVENT_NAME_1   = 'UI_EVENT_NAME_1';

		// DATA EVENTS
		CONST.DATA_EVENT_NAME_1 = 'DATA_EVENT_NAME_1';

		// CONFIGURATION
		CONST.UI_BIND_TYPE      = 'touchend click';

		return CONST;
	});

})(window.NS);
