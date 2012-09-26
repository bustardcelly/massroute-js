var param   = require(process.cwd() + '/module_libs/swagger/paramTypes'),
    log4js  = require('log4js-node'),
    logger  = log4js.getLogger('doc-resources');

exports.requestRoutes = {
  'spec': {
    "description" : "Requests all routes available from MassDOT service.",
    "path" : "/routes.json",
    "notes" : "Returns a list of route objects.",
    "summary" : "Find all routes available.",
    "method": "get",
    "params" : [],
    "responseClass" : "Object :: {'tag':<value>, 'title':<value>}",
    "errorResponses" : ["{'error':<message>}"],
    "nickname" : "getRoutes"
  },
  'action': null
};

exports.findDestinationsByRouteId = {
  'spec': {
    "description" : "Requests destinations based on route id.",
    "path" : "/routes.json/{routeId}",
    "notes" : "Returns a mapped list of destinations based on direction (Inbound/Outbound).",
    "summary" : "Find destinations along route.",
    "method": "get",
    "params" : [param.path("routeId", "ID of route that is used to find destinations.", "string")],
    "responseClass" : "Object :: {'route':<route object>, 'destinations':{<key>:[<destination object>]}}",
    "errorResponses" : ["{'error':<message>}"],
    "nickname" : "getDestinationsByRoute"
  },
  'action': null
};