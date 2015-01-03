define(['Events', 'Ajax', 'Delegate', 'app/model/CONST'],
function ( Events, Ajax, Delegate, CONST ){
	"use strict";

	//---------------------------------------------------------------
	//------------------ Global Vars and Libs -----------------------
	//---------------------------------------------------------------

	var dataPath = "data/data.json";
	var Events = require('Events');

	//---------------------------------------------------------------
	//---------------------- Constructor ----------------------------
	//---------------------------------------------------------------

	/**
	 * Sample data model
	 * @public
	 */
	var SampleModel = function () {
		this._data = {};
		this._applicationMode = '';
	};


	//---------------------------------------------------------------
	//------------------------ Methods ------------------------------
	//---------------------------------------------------------------


	var p = SampleModel.prototype;

	/**
	 * Start the application precessing
	 * @public
	 */
	p.applicationStart = function () {
		this.setApplicationMode( CONST.MODE_SAMPLE );

		Ajax(dataPath, Delegate(this._onDataDone, this));
	};

	/**
	 * Sample method
	 * @public
	 */
	p.sampleMethod = function () {
		Events.trigger ( CONST.DATA_EVENT_NAME_1, "sample_param" );
	};


	//---------------------------------------------------------------
	//------------------------ GET/SET ------------------------------
	//---------------------------------------------------------------

	/**
	 * Set application mode
	 * @param {String} mode
	 * @public
	 */
	p.setApplicationMode = function ( mode ) {
		this._applicationMode = mode;
	};

	/**
	 * Get application mode
	 * @public
	 */
	p.getApplicationMode = function () {
		return this._applicationMode;
	};


	//---------------------------------------------------------------
	//------------------------ Internal -----------------------------
	//---------------------------------------------------------------

	/**
	 * Success handler for data loading
	 * @param {String} data
	 * @private
	 */
	p._onDataDone = function ( data ) {
		this._data = JSON.parse(data);
		Events.trigger (CONST.APPLICATION_READY);
	};

	return SampleModel;

});
