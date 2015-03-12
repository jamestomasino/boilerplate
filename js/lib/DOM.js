(function () {

	var DOM = {};

	// Usage:
	// var el = DOM.create('<h1>hello world!</h1>');
	// document.body.appendChild(el);

	DOM.create = function( str ) {
		var a,b,c;
		b = NS.global.document;
		c = b.createElement("p");
		if (c.innerHTML) c.innerHTML = str;
		else c.innerText = str;
		a = b.createDocumentFragment();
		while ( b = c.firstChild ) a.appendChild(b);
		return a;
	};

	// Usage:
	// var el = DOM.find('#someid');
	// var els = DOM.find('.someclass');
	// var els = DOM.find('li', someContextElement);

	DOM.find = function( a, b ){
		var c = a.match(/^(\W)?(.*)/);
		var o;
		var select = "getElement" + ( c[1] ? c[1] == "#" ? "ById" : "sByClassName" : "sByTagName");

		if (select === "getElementsByClassName" && ! NS.global.document.getElementsByClassName) {
			o = ( b || NS.global.document )["querySelectorAll"]( a );
			if ( /[\ \>]/.test(a) ) {
				console.log('WARNING: Using IE8 querySelectorAll fallback. This only supports simple selectors, not descendants.');
			}
		} else {
			o = ( b || NS.global.document )[select]( c[2] )
		}
		return o;
	};

	var namespace = new NS ( 'lib' );
	namespace.DOM = DOM;

})();
