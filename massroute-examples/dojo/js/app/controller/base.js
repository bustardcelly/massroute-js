dojo.provide( "controller.base" );

/**
 * Base class for view controllers. In the context of this application, they are activated and deactivated based on state and broadcast navigational events based on user activity.
*/
dojo.declare( "controller.base.BaseViewController", null, {
    constructor: function( viewstate, context, element ) {
        this.viewstate = viewstate;
        this.context = context;
        this.element = element;
        
        this._backEventHandler = undefined;
        this._ui = undefined;
    },
    _handleBack: function( evt ) {
        if( evt !== undefined ) {
            evt.preventDefault();
        }
        dojo.disconnect( this._backEventHandler );
        dojo.publish( "/massroute/nav/back" );
        return false;
    },
    _handleForward: function( tag ) {
        dojo.publish( "/massroute/nav/forward", this.viewstate, tag );  
    },
    activate: function() {
        // must override.
    },
    deactivate: function() {
        if( typeof this._backEventHandler != 'undefined' ) {
            dojo.destroy( this._backEventHandler );
        }
        if( typeof this._ui != 'undefined' )  {
            dojo.destroy( this._ui );
        }
    }
});