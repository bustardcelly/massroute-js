(function( $, ko ) {
    
    /** Knockout view models. **/
    // -- KO view model: Routes --
    var routes = {
        title: 'Routes',
        visible: ko.observable(false),
        list: ko.observableArray(),
        selectedItem: ko.observable('')
    };
    routes.select = function( route ) {
        routes.selectedItem( route.tag );
        controller.changeState( model.currentState(), 1 );
    };

    // -- KO view model: Destinations --
    var destinations = {
        title: 'Destinations',
        visible: ko.observable(false),
        inbound: ko.observableArray(),
        outbound: ko.observableArray(),
        selectedItem: ko.observable(undefined)
    };
    destinations.select = function( destination ) {
        destinations.selectedItem( destination );
        controller.changeState( model.currentState(), 1 );
    };
    destinations.clear = function() {
        destinations.inbound([]);
        destinations.outbound([]);
        destinations.selectedItem(undefined);
    }

    // -- KO view model: Stops --
    var stops = {
        title: 'Stops',
        visible: ko.observable(false),
        list: ko.observableArray(),
        selectedItem: ko.observable(undefined)
    };
    stops.select = function( stop ) {
        stops.selectedItem( stop );
        controller.changeState( model.currentState(), 1 );
    };
    stops.clear = function() {
        stops.list([]);
        stops.selectedItem(undefined);
    };

    // -- KO view model: Predictions --
    var predictions = {
        title: 'Predictions',
        visible: ko.observable(false),
        list: ko.observableArray()
    }
    predictions.clear = function() {
        predictions.list([]);
    };

    // -- KO view model --
    var model = {
        title: 'MassRoute',
        states: ['routes', 'destinations', 'stops', 'predictions'],
        currentState: ko.observable('idle'),
        previousState: ko.observable(''),
        history: ko.observableArray(),
        routes: routes,
        destinations: destinations,
        stops: stops,
        predictions: predictions
    };

    var context = new massroute.context.Context();
    var controller = new massroute.controller.AppController( model, context );

    // Ready handler.
    function handleReady() {
        // Apply bindings.
        ko.applyBindings( model );
        // Kick off.
        controller.init();
    }
    
    $().ready( handleReady );
    
})( jQuery, ko );