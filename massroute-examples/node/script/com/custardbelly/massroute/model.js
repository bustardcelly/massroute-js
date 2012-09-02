var _ = require('lodash');

/**
 * RouteConfiguration model, lazily caches and returns stops by destination.
 * @param {String} routeID
 * @param {Object} stops        Object {<stopid>:{}}
 * @param {Aray} destinations
 */
exports.RouteConfiguration = function( routeID, stops, destinations ) {
	var destinationMap,
		destinationStopMap = {};
	return {
		routeID: routeID,
		stops: stops,
		destinations: destinations,
		/**
		 * Returns destination from list based on id.
		 * @param  {String} id
		 * @return {Object}    Destination object
		 */
		getDestinationByID: function( id ) {
			var i = 0,
				item;
			while( i < destinations.length ) {
				item = destinations[i];
				if( id === item.tag ) {
					return item;
				}
				i++;
			}
			return undefined;
		},
		/**
		 * Returns mapped destinations based on Inbound/Outbound or whichever other name associated with destination(s).
		 * @return {Object} Name-based map.
		 */
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
		/**
		 * Returns list of of Stops associated with destination id.
		 * @param  {String} id
		 * @return {Array}  List of stops.
		 */
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