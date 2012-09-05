(function(window) {
	var list = document.querySelector('.list');
	if( list ) {
		var listItems = list.getElementsByTagName('li'),
			i = listItems.length;
		while( --i > -1 ) {
			listItems[i].onclick = (function(item) {
				var link = item.getElementsByTagName('a')[0];
				return function( event ) {
					if( link ) {
						event.preventDefault();
						window.location = link.href;
						return false;
					}
				}
			}(listItems[i]))
		}
	}
}(window));