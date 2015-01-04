console.log ('test1');

require(['app/Main'], function (Main) {
	console.log('test2');
	Main();
});
