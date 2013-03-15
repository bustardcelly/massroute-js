var _       = require('lodash'),
    log4js  = require('log4js'),
    logger  = log4js.getLogger('service');

/**
 * Converts a list of objects to a keyed map based on provided key value.
 * @param  {Array} list    List of objects
 * @param  {String} itemKey The property name to be used as a key in the map.
 * @return {Object}         Mapped object with provided itemKey as the key and object inlist as value.
 */
exports.arrayToKeyMap = function( list, itemKey ) {
    var map = {}, ls = this.mapResult(list);
    _.each( ls, function( item ) {
        map[item[itemKey]] = item;
    });
    return map;
};

/**
 * Returns object represented by the @ character which is a result of the libxml-to-js parser.
 * @param  {Array} list List of objects that each are keyed with a @ character.
 * @return {Object}      Object held under the @ key.
 */
exports.mapResult = function( list ) {
    if( list instanceof Array ) {
        return _.map( list, function( value ) {
            return value["@"];
        });
    }
    else {
        return list["@"];
    }
};

/**
 * Bases prediction item and appends the list of predictions to the object.
 * @param  {Object} item Parsed XML object for prediction
 * @param {String} dirTag Associated direction id of route/direction.
 * @return {Object}      Prediction object with properly parsed list of predictions.
 */
exports.mapPredictionResult = function( item, dirTag ) {
    var prediction,
        directions, 
        i, length, direction,
        j, predLength, pred, predictions = [];
    // [2013-03-16] change to return data 
    /* 
    prediction.predictions = (item.direction) ? this.mapResult(item.direction.prediction) : [];
    */
    // select all where direction.predictions.@['dirTag'] == dirId;
    prediction = item["@"];
    directions = item.direction;
    length = (directions) ? directions.length : 0;
    if(length === 0) {
        // try old way:
        try {
            prediction.predictions = (item.direction) ? this.mapResult(item.direction.prediction) : [];
        }
        catch(e) {
            logger.error('Error in requesting prediction: ' + e.message);
            logger.info('Returned prediction data: ' + JSON.stringify(item, null, 2));
        }
    }
    else {
        logger.info('parsing with new API. dirTag: ' + dirTag);
        for(i = 0; i < length; i++) {
            direction = directions[i];
            predLength = direction.prediction.length;
            for(j = 0; j < predLength; j++) {
                pred = direction.prediction[j];
                if(pred["@"].dirTag === dirTag) {
                    predictions.push(pred);
                }
            }
        }
        prediction.predictions = this.mapResult(predictions);
    }
    return prediction;
};

/**
 * Returns a list of direction objects from either a list or map of parsed directions.      
 * @param  {Array|Object} list An array or object representing a list of directions.        
 * @return {Array}      A list of mapped directions based on parser results.
 */
exports.listDirectionsResult = function( list ) {
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
};