(function(){
	"use strict";

	var Delegate = NS.import('lib.Delegate');
	var Events = NS.import('lib.Events');

	function Bind( object_id ) {
		this.data_attr = "data-bind-" + object_id;

		// Messages
		this.updateMessage = object_id + ":change";
		this.addMessage = object_id + ":add";

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
		var target = evt.target || evt.srcElement; // IE8 compatibility
		var attr_name = target.getAttribute(this.data_attr);
		var tag_name = target.tagName.toLowerCase();

		if ( tag_name === "input" || tag_name === "textarea" || tag_name === "select" ) {
			Events.trigger( this.updateMessage, [attr_name, target.value] );
		} else {
			Events.trigger( this.updateMessage, [attr_name, target.innerHTML] );
		}
	};

	p.update = function( prop_name, new_val ){
		var elements = document.querySelectorAll("[" + this.data_attr + "=" + prop_name + "]");
		var tag_name;
		this.attributes[ prop_name ] = new_val;
		var i=elements.length; while (i--) {
			tag_name = elements[i].tagName.toLowerCase();
			if ( tag_name === "input" || tag_name === "textarea" || tag_name === "select" ) {
				elements[i].value = new_val;
			} else {
				elements[i].innerHTML = new_val;
			}
		}
	};

	p.attach = function () {
		// Remove and re-add listeners on all appropriate DOM elements
		var elements = document.querySelectorAll("[" + this.data_attr + "]");
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

	p.set = function( attr_name, val ) {
		Events.trigger( this.updateMessage, [attr_name, val] );
	};

	p.get = function( attr_name ) {
		return this.attributes[ attr_name ];
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

})();
