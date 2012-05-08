define(function() {

	var RequestToken = (function() {
		var self = this,
			resultHandler, faultHandler, progHandler,
			_createStates = function() {
				
			},
			_resolveState = function( currentState ) {
				if( typeof currentState !== undefined ) {
					self.setState( self.state );
				}
			},
			_resolve = function( value ) {
				if( typeof resultHandler !== 'undefined' ) {
					resultHandler.call( null, value );
				}
			},
			_reject = function( value ) {
				if( typeof faultHandler !== 'undefined' ) {
					faultHandler.call( null, value );	
				}
			},
			_progress = function( value ) {
				if( typeof progHandler !== 'undefined' ) {
					progHandler.call( null, value );
				}
			};

		this.state = undefined;
		this.stateValue = undefined;
		this.states = {
			'resolved': _resolve,
			'rejected': _reject,
			'progress': _progress
		};
		this.then = function( fullfilledHandler, errorHandler, progressHandler ) {

			this.state = 'unresolved';

			resultHandler = fullfilledHandler;
			faultHandler = errorHandler;
			progHandler = progressHandler;

			_resolveState( this.state, this.stateValue );
			return this;
		};
	});

	RequestToken.prototype.setState = function( newState, value ) {
		this.state = newState;
		this.stateValue = value;
		if( this.states.hasOwnProperty( this.state ) ) {
			this.states[this.state]( this.stateValue );
		}
	};

	RequestToken.prototype.getState = function() {
		return this.state;
	};
	
	return RequestToken;
});