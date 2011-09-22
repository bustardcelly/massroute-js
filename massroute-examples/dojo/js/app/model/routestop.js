dojo.provide( "model.routestop" );

dojo.declare( "model.routestop.RouteStop", null, {
    constructor: function( xml ) {
        this.tag = '';
        this.title = '';
        this.latitude = '';
        this.longitude = '';
        this.stopId = '';
        
        if( typeof xml != 'undefined' ) {
            this.inflate( xml );
        }
    },
    inflate: function( xml ) {
        if( dojo.hasAttr( xml, 'tag' ) ) this.tag = dojo.attr( xml, 'tag' );
        if( dojo.hasAttr( xml, 'title' ) ) this.title = dojo.attr( xml, 'title' );
        if( dojo.hasAttr( xml, 'lat' ) ) this.latitude = dojo.attr( xml, 'lat' );
        if( dojo.hasAttr( xml, 'lon' ) ) this.longitude = dojo.attr( xml, 'lon' );
        if( dojo.hasAttr( xml, 'stopId' ) ) this.stopId = dojo.attr( xml, 'stopId' );
    }
});