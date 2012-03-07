define(function() {

	var RequestToken = (function() {
		var self = this,
			resultHandler, faultHandler, progHandler,
			states, state, stateValue,
			_createStates = function() {
				states = {
					'resolved': _resolve,
					'rejected': _reject,
					'progress': _progress
				};
			},
			_resolveState = function( currentState ) {
				if( typeof currentState !== undefined ) {
					self.setState( state );
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

		this.then = function( fullfilledHandler, errorHandler, progressHandler ) {

			state = 'unresolved';

			resultHandler = fullfilledHandler;
			faultHandler = errorHandler;
			progHandler = progressHandler;

			_resolveState( state, stateValue );
			return this;
		};

		this.setState = function( newState, value ) {
			state = newState;
			stateValue = value;
			if( states.hasOwnProperty( state ) ) {
				states[state]( stateValue );
			}
		};

		this.getState = function() {
			return state;
		};

		_createStates();
	});
	
	return RequestToken;
});