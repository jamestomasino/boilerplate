// Set the global path to javascript files for NS
NS.baseURL = 'js/';

// List all page dependencies
var libs = ['app.model.SampleModel', 'app.controller.SampleController',
	'app.view.SampleView', 'lib.Bind', 'lib.DOM', 'lib.Storage', 'lib.Events',
	'lib.Analytics' ];

// Load all page dependencies and initiate page setup via callback
NS.load ( libs, page1, this);

// Page level callback
function page1 () {

	/**********************************************************************/
	/**************************** MVC Example *****************************/
	/**********************************************************************/
	var SampleModel         = NS.use('app.model.SampleModel');
	var SampleController    = NS.use('app.controller.SampleController');
	var SampleView          = NS.use('app.view.SampleView');

	var model               = new SampleModel();
	var controller          = new SampleController( model );
	var view                = new SampleView( '#sample_id' );

	model.applicationStart();

	/**********************************************************************/
	/********************* Bidirectional Data Binding *********************/
	/**********************************************************************/
	var Bind                = NS.use('lib.Bind');
	var testbind            = new Bind('testbind');

	testbind.set('testbindprop', 600);

	/**********************************************************************/
	/***************************** DOM Example ****************************/
	/**********************************************************************/
	var DOM                 = NS.use('lib.DOM');
	var wrapperEls          = DOM.find('.wrapper');
	var mainWrapper         = wrapperEls[0];
	var DOMtestEl           = DOM.create('<p>Dynamically created tag.</p>');

	mainWrapper.appendChild(DOMtestEl);

	/**********************************************************************/
	/************************ LocalStorage Example ************************/
	/**********************************************************************/

	// Check for stored testbindprop value and use it if found
	var Storage             = NS.use('lib.Storage');
	var storageTestbindprop = Storage.get('testbindprop');

	if (storageTestbindprop) testbind.set('testbindprop', storageTestbindprop);

	// Listen for bound data object and store testbindprop if changed
	var Events              = NS.use('lib.Events');

	Events.subscribe( testbind.updateMessage, function ( propName, val ) {
		if (propName === 'testbindprop') {
			Storage.set ('testbindprop', val);
		}
	});

	/**********************************************************************/
	/********************** Google Analytics Example **********************/
	/**********************************************************************/

	var Analytics           = NS.use('lib.Analytics');
	var analytics           = new Analytics ( "UA-18127227-2" );
}

