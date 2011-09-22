dojo.provide( "controller.mainview" );

dojo.require( 'controller.base' );
dojo.require( 'renderer.listrenderer' );

dojo.declare( "controller.mainview.RouteListViewController", [controller.base.BaseViewController], {
    constructor: function( viewstate, context, element ) {
        this._listElement = undefined;
    },
    _clear: function() {
        dojo.empty( this._listElement );
    },
    _fill: function( items /* model.route.Route[] */ ) {
        var self = this,
            parentList = this._listElement,
            listParent = this._listElement.parentNode,
            listItem;
            
        listParent.removeChild( this._listElement );
        
        dojo.forEach( items, function( item /* model.route.Route[] */, index ) {
            listItem = new renderer.listrenderer.IconListItemRenderer( {
                tag: item.tag,
                title: item.title,
                eventType: self.viewstate
            } );
            listItem.placeAt( parentList );
        });
        
        listParent.appendChild( this._listElement );
    },
    populate: function( items /* model.route.Route[] */ ) {
        this._clear();
        this._fill( items );
    },
    activate: function() {
        var self = this,
            loadingFrag = '<p>loading...</p>',
            frag = "<header><h1>Select your Route</h1></header><ul id=\"routelist\"></ul>";
            
        dojo.place( loadingFrag, this.element, "only" );
        
        // Request.
        dojo.when( self.context.controller.getRoutes(),
            function( routeList ) {
                // push fragment to DOM within target element.
                self._ui = dojo.place( frag, self.element, "only" );
                // Hold reference to routlist.
                self._listElement = dojo.byId( "routelist" );
                self.populate( routeList );
            },
            function( error ) {
                console.log( "[" + self.toString() + "] :: Error in route list request: " + error + "." );
            }
        );
    },
    deactivate: function() {
        this._clear();
        if( typeof this._listElement != 'undefined' ) {
            dojo.destroy( this._listElement );
        }
        this.inherited( 'deactivate', arguments );
    },
    toString: function() {
        return "controller.routeview.RouteListViewController";
    }
});