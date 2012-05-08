define( ['lib/underscore-1.3.1.min.js', 'com/custardbelly/js/util/DOMElementUtil', 'com/custardbelly/massroute/service/MassRouteService'], 
		function( underscore, domParser, Service ) {

	var exports = {
		arrayUtility: _.noConflict(),
		parser: domParser,
		service: new Service()
	};

	return exports;
});