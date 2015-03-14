(function(){
	"use strict";

	NS.load ( ['lib.Delegate', 'lib.Events'], classWrapper, this );

	function classWrapper() {

		var Delegate = NS.use('lib.Delegate');
		var Events = NS.use('lib.Events');

		function Bind( objectID ) {
			this.dataAttr = "data-bind-" + objectID;

			// Messages
			this.updateMessage = objectID + ":change";
			this.addMessage = objectID + ":add";

			// Event Proxies (for easy cleanup)
			this.changeHandlerProxy = Delegate(this.changeHandler, this);
			this.updateProxy = Delegate(this.update, this);
			this.attachProxy = Delegate(this.attach, this);

			// Internal Data
			this.attributes = {};

			// Subscribers
			Events.subscribe( this.updateMessage, this.updateProxy );
			Events.subscribe( this.addMessage, this.attachProxy );

			this.attach();
		}

		var p = Bind.prototype;

		p.changeHandler = function ( evt ) {
			var target = evt.target || evt.srcElement;
			var attrName = target.getAttribute(this.dataAttr);
			var tagType = target.tagName.toLowerCase();

			console.log ('change handler');

			if ( tagType === "input" || tagType === "textarea" || tagType === "select" ) {
				Events.trigger( this.updateMessage, [attrName, target.value] );
			} else {
				Events.trigger( this.updateMessage, [attrName, target.innerHTML] );
			}
		};

		p.update = function( propName, val ){
			var elements = NS.global.document.querySelectorAll("[" + this.dataAttr + "=" + propName + "]");
			var tagType;
			this.attributes[ propName ] = val;
			var i=elements.length; while (i--) {
				tagType = elements[i].tagName.toLowerCase();
				if ( tagType === "input" || tagType === "textarea" || tagType === "select" ) {
					elements[i].value = val;
				} else {
					elements[i].innerHTML = val;
				}
			}
		};

		p.attach = function () {
			// Remove and re-add listeners on all appropriate DOM elements
			var elements = NS.global.document.querySelectorAll("[" + this.dataAttr + "]");
			var i=elements.length; while (i--) {
				if ( NS.global.document.addEventListener ) {
					NS.global.document.removeEventListener( "change", this.changeHandlerProxy, false );
					NS.global.document.removeEventListener( "input", this.changeHandlerProxy, false );

					NS.global.document.addEventListener( "change", this.changeHandlerProxy, false );
					NS.global.document.addEventListener( "input", this.changeHandlerProxy, false );
				} else {
					console.log ('Warning: The events to support proper data binding don\'t exist in ie8');
				}
			}
		};

		p.set = function( attrName, val ) {
			Events.trigger( this.updateMessage, [attrName, val] );
		};

		p.get = function( attrName ) {
			return this.attributes[ attrName ];
		};

		p.destroy = function () {
			NS.global.document.removeEventListener( "change", this.changeHandlerProxy, false );
			NS.global.document.removeEventListener( "input", this.changeHandlerProxy, false );
			Events.unsubscribe( this.updateMessage, this.updateProxy );
			Events.unsubscribe( this.addMessage, this.attachProxy );
		};

		var namespace = new NS ('lib');
		namespace.Bind = Bind;

	}

})();
