describe('Controller', function() {

	var supportUrl = process.cwd() + '/jasmine/support',
		helper = require(supportUrl + '/mock.controller.js'),
		response = require('express').response,
		result, dirResult, stopResult, predictionResult,
		baseUrl = '../../../script/com/custardbelly/massroute';
		
	describe('When routes requested', function() {

		beforeEach( function() {
			spyOn(response, 'send').andCallFake(function(json) {
				result = json;
			});
			response.type('json');
			// stub out property that checks format in order to send()
			response.req = {
				accepts: function() {
					return 'json';
				}
			};
			helper.controller.routes(undefined, response);
		});

		it('should call send() on response with JSON string', function() {
			expect(response.send).toHaveBeenCalled();
		});

		it('should respond with proper JSON routes', function() {
			var routes = JSON.parse(result).route;

			expect(routes).toBeDefined();
			expect(routes.length).toEqual(3);
		});
	});

	describe('When destinations requested', function() {

		beforeEach( function() {
			spyOn(response, 'send').andCallFake(function(json) {
				dirResult = json;
			});
			response.type('json');
			// stub out property that checks format in order to send()
			response.req = {
				params: {
					routeId: '1'
				},
				accepts: function() {
					return 'json';
				}
			};
			helper.controller.destinations(response.req, response);
		});

		it('should call send() on response with JSON string', function() {
			expect(response.send).toHaveBeenCalled();
		});

		it('should respond with proper JSON routes', function() {
			var route = JSON.parse(dirResult).route;
			var stops = route.stop;
			var directions = route.direction;

			expect(route).toBeDefined();
			expect(stops.length).toEqual(3);
			expect(directions.length).toEqual(2);
		});
	});

	describe('When stops requested', function() {
		
	});

});