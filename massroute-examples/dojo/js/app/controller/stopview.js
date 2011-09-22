dojo.provide( 'controller.stopview' );

dojo.require( 'controller.base' );
dojo.require( 'renderer.listrenderer' );

dojo.declare( 'controller.stopview.StopViewController', [controller.base.BaseViewController], {
    constructor: function( context, element ) {
        this._listElement = undefined;
        this._refreshHandler = undefined;
        
        this._loadingFragment = '';
        this.stopTag = '';
        this.stopTitle = '';
    },
    _handleRefresh: function( evt ) {
        evt.preventDefault();
        this._refresh();
        return false;
    },
    _clear: function() {
        dojo.empty( this._listElement );
    },
    _fill: function( items /* model.route.StopPrediction[] */ ) {
        var self = this,
            listItem,
            listParent = this._listElement.parentNode;
        listParent.removeChild( this._listElement );
        
        console.log( "[" + this.toString() + "] :: Predictions receieved. Amount: " + items.length );
        if( ( typeof items != 'undefined' ) && items.hasOwnProperty( 'length' ) && items.length > 0 ) {
            dojo.forEach( items, function( item /* model.route.StopPrediction[] */, index ) {
                listItem = new renderer.listrenderer.NonSelectableListItemRenderer( {
                    tag: '',
                    title: item.minutes + ' minute(s)'
                } );
                listItem.placeAt( self._listElement );
            });
        }
        else {
            listItem = new renderer.listrenderer.LabelListItemRenderer( {
               title: 'No predictions found at this time.\n Please try again later.'
            });
            listItem.placeAt( self._listElement );
        }
        
        listParent.appendChild( this._listElement );
    },
    _refresh: function() {
        var self = this,
            elParent = this.element.parentNode;
            prompt = dojo.place( this._loadingFragment, this.element, "before" );
            
        this._clear();
        elParent.removeChild( this.element );
        dojo.when( self.context.controller.getPredictions( this.stopTag ),
            function( predictions ) {
                self._fill( predictions );
                dojo.place( self.element, prompt, "after" );
                dojo.destroy( prompt );
            },
            function( error ) {
                console.log( "[" + self.toString() + "] :: Error getting predictions: " + error + "."); 
            }
        );
    },
    populate: function( items /* model.route.StopPrediction[] */ ) {
        this._clear();
        this._fill( items );
    },
    activate: function() {
        var self = this,
            fragment;
        this.stopTag = this.context.session.currentState(),
        this.stopTitle;
            
        if( ( typeof this.stopTag ) != undefined ) {
            this.stopTitle = this.context.session.currentConfiguration.findStopFromTag( this.stopTag ).title;
            this._loadingFragment = '<p id=\"sv_prompt\">Acquiring predictions for ' + this.stopTitle + ' ...</p>'
            fragment = "<header><h1>Showing Predictions for Stop: " + this.stopTitle + "</h1>" +
                        "<nav><a id=\"sv_backbutton\" href=\"#\">back to stops</a> " +
                        "<a id=\"sv_refresh\" href=\"#\">refresh</a></nav></header>" +
                        "<ul id=\"predictionlist\"></ul>";
            
            dojo.place( this._loadingFragment, this.element, "only" );
            
            // Request. 
            dojo.when( self.context.controller.getPredictions( this.stopTag ),
                function( predictions ) {
                    // push fragment to DOM within target element.
                    self._ui = dojo.place( fragment, self.element, "only" );
                    // Hold reference to lists.
                    self._listElement = dojo.byId( "predictionlist" );
                    
                    // Attach handler for internal back.
                    self._backEventHandler = dojo.connect( dojo.byId("sv_backbutton"), 'onclick', self, '_handleBack' );
                    // Attach handler for refresh
                    self._refreshHandler = dojo.connect( dojo.byId( "sv_refresh" ), 'onclick', self, '_handleRefresh' );
                    // Populate
                    self.populate( predictions );
                },
                function( error ) {
                    console.log( "[" + self.toString() + "] :: Error getting predictions: " + error + "."); 
                }
            );
        }
    },
    deactivate: function() {
        stopTag = '';
        stopTitle = '';
        this._clear();
        
        if( ( typeof this._refreshHandler != 'undefined' ) ) {
            dojo.disconnect( this._refreshHandler );
        }
        if( typeof this._listElement != 'undefined' ) {
            dojo.destroy( this._listElement );
        }
        this.inherited( 'deactivate', arguments );
    },
    toString: function() {
        return "controller.stopview.StopViewController";
    }
});