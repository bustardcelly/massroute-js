var http = require('http'),
	express = require('express'),
	promise = require('./promise'),
	app = express(),
	service = require('./com/custardbelly/massroute/service'),
	dispatchOn = (function() {
		return function( response ) {
			return function( json ) {
				response.send( json );
			};
		};
	}()),
	dispatchErrorOn = (function() {
		return function( response ) {
			return function( json ) {
				response.send( json );
			};
		};
	}());

function loadRoutes( req, res, next ) {
	service.getRoutes().then( dispatchOn(res), dispatchErrorOn(res) );
}
function loadDestinations( req, res, next ) {
	service.getDestinations( req.params.routeid ).then( dispatchOn(res), dispatchErrorOn(res) );
}
function loadStops( req, res, next ) {
	var p = req.params;
	service.getStops( p.routeid, p.destinationid ).then( dispatchOn(res), dispatchErrorOn(res) );
}
function loadPredictions( req, res, next ) {
	var p = req.params;
	service.getPredictions( p.routeid, p.destinationid, p.stopid ).then( dispatchOn(res), dispatchErrorOn(res) );
}

// Route listing >
app.get( '/', loadRoutes, function( req, res ) {
	res.send('loading routes');
});
app.get( '/routes', loadRoutes, function( req, res ) {
	res.send('loading routes');
});
// Destination listing by 'name': Inbound/Outbound >
app.get( '/routes/:routeid', loadDestinations, function( req, res ) {
	res.send('destinations along route ' + req.params.routeid);
});
app.get( '/routes/:routeid/destinations', loadDestinations, function( req, res ) {
	res.send('destinations along route ' + req.params.routeid);
});
// Stops listing for destination on route >
app.get( '/routes/:routeid/destinations/:destinationid', loadStops, function( req, res ) {
	res.send('route stops on ' + req.params.destinationid + ' for route ' + req.params.routeid);
});
app.get( '/routes/:routeid/destinations/:destinationid/stops', loadStops, function( req, res ) {
	res.send('route stops on ' + req.params.destinationid + ' for route ' + req.params.routeid);
});
// Predictions listing for stop >
app.get( '/routes/:routeid/destinations/:destinationid/stops/:stopid', loadPredictions, function( req, res ) {
	res.send( 'predictions along stop ' + req.params.stopid + ' along route ' + req.params.routeid );
});
app.get( '/routes/:routeid/destinations/:destinationid/stops/:stopid/predictions', loadPredictions, function( req, res ) {
	res.send( 'predictions along stop ' + req.params.stopid + ' along route ' + req.params.routeid );
});

app.listen(3000);
console.log( app.routes );
console.log("MassRoute middleware server running on port %d in %s mode", '3000', app.settings.env);