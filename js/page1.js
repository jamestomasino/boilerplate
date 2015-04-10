// Set the global path to javascript files for NS
var NS = window.NS;
NS.baseURL = 'js/';

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
	var DOMtestEl           = DOM.create('<p class="dynamic_tag_example">Dynamically created tag.</p>');

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

	analytics.trackEvent ('SampleCategory', 'SampleAction', 'SampleLabel', 1);

	/**********************************************************************/
	/********************* Application Cache Example **********************/
	/**********************************************************************/

	// Requires that a proper manifest be added to the html page.
	// This boilerprate is not configured with AppCache, so this does nada.
	var AppCache            = NS.use('lib.AppCache');
	var appCacheMediator    = new AppCache();

	/**********************************************************************/
	/************************* Template Example ***************************/
	/**********************************************************************/

	// Requires that a proper manifest be added to the html page.
	// This boilerprate is not configured with AppCache, so this does nada.
	var Template            = NS.use('lib.Template');

	var templateExample     = '<p id="{{ id }}">{{ content.text }}</p> <ul> {{#each item}} <li>{{ label }}</li> {{/each item}} </ul>';
	var templateData        = { "id": "templateTest",
                                "content" : {
                                  "text" : "template text example"
                                },
								"item" : [
									{ "label" : "item 1" },
									{ "label" : "item 2" },
									{ "label" : "item 3" },
									{ "label" : "item 4" },
									{ "label" : "item 5" },
									{ "label" : "item 6" }
								]
                              };
	var renderedTemplate    = Template(templateExample, templateData);
	var renderedHTML        = DOM.create(renderedTemplate);
	mainWrapper.appendChild(renderedHTML);
}

// List all page dependencies
var libs = ['app.model.SampleModel', 'app.controller.SampleController',
	'app.view.SampleView', 'lib.Bind', 'lib.DOM', 'lib.Storage', 'lib.Events',
	'lib.Analytics', 'lib.AppCache', 'lib.Template' ];

// Load all page dependencies and initiate page setup via callback
NS.load ( libs, page1, this);
