(function(NS){
	"use strict";

	function classWrapper() {

		var Delegate = NS.use('lib.Delegate');

		function AppCache () {
			this.appCache = NS.global.applicationCache;

			// If no support for AppCache, return
			if (!this.appCache) {
				console.log ('AppCache: No applicationCache object. Aborting.');
				return;
			}

			// Fired after the first cache of the manifest.
			this.appCache.addEventListener('cached', Delegate( this.onCacheCached, this ), false);

			// Checking for an update. Always the first event fired in the sequence.
			this.appCache.addEventListener('checking', Delegate( this.onCacheChecking, this ), false);

			// An update was found. The browser is fetching resources.
			this.appCache.addEventListener('downloading', Delegate( this.onCacheDownloading, this ), false);

			// The manifest returns 404 or 410, the download failed,
			// or the manifest changed while the download was in progress.
			this.appCache.addEventListener('error', Delegate( this.onCacheError, this ), false);

			// Fired after the first download of the manifest.
			this.appCache.addEventListener('noupdate', Delegate( this.onCacheNoUpdate, this ), false);

			// Fired if the manifest file returns a 404 or 410.
			// This results in the application cache being deleted.
			this.appCache.addEventListener('obsolete', Delegate( this.onCacheObsolete, this ), false);

			// Fired for each resource listed in the manifest as it is being fetched.
			this.appCache.addEventListener('progress', Delegate( this.onCacheProgress, this ), false);

			// Fired when the manifest resources have been newly redownloaded.
			this.appCache.addEventListener('updateready', Delegate( this.onCacheUpdate, this ), false);
		}

		var p = AppCache.prototype;

		p.onCacheCached = function (e) { };
		p.onCacheChecking = function (e) { };
		p.onCacheDownloading = function (e) { };
		p.onCacheNoUpdate = function (e) { };
		p.onCacheObsolete = function (e) { };
		p.onCacheProgress = function (e) { };

		p.onCacheUpdate = function (e) {
			console.log('AppCache: Application Cache has been modifed. Switch and reload.');
			this.appCache.swapCache();
			window.location.reload();
		};

		p.onCacheError = function (e) {
			console.log('Error: Cache failed to update!');
		};

		p.getStatus = function () {
			switch (this.appCache.status) {
				case this.appCache.UNCACHED: // UNCACHED == 0
					return 'UNCACHED';
				case this.appCache.IDLE: // IDLE == 1
					return 'IDLE';
				case this.appCache.CHECKING: // CHECKING == 2
					return 'CHECKING';
				case this.appCache.DOWNLOADING: // DOWNLOADING == 3
					return 'DOWNLOADING';
				case this.appCache.UPDATEREADY:  // UPDATEREADY == 4
					return 'UPDATEREADY';
				case this.appCache.OBSOLETE: // OBSOLETE == 5
					return 'OBSOLETE';
				default:
					return 'UKNOWN CACHE STATUS';
			}
		};

		p.update = function () {
			try {
				this.appCache.update();
			} catch (e) {
				console.log (e.message);
			}
		};

		var namespace = new NS ( 'lib' );
		namespace.AppCache = AppCache;
	}

	NS.load ( ['lib.Delegate'], classWrapper, this );

})(window.NS);
