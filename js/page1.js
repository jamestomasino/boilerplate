NS.baseURL = 'js/';

var libs = ['app.model.SampleModel', 'app.controller.SampleController', 'app.view.SampleView', 'lib.Bind', 'lib.DOM', 'lib.Storage', 'lib.Events'];

NS.load ( libs, page1, this);

function page1 () {

	console.log ('start');

	var SampleModel = NS.import('app.model.SampleModel');
	var SampleController = NS.import('app.controller.SampleController');
	var SampleView = NS.import('app.view.SampleView');

	var model = new SampleModel();
	var controller = new SampleController( model );
	var view = new SampleView( '#sample_id' );

	model.applicationStart();

	// bidirectional data binding example
	var SampleBind = NS.import('lib.Bind');
	var testbind = new SampleBind('testbind');
	testbind.set('testbindprop', 600); // Default

	// DOM example
	var DOM = NS.import('lib.DOM');
	var wrapperEl = DOM.get('.wrapper')[0]; // Get first element of class array
	var DOMtestEl = DOM.create('<p>This is a dynamically created p tag.</p>');
	wrapperEl.appendChild(DOMtestEl);

	// LocalStorage Example

	// Check for stored testbindprop value and use it if found
	var Storage = NS.import('lib.Storage');
	var storageTestbindprop = Storage.get('testbindprop');
	if (storageTestbindprop) testbind.set('testbindprop', storageTestbindprop);

	// Listen for bound data object and store testbindprop if changed
	var Events = NS.import('lib.Events');
	Events.subscribe( testbind.updateMessage, function ( propName, val ){
		if (propName === 'testbindprop') {
			Storage.set ('testbindprop', val);
		}
	});
}

