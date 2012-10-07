var fs              = require('fs'),
    path            = require('path'),
    parser          = require('libxml-to-js'),
    proxyquire      = require('proxyquire'),
    baseProxyDir    = process.cwd(),
    baseProxyUrl    = baseProxyDir + '/script/com/custardbelly/massroute',
    parse_util      = require(path.join(baseProxyUrl, '/parse-util.js')),
    supportUrl      = baseProxyDir + '/test/jasmine/support',
    listRegex       = /routeList/,
    configRegex     = /routeConfig/,
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