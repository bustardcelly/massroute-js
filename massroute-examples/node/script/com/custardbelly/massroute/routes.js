var promise = require('promise'),
	service = require('./service'),
	renderError = (function() {
		return function( response ) {
			return function( error ) {
				response.format({
				  html: function(){
				    response.render('error', error );
				  },
				  json: function(){
				    response.send( JSON.stringify(error) );
				  }
				});
			};
		};
	}());

function renderRoutes( request, response ) {
	return function( result ) {
		response.format({
		  html: function(){
		    response.render('routes', {routes:result});
		  },
		  json: function(){
		    response.send( JSON.stringify(result) );
		  }
		});
	}
}

function renderDestinations( request, response ) {
	return function( result ) {
		response.format({
		  html: function(){
		    response.render('destinations', {destinations:result});
		  },
		  json: function(){
		    response.send( JSON.stringify(result) );
		  }
		});
	}
}

function renderStops( request, response ) {
	return function( result ) {
		response.format({
		  html: function(){
		  	response.render('stops', {stops:result});
		  },
		  json: function(){
		    response.send( JSON.stringify(result) );
		  }
		});
	}
}

function renderPredictions( request, response ) {
	return function( result ) {
		response.format({
		  html: function(){
		  	response.render('predictions', {predictions:result});
		  },
		  json: function(){
		    response.send( JSON.stringify(result) );
		  }
		});
	}
}

exports.routes = function( req, res ) {
	service.getRoutes().then( renderRoutes(req,res), renderError(res) );
};

exports.destinations = function( req, res ) {
	service.getDestinations( req.params.routeid ).then( renderDestinations(req,res), renderError(res) );
};

exports.stops = function( req, res ) {
	var p = req.params;
	service.getStops( p.routeid, p.destinationid ).then( renderStops(req,res), renderError(res) );
};

exports.predictions = function( req, res ) {
	var p = req.params;
	service.getPredictions( p.routeid, p.destinationid, p.stopid ).then( renderPredictions(req,res), renderError(res) );
};