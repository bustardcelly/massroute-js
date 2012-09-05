var http 		= require('http'),
	express 	= require('express'),
	partials 	= require('express-partials'),
	app 		= express(),
	routes 		= require('./script/com/custardbelly/massroute/routes'),
	log4js 		= require('log4js-node'),
	logger 	 	= log4js.getLogger('index');

app.use( partials() );

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

app.use( app.router );
app.use( express.static(__dirname + '/public') );
app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );

// Route listing >
app.get( '/', routes.routes );
app.get( '/routes', routes.routes );
// Destination listing by 'name': Inbound/Outbound >
app.get( '/routes/:routeid', routes.destinations );
app.get( '/routes/:routeid/destinations', routes.destinations );
// Stops listing for destination on route >
app.get( '/routes/:routeid/destinations/:destinationid', routes.stops );
app.get( '/routes/:routeid/destinations/:destinationid/stops', routes.stops );
// Predictions listing for stop >
app.get( '/routes/:routeid/destinations/:destinationid/stops/:stopid', routes.predictions );
app.get( '/routes/:routeid/destinations/:destinationid/stops/:stopid/predictions', routes.predictions );

app.use( function(err, req, res, next){
  logger.error(err.stack);
  res.send(500, 'Something broke!');
});
app.use( function(req, res, next){
  res.send(404, 'page not found');
});

app.listen(3000);
logger.info("MassRoute middleware server running on port 3000 in %s mode", app.settings.env);