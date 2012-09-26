var _ 		= require('lodash'),
	log4js 	= require('log4js-node'),
	logger  = log4js.getLogger('service');

exports.arrayToKeyMap = function( list, itemKey ) {
	var map = {}, ls = this.mapResult(list);
	_.each( ls, function( item ) {
		map[item[itemKey]] = item;
	});
	return map;
}

exports.mapResult = function( list ) {
	return _.map( list, function( value ) {
		return value["@"];
	});
}

exports.mapPredictionResult = function( item ) {
	var prediction, predictions = [];
	prediction = item["@"];
	prediction.predictions = (item.direction) ? this.mapResult(item.direction.prediction) : [];
	return prediction;
}

exports.mapDirectionsResult = function( list ) {
	var dir, 
		directions = [],
		self = this;
	if( list instanceof Array ) {
		_.each( list, function( item ) {
			dir = item["@"];
			dir.stop = self.mapResult(item.stop);
			directions[directions.length] = dir;
		});
	}
	else {
		try {
			dir = list["@"];
			dir.stop = self.mapResult(list.stop);
			directions[directions.length] = dir;
		}
		catch( e ) {
			logger.error( 'Error in parsing direction. [REASON] :: ' + e.message );
		}
	}
	return directions;
}