define("SampleController", ['Events', 'Delegate', 'app/model/CONST'],
function (                   Events,   Delegate,   CONST ){
	"use strict";

	//---------------------------------------------------------------
	//------------------ Global Vars and Libs -----------------------
	//---------------------------------------------------------------

	var Events = require('Events');

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
		model.sampleMethod();
	};


	return SampleController;

});
