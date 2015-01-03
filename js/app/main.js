define(['require','app/model/SampleModel', 'app/controller/SampleController', 'app/view/SampleView'], function(require) {

	var SampleModel = require('app/model/SampleModel');
	var SampleController = require('app/controller/SampleController');
	var SampleView = require('app/view/SampleView');

	var model = new SampleModel();
	var controller = new SampleController( model );
	var view = new SampleView( '#sample_id' );

	model.applicationStart();

});
