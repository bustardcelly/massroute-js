define(function() {

	var RequestToken = (function() {
		var self = this,
			resultHandler, faultHandler, progHandler,
			states, state, stateValue;

		function _createStates() {
			states = {
				'resolved': _resolve,
				'rejected': _reject,
				'progress': _progress
			};
		}

		function _resolveState( currentState ) {
			if( typeof currentState !== undefined ) {
				self.setState( state );
			}
		}

		function _resolve( value ) {
			if( typeof resultHandler !== 'undefined' ) {
				resultHandler.call( null, value );
			}
		}

		function _reject( value ) {
			if( typeof faultHandler !== 'undefined' ) {
				faultHandler.call( null, value );	
			}
		}

		function _progress( value ) {
			if( typeof progHandler !== 'undefined' ) {
				progHandler.call( null, value );
			}
		}

		this.then = function( fullfilledHandler, errorHandler, progressHandler ) {

			_createStates();
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
	});
	
	return RequestToken;
});