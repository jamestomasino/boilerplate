(function () {

	var DOM = {};

	// Usage:
	// var el = DOM.create('<h1>hello world!</h1>');
	// document.body.appendChild(el);

	DOM.create = function( a, b, c ) {
		b = NS.global.document;
		c = b.createElement("p");
		c.innerHTML = a;
		a = b.createDocumentFragment();
		while ( b = c.firstChild ) a.appendChild(b);
		return a;
	};

	// Usage:
	// var el = DOM.get('#someid');
	// var els = DOM.get('.someclass');
	// var els = DOM.get('li', someContextElement);

	DOM.get = function( a, b ){
		var c = a.match(/^(\W)?(.*)/);
		var o;

		if (NS.global.document.getElementsByClassName)
			o = ( b || NS.global.document )[ "getElement" + ( c[1] ? c[1] == "#" ? "ById" : "sByClassName" : "sByTagName") ]( c[2] )
		else
			o = ( b || NS.global.document )["querySelectorAll"]( a );
		return o;
	};

	var namespace = new NS ( 'lib' );
	namespace.DOM = DOM;

})();
