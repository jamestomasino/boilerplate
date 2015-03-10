(function(){
	"use strict";

	NS.load ( ['lib.Delegate', 'lib.Events'], classWrapper, this );

	function classWrapper() {

		var Delegate = NS.import('lib.Delegate');
		var Events = NS.import('lib.Events');

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

			if ( tagType === "input" || tagType === "textarea" || tagType === "select" ) {
				Events.trigger( this.updateMessage, [attrName, target.value] );
			} else {
				Events.trigger( this.updateMessage, [attrName, target.innerHTML] );
			}
		};

		p.update = function( propName, val ){
			var elements = document.querySelectorAll("[" + this.dataAttr + "=" + propName + "]");
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
			var elements = document.querySelectorAll("[" + this.dataAttr + "]");
			var i=elements.length; while (i--) {
				if ( document.addEventListener ) {
					document.removeEventListener( "change", this.changeHandlerProxy, false );
					document.addEventListener( "change", this.changeHandlerProxy, false );
				} else {
					document.removeEvent( "change", this.changeHandlerProxy );
					document.attachEvent( "onchange", this.changeHandlerProxy);
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
			if ( document.addEventListener ) {
				document.removeEventListener( "change", this.changeHandlerProxy, false );
			} else {
				document.removeEvent( "change", this.changeHandlerProxy );
			}
			Events.unsubscribe( this.updateMessage, this.updateProxy );
			Events.unsubscribe( this.addMessage, this.attachProxy );
		};

		var namespace = new NS ('lib');
		namespace.Bind = Bind;

	}

})();
