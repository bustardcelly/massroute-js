var fs = require('fs'),
	parser 	= require('libxml-to-js'),
	proxyquire = require('proxyquire'),
	baseProxyDir = '../',
	baseProxyUrl = '../script/com/custardbelly/massroute',
	supportUrl = process.cwd() + '/jasmine/support';

exports.supportUrl = supportUrl;
exports.controller = proxyquire.resolve( baseProxyUrl + '/controller.js', baseProxyDir, {'./service': {
		getRoutes: function() {
			return {
				then: function( success, fault ) {
					parser(fs.readFileSync( supportUrl + '/routes.xml', 'utf-8' ), function(err,result) {
						success.call(err, result);
					});
				}
			};
		},
		getDestinations: function( routeID ) {
			return {
				then: function( success, fault ) {
					parser(fs.readFileSync( supportUrl + '/route_config.xml', 'utf-8'), function(err, result) {
						success.call(err, result);
					});
				}
			};
		},
		getPredictions: function( routeID, destinationID, stopID ) {
			return {
				then: function( success, fault ) {
					parser(fs.readFileSync( supportUrl + '/predictions.xml', 'utf-8'), function(err, result) {
						success.call(err, result);
					});
				}
			};
		}
	}
});