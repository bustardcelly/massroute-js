dojo.provide( "appcontext.massroute" );

dojo.require( "model.session" );
dojo.require( "service.mbta" );
dojo.require( "controller.massroute" );

dojo.declare( "appcontext.massroute.MassRouteContext", null, {
    constructor: function() {
        this.session = new model.session.Session();
        this.service = new service.mbta.Service();
        this.controller = new controller.massroute.MassRouteController( this.session, this.service );
    },
    pushSessionHistory: function( fragment ) {
        this.session.history.push( fragment );
        console.info( "[" + this.toString() + "] :: Session history - " + this.session.history + "." );
    },
    popSessionHistory: function() {
        this.session.history.pop();
        console.info( "[" + this.toString() + "] :: Session history - " + this.session.history + "." );
    },
    toString: function() {
        return "appcontext.massroute.MassRouteContext";
    }
});