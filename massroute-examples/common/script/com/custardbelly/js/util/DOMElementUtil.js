define( function() {

	var _getAttributeMap = function( node ) {
		var nodeAttributes = node.attributes,
			attributes = {},
			i = 0, length = nodeAttributes.length, attribute;

		for( i; i < length; i++ ) {
			attribute = nodeAttributes[i];
			attributes[attribute.name] = attribute.value;
		}

		return attributes;
	};

	var _getNodeMapList = function( document, nodeName ) {
		var nodes = document.getElementsByTagName( nodeName ),
			list = [],
			i = 0, length = nodes.length, 
			node;

		for( i; i < length; i++ ) {
			node = nodes[i];
			list[list.length] = _getAttributeMap( node );
		}
		return list;
	};

	return {
		getAttributeMap: _getAttributeMap,
		getNodeMapList: _getNodeMapList
	};

});