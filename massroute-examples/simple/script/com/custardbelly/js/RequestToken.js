/*
	http://programming34m0.blogspot.com/2010/06/javascript-best-practice-one-special.html
	It is becoming common practice to concatenate javascript files.
	Beginning the file with a semicolon will prevent this kind of problem. Where a file begins with a closure, best practice should dictate that it begins with a semicolon.
*/
;(function( window ) {

	window['custardbelly'] = window.custardbelly || {};
    window.custardbelly['js'] = window.custardbelly.js || {};

    var RequestToken = (function() {
    	var resultHandler, faultHandler, progHandler,
    		states, state, stateValue,
    		token = this;

    	function _createStates() {
    		states = {};
    		states['resolved'] = _resolve;
    		states['rejected'] = _reject;
    		states['progress'] = _progress;
    	}

    	function _resolveState( currentState ) {
    		if( typeof currentState !== undefined ) {
    			_applyState( state );
    		}
    	}

    	function _applyState( newState, value ) {
    		state = newState;
    		stateValue = value;
    		if( states.hasOwnProperty( state ) ) {
    			states[state]( stateValue );
    		}
    	}

    	function _resolve( value ) {
    		if( typeof resultHandler !== 'undefined' ) {
    			resultHandler.call( null, value )	
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

    	function _then( fullfilledHandler, errorHandler, progressHandler ) {

    		_createStates();

    		resultHandler = fullfilledHandler;
    		faultHandler = errorHandler;
    		progHandler = progressHandler;

    		_resolveState( state, stateValue );
    		return token;
    	};	

    	return {
    		then: _then,
    		setState: _applyState
    	};
    });

	window.custardbelly.js.RequestToken = RequestToken;

})( this );