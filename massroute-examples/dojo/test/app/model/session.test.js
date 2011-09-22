dojo.require( "model.session" );
dojo.require( "model.route" );

doh.register( "massroute.tests.Session",
[
    {
        name: "model.session.Session [init]",
        timeout: 3000,
        runTest: function() {
            var session = new model.session.Session();
            doh.assertTrue( ( typeof session.routes != 'undefined' ) );
            doh.assertTrue( ( typeof session.history != 'undefined' ) );
            doh.assertTrue( ( typeof session.configuration == 'undefined' ) );
        }
    },
    {
        name: "model.session.Session [config add]",
        timeout: 3000,
        runTest: function() {
            var session = new model.session.Session();
            var fragment = "<test>xml</test>";
            session.addConfig( "test", fragment );
            doh.assertEqual( session.getConfig( "test" ), fragment );
        }
    },
    {
        name: "model.session.Session [route from tag]",
        timeout: 3000,
        runTest: function() {
            var session = new model.session.Session();
            var route = new model.route.Route( "test", "Route Test" );
            session.routes[session.routes.length] = route;
            doh.assertEqual( session.getRouteFromTag( "test" ), route );
        }
    }
]);