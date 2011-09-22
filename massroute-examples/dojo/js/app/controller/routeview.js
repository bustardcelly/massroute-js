dojo.provide( "controller.routeview" );

dojo.require( "controller.base" );
dojo.require( "util.array" );
dojo.require( "renderer.listrenderer" );

dojo.declare( "controller.routeview.RouteViewController", [controller.base.BaseViewController], {
   constructor: function( context, element ) {
        this._inboundListElement = undefined;
        this._outboundListElement = undefined;
   },
   _clear: function() {
        dojo.empty( this._inboundListElement );
        dojo.empty( this._outboundListElement );
    },
    _fillOnList: function( items /* model.route.RouteDestination[] */ , listElement ) {
        var self = this,
            listItem,
            listParent = listElement.parentNode;
        listParent.removeChild( listElement );
        
        dojo.forEach( items, function( item /* model.route.RouteDestination[] */, index ) {
            listItem = new renderer.listrenderer.LabelListItemRenderer( {
                tag: item.tag,
                title: item.title,
                eventType: self.viewstate
            } );
            listItem.placeAt( listElement );
        });
        
        listParent.appendChild( listElement );
    },
    populate: function( items /* model.route.RouteDestination[] */ ) {
        this._clear();
        // Fill inbound.
        this._fillOnList( items.filter( function( element ) {
            return element.name === 'Inbound';
        }), this._inboundListElement );
        // Fill outbound.
        this._fillOnList( items.filter( function( element ) {
            return element.name === 'Outbound';
        }), this._outboundListElement );
    },
   activate: function() {
        var self = this,
            loadingFrag = '<p>loading...</p>',
            fragment = undefined,
            routeTag = this.context.session.currentState();
            
        if( ( typeof routeTag ) != undefined ) {
            fragment = "<header><h1>Showing Destinations for Route: " + this.context.session.getRouteFromTag( routeTag ).title + "</h1>" +
                        "<nav><a id=\"rv_backbutton\" href=\"#\">back to routes</a></nav></header>" +
                        "<nav><h1>Inbound</h1><ul id=\"inboundlist\"></ul></nav>" +
                        "<nav><h1>Outbound</h1><ul id=\"outboundlist\"></ul></nav>";
            
            dojo.place( loadingFrag, this.element, "only" );
            
            // Request. 
            dojo.when( self.context.controller.getConfig( routeTag ),
                function( config ) {
                    // push fragment to DOM within target element.
                    self._ui = dojo.place( fragment, self.element, "only" );
                    // Hold reference to lists.
                    self._inboundListElement = dojo.byId( "inboundlist" );
                    self._outboundListElement = dojo.byId( "outboundlist" );
                    // Attach handler for internal back.
                    self._backEventHandler = dojo.connect( dojo.byId("rv_backbutton"), 'onclick', self, '_handleBack' );
                    // populate
                    self.populate( config.destinations );
                },
                function( error ) {
                    console.log( "[" + self.toString() + "] :: Error getting config: " + error + "."); 
                }
            );
        }
   },
   deactivate: function() {
        this._clear();
        if( typeof this._inboundListElement != 'undefined' ) {
            dojo.destroy( this._inboundListElement );
        }
        if( typeof this._outboundListElement != 'undefined' ) {
            dojo.destroy( this._outboundListElement );
        }
        this.inherited( 'deactivate', arguments );
   },
   toString: function() {
    return "controller.routeview.RouteViewController";
   }
});