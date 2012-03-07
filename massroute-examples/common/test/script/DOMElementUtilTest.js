require( ['com/custardbelly/js/util/DOMElementUtil'], function( DOMElementUtil ) {
	
	module( 'DOMElementUtil', {
		setup: function() {
			var url = 'externs/mbta_offline.xml',
				xhr = new XMLHttpRequest(),
				self = this;

			stop();
			if( 'withCredentials' in xhr ) {
				xhr.open('GET', url, true);
			} 
			else if( typeof XDomainRequest != 'undefined' ) {
				xhr = new XDomainRequest();
				xhr.open('GET', url);
			}

			if( xhr.overrideMimeType ) { 
				xhr.overrideMimeType('text/xml'); //Firefox & Safari
			}
			xhr.onreadystatechange = _handleSetupState;
			
			function _handleSetupState() {
				var hasFault;
				if( xhr.readyState == 4 ){
					hasFault = !(xhr.responseXML);
					if( !hasFault ) {
						self.xml = xhr.responseXML;
		            }
		            start();
				}
			};
			setTimeout( function() {
				xhr.send(null);
			}, 100)
		},
		teardown: function() {
			this.xml = undefined;
		}
	});

	test( 'getAttributeMap() returns object mapping', function() {
		var response = this.xml;

		var el = response.getElementsByTagName('route')[0];
		var map = DOMElementUtil.getAttributeMap( el );
		equal( ( typeof map !== undefined ), true, 'Mapping returns undefined: ' + map );
	});

	test( 'getNodeMapList() returns listing of attribute map', function() {
		var response = this.xml;

		var listing = DOMElementUtil.getNodeMapList(response, 'route');
		equal( listing.length, 3, 'Node list not parsed properly. [list]: ' + listing );
	});

});