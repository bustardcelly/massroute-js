describe('Model: RouteConfiguration', function() {
	
	var configuration,
		supportUrl = process.cwd() + '/jasmine/support',
		mockConfiguration = require(supportUrl + '/mock.model.js');

	beforeEach( function() {
		configuration = mockConfiguration.getConfiguration();
	});

	it('should should return list of stops from stopsByDestination()', function() {
		var stops = configuration.stopsByDestination('0');

		expect(stops).not.toBeUndefined();
	});
});