(function(NS){
	"use strict";

	function classWrapper () {
		//---------------------------------------------------------------
		//------------------ Global Vars and Libs -----------------------
		//---------------------------------------------------------------

		var Events = NS.use('lib.Events');
		var Delegate = NS.use('lib.Delegate');
		var CONST = NS.use('app.model.CONST');

		//---------------------------------------------------------------
		//---------------------- Constructor ----------------------------
		//---------------------------------------------------------------

		/**
		 * Sample controller class
		 * @param {Object} model [Reference to the data model]
		 * @public
		 */
		var SampleController = function ( model ) {
			this.model = model;

			Events.subscribe ( CONST.UI_EVENT_NAME_1, Delegate(this._onSampleUIEvent, this) );
		};


		//---------------------------------------------------------------
		//------------------------ Methods ------------------------------
		//---------------------------------------------------------------


		var p = SampleController.prototype;


		//---------------------------------------------------------------
		//------------------------ Internal -----------------------------
		//---------------------------------------------------------------


		/**
		 * Sample UI Event Handler
		 * @param {Event} e [UI event]
		 * @private
		 */
		p._onSampleUIEvent = function (e) {
			console.log ( 'SampleController::onSampleUIEvent');
			this.model.sampleMethod();
		};


		var namespace = new NS ( 'app.controller' );
		namespace.SampleController = SampleController;

	}

	NS.load ( ['lib.Delegate', 'lib.Events', 'app.model.CONST'], classWrapper, this);

})(window.NS);
