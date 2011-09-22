dojo.require( "appcontext.massroute" );

doh.register("massroute.tests.MassRouteContext",
[
    {
        name: "appcontext.massroute.MassRouteContext [init]",
        timeout: 3000,
        runTest: function() {
            var context = new appcontext.massroute.MassRouteContext();
            doh.assertTrue( ( typeof context.session != 'undefined' ) );
            doh.assertTrue( ( typeof context.service != 'undefined' ) );
            doh.assertTrue( ( typeof context.controller != 'undefined' ) );
        }
    },
    {
        name: "appcontext.massroute.MassRouteContext [history push]",
        timeout: 3000,
        runTest: function() {
            var context = new appcontext.massroute.MassRouteContext();
            context.pushSessionHistory( "/test" );
            doh.assertEqual( "/test", context.session.currentState() );
        }
    },
    {
        name: "appcontext.massroute.MassRouteContext [history pop]",
        timeout: 3000,
        runTest: function() {
            var context = new appcontext.massroute.MassRouteContext();
            context.pushSessionHistory( "/test" );
            context.popSessionHistory();
            doh.assertEqual( 0, context.session.history.length );
        }
    }
]);
