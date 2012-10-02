var model 		= require('./model'),
	proxy		= require('./proxy'),
	parse_util	= proxy.parse_util,
	defer 		= require('promise').execute,
	routeList,
	configurations = {}, // {<routeid>:model.RouteConfiguration}
	destPath = '/service/publicXMLFeed?command=routeConfig&a=mbta&r={0}',
	predPath = '/service/publicXMLFeed?command=predictions&a=mbta&r={0}&s={1}',
	routeOptions = {
		host: 'webservices.nextbus.com',
		path: '/service/publicXMLFeed?command=routeList&a=mbta'
	},
	destOptions = { host: 'webservices.nextbus.com' },
	predOptions = { host: 'webservices.nextbus.com' },
	log4js 	= require('log4js-node'),
	logger  = log4js.getLogger('service');

function parseRoutes( deferred ) {
	return function( error, result ) {
		if( error ) { 
			deferred( {error:error} );
		}
		else {
			routeList = parse_util.mapResult( result.route );
			logger.debug( 'Routes loaded. Total: ' + routeList.length );
			deferred(null, routeList);
		}
	};
}

function parseDestinations( deferred ) {
	return function( error, result ) {
		if( error ) { 
			deferred( {error:error} );
		}
		else {
			var route = result.route["@"],
				stops = result.route.stop,
				directions = result.route.direction,
				configuration;

			logger.debug( "Configuration loaded for " + route.tag + "." );
			if( !configurations.hasOwnProperty(route.tag) ) {
				configurations[route.tag] = model.RouteConfiguration( route.tag, parse_util.arrayToKeyMap(stops, 'tag'), parse_util.listDirectionsResult(directions) );
			}
			configuration = configurations[route.tag];
			deferred(null, {
				route:route, 
				destinations:configuration.getDestinations()
			});
		}
	};
}

function parsePredictions( deferred ) {
	return function( error, result ) {
		if( error ) {
			deferred( {error:error} );
		}
		else {
			deferred( null, parse_util.mapPredictionResult(result.predictions) );
		}
	};
}

exports.getRoutes = function() {

	logger.debug( "Requesting routes..." );
	if( routeList && routeList.length !== 0 ) {
		logger.debug( "Returning cached routes." );
		return defer( function(deferred) {
			deferred( null, routeList );
		});
	}
	else {
		return defer( proxy.requestData, routeOptions, parseRoutes );
	}
};

exports.getDestinations = function( routeID ) {

	logger.debug( "Requesting destinations (configuration) for Route " + routeID + "..." );
	if( configurations && configurations.hasOwnProperty( routeID ) ) {
		logger.debug( "Configuration already loaded for Route " + routeID + "." );
		return defer( function(deferred) {
			deferred( null, {
				route: {title: routeID, tag: routeID},
				destinations:configurations[routeID].getDestinations()
			});
		});
	}
	else {
		destOptions.path = destPath.replace('{0}', routeID);
		return defer( proxy.requestData, destOptions, parseDestinations );
	}
};

exports.getStops = function( routeID, destinationID ) {

	var configuration;

	logger.debug( "Requesting stops along " + routeID + " for destination " + destinationID );
	if( configurations && configurations.hasOwnProperty( routeID ) ) {
		configuration = configurations[routeID];
		logger.debug( "Stops already cached for Route " + routeID +
						" on destination " + destinationID + ". Returning cache..." );
		return defer( function(deferred) {
			deferred( null, {
				route: {title: routeID, tag: routeID},
				destination: configuration.getDestinationByID( destinationID ),
				stops: configuration.stopsByDestination( destinationID )
			});
		});
	}
	else {
		return this.getDestinations( routeID ).then( function() {
			configuration = configurations[routeID];
			if( configuration ) {
				logger.debug( "Configuration loaded and returning for stops along Route " + routeID + 
								" on destination " + destinationID );
				return {
					route: {title: routeID, tag: routeID},
					destination: configuration.getDestinationByID( destinationID ),
					stops: configuration.stopsByDestination( destinationID )
				};
			}
		});
	}
};

exports.getPredictions = function( routeID, destinationID, stopID ) {
	logger.debug( "Requesting predictions for stop " + stopID + " along Route " + routeID +
					" on destination " + destinationID + "..." );
	return this.getStops( routeID, destinationID ).then( function() {
		predOptions.path = predPath.replace('{0}', routeID).replace('{1}', stopID);
		return defer( proxy.requestData, predOptions, parsePredictions );
	});
};