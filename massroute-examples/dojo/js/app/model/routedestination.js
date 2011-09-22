dojo.provide( 'model.routedestination' );

dojo.require( "model.routestop" );

dojo.declare( 'model.routedestination.RouteDestination', null, {
    constructor: function( xml ) {
        this.tag = '';
        this.name = '';
        this.title = '';
        this.stops = []; // model.routestop.RouteStop:$tag[]
        
        if( typeof xml != 'undefined' ) {
            this.inflate( xml );
        }
    },
    inflate: function( xml ) {
        var self = this;
        this.tag = dojo.attr( xml, 'tag' );
        this.title = dojo.attr( xml, 'title' );
        this.name = dojo.attr( xml, 'name' );
        dojo.query( 'stop', xml ).forEach( function( node, index ) {
             self.stops[self.stops.length] = dojo.attr( node, 'tag' );
        });
    }
});