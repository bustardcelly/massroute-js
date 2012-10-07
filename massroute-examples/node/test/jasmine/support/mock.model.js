var path 					= require('path'),
	jasmine 				= global.jasmine,
	baseProxyUrl 			= process.cwd() + '/script/com/custardbelly/massroute',
	supportUrl 				= process.cwd() + '/test/jasmine/support',
	model 					= require(path.join(baseProxyUrl,'/model.js')),
	stubbedConfiguration 	= model.RouteConfiguration('1', {
		"34": {
			tag: "34",
			title: "P St @ E 2nd St"
		},
		"35": {
			tag: "35",
			title: "P St @ E Broadway"
		}
	}, []);

exports.getConfiguration = function() {
	var spyOnId = jasmine.createSpy(stubbedConfiguration);

	spyOnId.baseObj = stubbedConfiguration;
  	spyOnId['getDestinationByID'] = 'getDestinationByID';
  	spyOnId.originalValue = stubbedConfiguration['getDestinationByID'];
	spyOnId.andCallFake( function( id ) {
		return {
			tag: '5_1_var0',
			title: 'McCormack Housing via Andrew Station',
			name: 'Inbound',
			stop: [{tag: '34'},{tag: '35'}]
		};
	});
	
	return stubbedConfiguration;
}