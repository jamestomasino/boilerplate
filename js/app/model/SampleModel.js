(function(){
	"use strict";

	NS.load ( ['lib.Events',
				'lib.Ajax',
				'lib.Delegate',
				'app.model.CONST'], function () {

		//---------------------------------------------------------------
		//------------------ Global Vars and Libs -----------------------
		//---------------------------------------------------------------

		var Events = NS.import('lib.Events');
		var Ajax = NS.import('lib.Ajax');
		var Delegate = NS.import('lib.Delegate');
		var CONST = NS.import('app.model.CONST');
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
			Ajax(dataPath, Delegate(this._onDataDone, this), Delegate(this._onDataFail, this));
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

		var namespace = new NS ( 'app.model' );
		namespace.SampleModel = SampleModel;
	});
})();
