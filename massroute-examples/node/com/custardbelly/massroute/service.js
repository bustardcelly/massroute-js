var http 	= require('http'),
	parser 	= require('libxml-to-js'),
	model 	= require('./model'),
	_ 		= require('lodash'),
	defer = require('../../../promise').execute,
	routeList, 
	configurations = {}, // {<routeid>:model.RouteConfiguration}
	routesPath = {
		host: 'webservices.nextbus.com',
		path: '/service/publicXMLFeed?command=routeList&a=mbta'
	},
	destPath = {
		host: 'webservices.nextbus.com',
		path: '/service/publicXMLFeed?command=routeConfig&a=mbta&r={0}'
	},
	predictionsPath = {
		host: 'webservices.nextbus.com',
		path: '/service/publicXMLFeed?command=predictions&a=mbta&r={0}&s={1}'
	};

function requestData( options, parseDelegate, deferred ) {
	http.get( options, function( http_res ) {
		var data = '';
	    http_res.on('data', function(chunk) {
	        data += chunk;
	    })
	    .on('end', function() {
	    	parser( data, parseDelegate(deferred) );
	    });
	})
	.on('error', function(e) {
	  deferred( JSON.stringify({error:e.message}) );
	});
}

function mapDirectionsResult( list ) {
	var dir, directions = [];
	_.each( list, function( item ) {
		dir = item["@"];
		dir.stop = mapResult(item.stop);
		directions[directions.length] = dir;
	});
	return directions;
}

function mapPredictionResult( item ) {
	var prediction, predictions = [];
	prediction = item["@"];
	prediction.predictions = mapResult(item.direction.prediction);
	return prediction;
}

function mapResult( list ) {
	return _.map( list, function( value ) {
		return value["@"];
	});
}

function arrayToTagMap( list ) {
	var map = {}, ls = mapResult(list);
	_.each( ls, function( item ) {
		map[item.tag] = item;
	});
	return map;
}

function parseRoutes( deferred ) {
	return function( error, result ) {
		if( error ) { 
			deferred( JSON.stringify({error:error}) );
		}
		else {
			routeList = mapResult( result.route );
			deferred(null, JSON.stringify(routeList) );
		}
	};
}

function parseDestinations( deferred ) {
	return function( error, result ) {
		if( error ) { 
			deferred( JSON.stringify({error:error}) );
		}
		else {
			var route = result.route["@"],
				stops = result.route.stop,
				directions = result.route.direction,
				configuration;
			
			if( !configurations.hasOwnProperty(route.tag) ) {
				configurations[route.tag] = model.RouteConfiguration( route.tag, arrayToTagMap(stops), mapDirectionsResult(directions) );
			}
			configuration = configurations[route.tag];
			deferred(null, JSON.stringify(configuration.getDestinations()) );
		}
	};
}

function parsePredictions( deferred ) {
	return function( error, result ) {
		if( error ) {
			deffered( JSON.stringify({error:error}) );
		}
		else {
			deferred( null, JSON.stringify(mapPredictionResult(result.predictions)) );
		}
	};
}

exports.getRoutes = function() {

	if( routeList && routeList.length !== 0 ) {
		return defer( function(deferred) {
			deferred( null, JSON.stringify(routeList) );
		});
	}
	else {
		return defer( requestData, routesPath, parseRoutes );
	}
};

exports.getDestinations = function( routeID ) {

	if( configurations && configurations.hasOwnProperty( routeID ) ) {
		return defer( function(deferred) {
			deferred( null, JSON.stringify(configurations[routeID].getDestinations()) );
		});
	}
	else {
		destPath.path = destPath.path.replace('{0}', routeID);
		return defer( requestData, destPath, parseDestinations );
	}
};

exports.getStops = function( routeID, destinationID ) {

	if( configurations && configurations.hasOwnProperty( routeID ) ) {
		return defer( function(deferred) {
			deferred( null, JSON.stringify(configurations[routeID].stopsByDestination( destinationID )) );
		});
	}
	else {
		return this.getDestinations( routeID ).then( function() {
			var configuration = configurations[routeID];
			if( configuration ) {
				return JSON.stringify(configuration.stopsByDestination( destinationID ));
			}
		});
	}
};

exports.getPredictions = function( routeID, destinationID, stopID ) {

	return this.getStops( routeID, destinationID ).then( function() {
		predictionsPath.path = predictionsPath.path.replace('{0}', routeID).replace('{1}', stopID);
		return defer( requestData, predictionsPath, parsePredictions );
	});
};