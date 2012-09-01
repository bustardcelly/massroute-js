/**
 * Defines context for the application with properties used throughout.
 */
define( ['lib/modernizr.custom.46375.js', 
		'lib/path-0.8.4.min',
		'lib/underscore-1.3.1.min', 
		'com/custardbelly/js/util/DOMElementUtil', 
		'com/custardbelly/massroute/service/MassRouteService',
		'require'], 
		function( modernizr, path, underscore, domParser, Service, require ) {

	var exports = {
			arrayUtility: underscore.noConflict(),
			parser: domParser,
			service: new Service(),
			router: undefined,
			completeDelegate: undefined
		};

	Modernizr.load( {
        test: Modernizr.history,
        complete: function() {
        	var module = Modernizr.history ? ['script/app/routing/path-history'] : ['script/app/routing/path-hash'];
        	require( module, function( router ) {
        		router.init();
        		exports.router = router;	
        		exports.completeDelegate();
        	} );
        }
    });

	return exports;
});