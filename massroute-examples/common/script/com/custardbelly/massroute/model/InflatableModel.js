define(function() {
	
	var InflatableModel = (function() {
	});

	InflatableModel.prototype = (function() {

		function _inflate( object ) {
			var property;
			for( property in object ) {
				if( this.hasOwnProperty( property ) ) {
					this[property] = object[property];
				}
			}
			return this;
		}

		return {
			inflate: _inflate
		};

	})();

	return InflatableModel;

});