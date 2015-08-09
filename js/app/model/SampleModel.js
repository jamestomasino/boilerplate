(function(NS){
	"use strict";

	var libs = ['lib.Events', 'lib.Ajax', 'lib.Delegate', 'app.model.CONST']
	var polyfills = [];

	NS ( 'app.model.SampleModel', libs.concat(polyfills), function(){

		//---------------------------------------------------------------
		//------------------ Global Vars and Libs -----------------------
		//---------------------------------------------------------------

		var Events = NS.use('lib.Events');
		var Ajax = NS.use('lib.Ajax');
		var Delegate = NS.use('lib.Delegate');
		var CONST = NS.use('app.model.CONST');
		var dataPath = "data/data.json";

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
			new Ajax(dataPath, Delegate(this._onDataDone, this), Delegate(this._onDataFail, this));
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
			console.log ('data loaded');
		};

		/**
		 * Fail handler for data loading
		 * @param {String} error
		 * @private
		 */
		p._onDataFail = function ( error ) {
			console.log (error);
		};

		return SampleModel;

	});

})(window.NS);
