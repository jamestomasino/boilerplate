(function () {

	var m = function( a, b, c ) {
		b = document;
		c = b.createElement("p");
		c.innerHTML = a;
		a = b.createDocumentFragment();
		while ( b = c.firstChild ) a.appendChild(b);
		return a;
	};

	var g = function( a, b ){
		a = a.match(/^(\W)?(.*)/);
		return( b || document)[ "getElement" + (
		  a[1]
			? a[1] == "#"
			  ? "ById"           // the node by ID,
			  : "sByClassName"   // the nodes by class name, or
			: "sByTagName"       // the nodes by tag name,
		)
	  ]( a[2])                   // called with the name.
	};

	var DOM = {};
	DOM.add = m;
	DOM.get = g;

	var namespace = new NS ( 'lib' );
	namespace.DOM = DOM;

})();
