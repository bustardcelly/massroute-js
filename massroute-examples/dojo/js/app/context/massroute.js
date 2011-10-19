dojo.provide( "appcontext.massroute" );

dojo.require( "model.session" );
dojo.require( "service.mbta" );
dojo.require( "controller.massroute" );

( function() {
    
    var _session = new model.session.Session();

dojo.declare( "appcontext.massroute.MassRouteContext", null, {
    constructor: function() {
        
        this.service = new service.mbta.Service();
        this.controller = new controller.massroute.MassRouteController( _session, this.service );
    },
    pushSessionHistory: function( fragment ) {
        _session.history.push( fragment );
        console.info( "[" + this.toString() + "] :: Session history - " + _session.history + "." );
    },
    popSessionHistory: function() {
        _session.history.pop();
        console.info( "[" + this.toString() + "] :: Session history - " + _session.history + "." );
    },
    toString: function() {
        return "appcontext.massroute.MassRouteContext";
    }
});

})();