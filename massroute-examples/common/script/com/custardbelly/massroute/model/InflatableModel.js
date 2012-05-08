define(function() {
	
	var InflatableModel = (function() {
	});
	
	InflatableModel.prototype.inflate = function( object ) {
		var property;
		for( property in object ) {
			if( this.hasOwnProperty( property ) ) {
				this[property] = object[property];
			}
		}
		return this;
	};

	return InflatableModel;
});