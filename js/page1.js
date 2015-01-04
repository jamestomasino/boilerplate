NS.baseURL = 'js/';

var SampleModel = NS.import('app.model.SampleModel');
var SampleController = NS.import('app.controller.SampleController');
var SampleView = NS.import('app.view.SampleView');

var model = new SampleModel();
var controller = new SampleController( model );
var view = new SampleView( '#sample_id' );

model.applicationStart();
