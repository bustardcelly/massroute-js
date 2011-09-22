dojo.provide( "model.session" );

dojo.declare( "model.session.Session", null, {
   constructor: function() {
        this.routes = []; // model.route.Route[]
        this.history = []; // $routTag, $destination, $stopId
        this.currentConfiguration = undefined; // model.routeconfig.RouteConfiguration
        this._configMap = {}; // {$routeTag:XML}
   },
   createConfig: function( xml ) {
      return new model.routeconfig.RouteConfiguration( xml );
   },
   addConfig: function( routeTag, configXML ) {
        this._configMap[routeTag] = configXML;
   },
   getConfig: function( routeTag ) {
        if( this._configMap.hasOwnProperty( routeTag ) ) {
            return this._configMap[routeTag];
        }
        return undefined;
   },
   getRouteFromTag: function( routeTag ) {
      var route;
      var i = this.routes.length;
      while( --i > -1 ) {
         route = this.routes[i];
         if( route.tag == routeTag ) {
            break;
         }
         else {
            route = undefined;
         }
      }
      return route;
   },
   currentState: function() {
      return this.history[this.history.length -1];
   }
});