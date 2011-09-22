dojo.provide( 'controller.destinationview' );

dojo.require( 'controller.base' );
dojo.require( 'renderer.listrenderer' );

dojo.declare( 'controller.destinationview.DestinationViewController', [controller.base.BaseViewController], {
    constructor: function( context, element ) {
        this._listElement = undefined;
    },
    _clear: function() {
        dojo.empty( this._listElement );
    },
    _fill: function( items /* model.route.RouteStop[] */ ) {
        var self = this,
            listItem,
            listParent = this._listElement.parentNode;
        listParent.removeChild( this._listElement );
        
        dojo.forEach( items, function( item /* model.route.RouteStop[] */, index ) {
            listItem = new renderer.listrenderer.LabelListItemRenderer( {
                tag: item.tag,
                title: item.title,
                eventType: self.viewstate
            } );
            listItem.placeAt( self._listElement );
        });
        
        listParent.appendChild( this._listElement );
    },
    populate: function( items /* model.route.RouteStop[] */ ) {
        this._clear();
        this._fill( items );
    },
   activate: function() {
        var self = this,
            loadingFrag = '<p>loading...</p>',
            fragment = undefined,
            destinationTag = this.context.session.currentState(),
            destination = this.context.session.currentConfiguration.findDestinationByTag( destinationTag );
            
        if( ( typeof routeTag ) != undefined ) {
            fragment = "<header><h1>Showing Stops along: " + destination.title + "</h1>" +
                        "<nav><a id=\"dv_backbutton\" href=\"#\">back to destinations</a></nav></header>" +
                        "<ul id=\"destlist\"></ul>";
            
            dojo.place( loadingFrag, self.element, "only" );
            
            // Request. 
            dojo.when( self.context.controller.getStops( destinationTag ),
                function( result ) {
                    console.log( "[" + self.toString() + "] :: Stops returned Amount: " + result.length + "." );
                    // push fragment to DOM within target element.
                    self._ui = dojo.place( fragment, self.element, "only" );
                    // Hold reference to lists.
                    self._listElement = dojo.byId( "destlist" );
                    // Attach handler for internal back.
                    self._backEventHandler = dojo.connect( dojo.byId("dv_backbutton"), 'onclick',  self, '_handleBack' );
                    // Populate.
                    self.populate( result );
                },
                function( error ) {
                    console.log( "[" + self.toString() + "] :: Error getting stops for " + destinationTag + ": " + error + "."); 
                }
            );
        }
   },
   deactivate: function() {
        this._clear();
        if( typeof this._listElement != 'undefined' ) {
            dojo.destroy( this._listElement );
        }
        this.inherited( 'deactivate', arguments );
   },
   toString: function() {
    return "controller.routeview.DestinationViewController";
   }
});