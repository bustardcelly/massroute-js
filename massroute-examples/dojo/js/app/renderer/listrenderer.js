dojo.provide( 'renderer.listrenderer' );

dojo.require( "dijit._Widget" );
dojo.require( "dijit._Templated" );
dojo.require( "dojo.cache" );

dojo.declare( "renderer.listrenderer.NonSelectableListItemRenderer", [dijit._Widget, dijit._Templated], {
    tag: '',
    title: '',
    templateString: dojo.cache( "template", "nonselectablelistitem.html", {sanitize:true} )
});

dojo.declare( "renderer.listrenderer.LabelListItemRenderer", [dijit._Widget, dijit._Templated], {
    tag: '',
    title: '',
    eventType: '',
    templateString: dojo.cache( "template", "labellistitem.html", {sanitize:true} ),
    _handleClick: function( event ) {
        event.preventDefault();
        dojo.publish( "/massroute/nav/forward", [this.eventType, this.tag] );
        return false;
    }
});

dojo.declare( "renderer.listrenderer.IconListItemRenderer", [dijit._Widget, dijit._Templated], {
    tag: '',
    title: '',
    eventType: '',
    templateString: dojo.cache( "template", "routelistitem.html", {sanitize:true} ),
    _handleClick: function( event ) {
        event.preventDefault();
        dojo.publish( "/massroute/nav/forward", [this.eventType, this.tag] );
        return false;
    }
});