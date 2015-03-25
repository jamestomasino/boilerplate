(function () {

	var DOM = {};

	// Usage:
	// var el = DOM.create('<h1>hello world!</h1>');
	// document.body.appendChild(el);

	DOM.create = function( str ) {
		var frag = document.createDocumentFragment();
		var elem = document.createElement('div');
		elem.innerHTML = str;
		while (elem.childNodes[0]) {
			frag.appendChild(elem.childNodes[0]);
		}
		return frag;
	};

	// Usage:
	// var el = DOM.find('#someid');
	// var els = DOM.find('.someclass');
	// var els = DOM.find('li', someContextElement);

	DOM.find = function( a, b ){
		var c = a.match(/^(\W)?(.*)/);
		var o;
		var select = "getElement" + ( c[1] ? c[1] == "#" ? "ById" : "sByClassName" : "sByTagName");

		if (select === "getElementsByClassName" && ! document.getElementsByClassName) {
			o = ( b || document )["querySelectorAll"]( a );
			if ( /[\ \>]/.test(a) ) {
				console.log('WARNING: Using IE8 querySelectorAll fallback. This only supports simple selectors, not descendants.');
			}
		} else {
			o = ( b || document )[select]( c[2] )
		}
		return o;
	};

	DOM.remove = function ( el ) {
		el = (typeof el === 'string') ? DOM.find(el) : el;
		if (el) {
			if (el.length) {
				var i = el.length; while (i--);
				el[i].parentNode.removeChild(el[i]);
			} else {
				el.parentNode.removeChild(el);
			}
		}
	};

	DOM.removeClass = function ( el, classname ) {
		var targets;
		if (typeof el === 'string') targets = DOM.find(el);
		else targets = el;

		if (targets) {
			var exp1 = /(?:^|\s)/;
			var exp2 = /(?!\S)/g;
			var exp  = new RegExp(exp1.source + classname + exp2.source);
			if (targets.length) {
				var i=targets.length; while (i--) {
					targets[i].className = targets[i].className.replace( exp, '' );
				}
			} else {
				targets.className = targets.className.replace( exp, '' );
			}
		}
	};

	var namespace = new NS ( 'lib' );
	namespace.DOM = DOM;

})();
