/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
  if (!window.console) {
    window.console = {};
  }
  // union of Chrome, FF, IE, and Safari console methods
  var m = [
    "log", "info", "warn", "error", "debug", "trace", "dir", "group",
    "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
    "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
  ];
  // define undefined methods as noops to prevent errors
  for (var i = 0; i < m.length; i++) {
    if (!window.console[m[i]]) {
      window.console[m[i]] = function() {};
    }
  }
})();

NS.baseURL = 'js/';

var libs = ['app.model.SampleModel', 'app.controller.SampleController', 'app.view.SampleView', 'lib.Bind', 'lib.DOM', 'lib.Storage', 'lib.Events'];

NS.load ( libs, page1, this);

function page1 () {

	var SampleModel = NS.use('app.model.SampleModel');
	var SampleController = NS.use('app.controller.SampleController');
	var SampleView = NS.use('app.view.SampleView');

	var model = new SampleModel();
	var controller = new SampleController( model );
	var view = new SampleView( '#sample_id' );

	model.applicationStart();

	// bidirectional data binding example
	var Bind = NS.use('lib.Bind');
	var testbind = new Bind('testbind');
	testbind.set('testbindprop', 600); // Default

	// DOM example
	var DOM = NS.use('lib.DOM');
	var wrapperEls = DOM.find('.wrapper');
	var mainWrapper = wrapperEls[0];
	var DOMtestEl = DOM.create('<p>This is a dynamically created p tag.</p>');
	mainWrapper.appendChild(DOMtestEl);

	// LocalStorage Example

	// Check for stored testbindprop value and use it if found
	var Storage = NS.use('lib.Storage');
	var storageTestbindprop = Storage.get('testbindprop');
	if (storageTestbindprop) testbind.set('testbindprop', storageTestbindprop);

	// Listen for bound data object and store testbindprop if changed
	var Events = NS.use('lib.Events');
	Events.subscribe( testbind.updateMessage, function ( propName, val ){
		if (propName === 'testbindprop') {
			Storage.set ('testbindprop', val);
		}
	});
}

