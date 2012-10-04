var http 		  = require('http'),
	url 		    = require('url'),
	express 	  = require('express'),
	partials 	  = require('express-partials'),
	app 		    = express(),
	controller	= require('./script/com/custardbelly/massroute/controller'),
  docs        = require('./script/com/custardbelly/massroute/doc'),
	log4js 		  = require('log4js'),
	logger 	 	  = log4js.getLogger('index'),
  port        = 3001;

// Middleware to bring Express 3.0 partials back.
app.use( partials() );

// Use EJS templates.
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );
// Define public files for urls in templates.
app.use( app.router );
app.use( express.static(__dirname + '/public') );
app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );

// Route listing >
app.get( '/', controller.routes );
app.get( '/routes', controller.routes );
// Destination listing by 'name': Inbound/Outbound >
app.get( '/routes/:routeid', controller.destinations );
app.get( '/routes/:routeid/destinations', controller.destinations );
// Stops listing for destination on route >
app.get( '/routes/:routeid/destinations/:destinationid', controller.stops );
app.get( '/routes/:routeid/destinations/:destinationid/stops', controller.stops );
// Predictions listing for stop >
app.get( '/routes/:routeid/destinations/:destinationid/stops/:stopid', controller.predictions );
app.get( '/routes/:routeid/destinations/:destinationid/stops/:stopid/predictions', controller.predictions );

// Fault >
app.use( function(err, req, res, next){
  logger.error(err.stack);
  res.send(500, 'something broke!');
});
app.use( function(req, res, next){
  res.send(404, 'page not found');
});

// Start >
docs.init(app, 'http://localhost:' + port);
app.listen(port);
logger.info("MassRoute middleware server running on port %d in %s mode", port, app.settings.env);