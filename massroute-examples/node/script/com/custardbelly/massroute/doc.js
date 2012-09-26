var express 	= require('express'),
	swagger 	= require('swagger'),
	resources 	= require('./doc-resources');

exports.init = function( app, url ) {

	swagger.setAppHandler(app);	
	swagger.addGet( resources.requestRoutes )
		.addGet( resources.findDestinationsByRouteId );

	swagger.configure(url, "0.1");

	// REST docs.
	var docs_handler = express.static(process.cwd() + '/doc/swagger-ui-1.1.0/');
	app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
	  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
	    res.writeHead(302, { 'Location' : req.url + '/' });
	    res.end();
	    return;
	  }
	  // take off leading /docs so that connect locates file correctly
	  req.url = req.url.substr('/docs'.length);
	  return docs_handler(req, res, next);
	});
}