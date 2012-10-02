var fs 				= require('fs'),
	path            = require('path'),
	parser 			= require('libxml-to-js'),
	proxyquire		= require('proxyquire'),
	baseProxyDir 	= '../',
	baseProxyUrl 	= '../script/com/custardbelly/massroute',
	parse_util 		= require(path.join(process.cwd(), baseProxyUrl, '/parse-util.js')),
	supportUrl 		= process.cwd() + '/jasmine/support',
	listRegex 		= /routeList/,
	configRegex 	= /routeConfig/,
	predictionRegex = /predictions/;

exports.service = proxyquire.resolve( baseProxyUrl + '/service.js', baseProxyDir, {'./proxy': {
	requestData: function( options, parseDelegate, deferred ) {
		var responder = parseDelegate(deferred);
		if( options.path.match(listRegex) ) {
			parser(fs.readFileSync( supportUrl + '/routes.xml', 'utf-8' ), responder );
		}
		else if( options.path.match(configRegex) ) {
			parser(fs.readFileSync( supportUrl + '/route_config.xml', 'utf-8'), responder);
		}
		else if( options.path.match(predictionRegex) ) {
			parser(fs.readFileSync( supportUrl + '/predictions.xml', 'utf-8'), responder);
		}
	},
	parse_util: parse_util
}});