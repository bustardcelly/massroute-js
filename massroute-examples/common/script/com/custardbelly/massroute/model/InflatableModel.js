define(function() {
	
	var InflatableModel = (function() {
	});

	(function( modelPrototype ) {

		modelPrototype.inflate = function( object ) {
			var property;
			for( property in object ) {
				if( this.hasOwnProperty( property ) ) {
					this[property] = object[property];
				}
			}
			return this;
		}

	})(InflatableModel.prototype);

	return InflatableModel;
});