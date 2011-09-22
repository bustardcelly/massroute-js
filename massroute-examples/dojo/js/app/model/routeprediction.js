dojo.provide( "model.routeprediction" );

dojo.declare( 'model.routeprediction.StopPrediction', null, {
    constructor: function( xml ) {
        this.seconds = 0;
        this.minutes = 0;
        this.epochTime = '';
        this.isDeparture = false;
        this.dirTag = '';
        this.affectedByLayover = false;
        this.delayed = false;
        this.slowness = 0;
        
        if( (typeof xml != 'undefined' ) ) {
            this.inflate( xml );
        }
    },
    inflate: function( xml ) {
        if( dojo.hasAttr( xml, 'seconds' ) ) {
            this.seconds = Number(dojo.attr( xml, 'seconds' ));
        }
        if( dojo.hasAttr( xml, 'minutes' ) ) {
            this.minutes = Number(dojo.attr( xml, 'minutes' ));
        }
        if( dojo.hasAttr( xml, 'epochTime' ) ) this.epochTime = dojo.attr( xml, 'epochTime' );
        if( dojo.hasAttr( xml, 'isDeparture' ) ) {
            this.isDeparture = dojo.attr( xml, 'isDeparture' ) === 'true' ? true : false;
        }
        if( dojo.hasAttr( xml, 'affectedByLayover' ) ) {
            this.affectedByLayover = dojo.attr( xml, 'affectedByLayover' ) == 'true' ? true : false;
        }
        if( dojo.hasAttr( xml, 'delayed' ) ) {
            this.delayed = dojo.attr( xml, 'delayed' ) == 'true' ? true : false;
        }
        if( dojo.hasAttr( xml, 'slowness' ) ) {
            this.slowness = Number(dojo.attr( xml, 'slowness' ));
        }
    }
});