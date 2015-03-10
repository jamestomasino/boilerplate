(function () {

	console.log('DOM');
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
		a = a.match(/^(\W)?(.*)/);
		return ( b || NS.global.document )[ "getElement" + ( a[1] ? a[1] == "#" ? "ById" : "sByClassName" : "sByTagName") ]( a[2] )
	};

	var namespace = new NS ( 'lib' );
	namespace.DOM = DOM;

})();
