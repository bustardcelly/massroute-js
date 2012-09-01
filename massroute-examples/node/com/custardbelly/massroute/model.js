var _ = require('lodash');

/**
 * RouteConfiguration model, lazily caches and returns stops by destination.
 * @param {[type]} routeID      String
 * @param {[type]} stops        Object {<stopid>:{}}
 * @param {[type]} destinations Array
 */
exports.RouteConfiguration = function( routeID, stops, destinations ) {
	var destinationMap,
		destinationStopMap = {};
	return {
		routeID: routeID,
		stops: stops,
		destinations: destinations,
		getDestinationByID: function( id ) {
			var i = 0,
				item;
			while( i < destinations.length - 1 ) {
				item = destinations[i];
				if( id === item.tag ) {
					return item;
				}
				i++;
			}
			return undefined;
		},
		getDestinations: function() {
			if( !destinationMap ) {
				destinationMap = {};
				_.each(this.destinations, function(item) {
					if( !destinationMap.hasOwnProperty(item.name) ) {
						destinationMap[item.name] = [];
					}
					destinationMap[item.name].push(item);
				});
			}
			return destinationMap;
		},
		stopsByDestination: function ( id ) {
			if( !destinationStopMap.hasOwnProperty( id ) ) {
				var list = [],
					destination = this.getDestinationByID( id );
				if( destination ) {
					_.each( destination.stop, function( item ) {
						list[list.length] = stops[item.tag];
					});
				}
				destinationStopMap[id] = list;
			}
			return destinationStopMap[id];
		}
	};
};