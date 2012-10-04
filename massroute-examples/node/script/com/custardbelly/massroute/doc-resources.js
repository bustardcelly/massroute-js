var param   = require(process.cwd() + '/module_libs/swagger/paramTypes'),
    log4js  = require('log4js'),
    logger  = log4js.getLogger('doc-resources');

exports.requestRoutes = {
  'spec': {
    "description" : "Requests all routes available from MassDOT service.",
    "path" : "/routes",
    "notes" : "Returns a list of route objects.",
    "summary" : "Find all routes available.",
    "method": "GET",
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
    "path" : "/routes/:routeId",
    "notes" : "Returns a mapped list of destinations based on direction (Inbound/Outbound).",
    "summary" : "Find destinations along route.",
    "method": "GET",
    "params" : [param.path("routeId", "ID of route that is used to find destinations.", "string")],
    "responseClass" : "Object :: {'route':<route object>, 'destinations':{<key>:[<destination object>]}}",
    "errorResponses" : ["{'error':<message>}"],
    "nickname" : "getDestinationsByRoute"
  },
  'action': null
};

exports.findStopsByDestination = {
  'spec': {
    "description" : "Requests stops along route towards destination based on destinationId.",
    "path" : "/routes/:routeId/destinations/:destinationId",
    "notes" : "Returns a list of stops based on directionId.",
    "summary" : "Find stops along route destination.",
    "method": "GET",
    "params" : [param.path("routeId", "ID of route that is used to find destinations.", "string"), param.path("destinationId", "ID of destination that is used to find stops.", "string")],
    "responseClass" : "Object :: {'route':<route object>, 'destination':<destination object>, 'stops':[<stop object>]}",
    "errorResponses" : ["{'error':<message>}"],
    "nickname" : "getStopsByDestination"
  },
  'action': null
};

exports.findPredictionsByStop = {
  'spec': {
    "description" : "Requests predictions for arrival times at a stop along a route.",
    "path" : "/routes/:routeId/destinations/:destinationId/stops/:stopId",
    "notes" : "Returns a list of time-based predictions of arrival at stop.",
    "summary" : "Finds predicted arrival times for stop.",
    "method": "GET",
    "params" : [param.path("routeId", "ID of route that is used to find destinations.", "string"), param.path("destinationId", "ID of destination that is used to find stops.", "string"), param.path("stopId", "ID of stop that is used to find arrival times.", "string")],
    "responseClass" : "Object :: {'routeTitle':<string>, 'stopTitle':<string>, 'dirTag':<string> 'predictions':[<prediction object>]}",
    "errorResponses" : ["{'error':<message>}"],
    "nickname" : "getArrivalTimesForStop"
  },
  'action': null
};