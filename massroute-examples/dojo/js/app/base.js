dojo.provide( "app.base" );

dojo.require( "appcontext.massroute" );
dojo.require( "controller.mainview" );
dojo.require( "controller.routeview" );
dojo.require( "controller.destinationview" );
dojo.require( "controller.stopview" );

dojo.ready( function() {

    var view = dojo.byId( 'mainsection' );
        context = new appcontext.massroute.MassRouteContext(),
        states = ["main", "route", "destination", "stop"],
        controllers = {
          main: new controller.mainview.RouteListViewController( states[0], context, view ),
          route: new controller.routeview.RouteViewController( states[1], context, view ),
          destination: new controller.destinationview.DestinationViewController( states[2], context, view ),
          stop: new controller.stopview.StopViewController( states[3], context, view )
        },
        _currentState = '';
        
    // Listen for state change in order to update controller.
    dojo.subscribe( "/massroute/statechange", handleStateChange );
    
    // Event handler for state change.
    function handleStateChange( fromState, direction, fragment ) {
        var state = undefined,
            stateIndex = states.indexOf( fromState );
        
        if( fragment !== undefined && direction > 0 ) {
            context.pushSessionHistory( fragment );
        }
        else if( direction < 0 ) {
            context.popSessionHistory();
        }
        
        console.log( "[massroute.js] :: State change. from: " + fromState + ", at " + stateIndex + "." );
        // find state property in enum.
        if( stateIndex > -1 ) {
            console.log( "[massroute.js] :: Go " + direction + " to " + ( stateIndex + direction ) + "." );
            state = states[stateIndex+direction];
        }
        else {
            console.log( "[massroute.js] :: Go to main." );
            state = "main";
        }
        console.log( "[massroute.js] :: State change. new state: " + state + "." );
        if( controllers.hasOwnProperty( fromState ) ) {
            controllers[fromState].deactivate();
        }
        // access controller base on state.
        if( controllers.hasOwnProperty( state ) ) {
            console.log( "[massroute.js] :: Activate: " + state + "." );
            controllers[state].activate();
            _currentState = state;
        }
    }
    
    dojo.subscribe( "/massroute/nav/back", function() {
        dojo.publish( "/massroute/statechange", [_currentState, -1] );
    });
    
    dojo.subscribe( "/massroute/nav/forward", function( viewstate, tag ) {
        dojo.publish( "/massroute/statechange", [viewstate, 1, tag] );
    });
    
    // Once ready, request first state.
    dojo.publish( "/massroute/statechange", [_currentState, 0] );
});