dojo.provide('model.route');

dojo.declare( 'model.route.Route', null, {
    constructor: function( routeTag, routeTitle ) {
        this.tag = routeTag;
        this.title = routeTitle;
    }
});