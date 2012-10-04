(function(window) {

	var list = document.querySelector('.list'),
		modalOverlay = document.querySelector('.modal-overlay'),
		modalView = document.querySelector('.loading-modal');

	if( list ) {
		var listItems = list.getElementsByTagName('li'),
			i = listItems.length;
		while( --i > -1 ) {
			listItems[i].onclick = (function(item) {
				var link = item.getElementsByTagName('a')[0];
				return function( event ) {
					if( link ) {
						event.preventDefault();
						modalOverlay.style.display = 'block';
						modalView.style.left = ((window.innerWidth-modalView.offsetWidth) * 0.5) + 'px';
						modalView.style.top = ((window.innerHeight-modalView.offsetHeight)*0.5) + 'px';
						window.location = link.href;
						return false;
					}
				}
			}(listItems[i]))
		}
	}

	window.onunload = function() {
		modalOverlay.style.display = 'none';
	};

}(window));