define(['com/custardbelly/js/RequestToken'], function( RequestToken ) {

	var Request = (function( url ) {
		this.requestURL = url;
		var xhr,
			token,
			tokenClass = RequestToken;

		function _handleXHRState() {
			// 3 - LOADING
			// 4 - DONE
			var hasFault = false;
			if( xhr.readyState == 4 ){
				hasFault = !(xhr.status == 200 && xhr.responseXML);
				if( !hasFault ){
					token.setState( 'resolved', xhr.responseXML );
                }
			}
			if( hasFault ) {
				token.setState( 'rejected', "There was a problem in request for " + this.requestURL + ". Error: " + xhr.responseText );
			}
		}

		this.send = function( resultHandler, faultHandler, progressHandler ) {
			token = new tokenClass();
			token.then( resultHandler, faultHandler, progressHandler );
			
			// Wrap in try catch for Firefox.
			try {
				xhr = new XMLHttpRequest();  
				if( 'withCredentials' in xhr ) {
					xhr.open('GET', this.requestURL, true);
				} 
				else if( typeof XDomainRequest != 'undefined' ) {
					xhr = new XDomainRequest();
					xhr.open('GET', this.requestURL);
				}

				if( xhr.overrideMimeType ) { 
					xhr.overrideMimeType('text/xml'); //Firefox & Safari
				}
				xhr.onreadystatechange = _handleXHRState;
				xhr.send(null);	
			}
			catch( e ) {
				token.setState( 'rejected', e.message );
			}
			
			return token;
		};
	});

	return Request;
});