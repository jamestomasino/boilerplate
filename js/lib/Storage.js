(function () {

	var Storage = function(obj, json){
		return json ? { get: function(key){ return obj[key] && json.parse(obj[key]) },
			set: function(key, data){ obj[key] = json.stringify(data) }
		} : {}
	}( this.localStorage || {}, JSON )

	var namespace = new NS ( 'lib' );
	namespace.Storage = Storage;

})();
