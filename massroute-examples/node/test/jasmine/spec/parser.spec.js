describe('Parser-Util', function() {

	var supportUrl = process.cwd() + '/jasmine/support',
		helper = require(supportUrl + '/mock.controller.js'),
		response = require('express').response,
		result, dirResult, predictionResult,
		baseUrl = '../../../script/com/custardbelly/massroute',
		util = require(baseUrl+'/parse-util');

	describe('When routes response XML is parsed to application data', function() {

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

		it('should return a list of object(s) from mapResult()', function() {
			var routes, newRoutes;
			routes = JSON.parse(result).route;
			newRoutes = util.mapResult(routes);

			// checks that is not null and is generic object. (null can be a typeof object, unfortunately).
			expect(newRoutes[0]).not.toBeNull();
			expect((typeof newRoutes[0])).toEqual('object');
		});

		it('should return a new list from mapResult()', function() {
			var routes, newRoutes;
			routes = JSON.parse(result).route;
			newRoutes = util.mapResult(routes);

			expect(routes).not.toEqual(newRoutes);
		});

		it('should flatten JSON based on @ character', function() {
			var routes = util.mapResult(JSON.parse(result).route),
				firstItem = routes[0];

			expect(firstItem['@']).toBeUndefined();
			expect(firstItem['tag']).not.toBeUndefined();
		});

		it('should create a map of routes based on the \'tag\' value', function() {
			var map = util.arrayToKeyMap(JSON.parse(result).route, 'tag');

			expect(map['1']).not.toBeUndefined();
			expect(map.hasOwnProperty('5')).toBe(true);
			expect((typeof map['4'])).toEqual('object');
		});
	});

	describe('When destinations response XML is parsed to application data', function() {

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

		it('should parse to list of directions to mapped list', function() {
			var directions = JSON.parse(dirResult).route.direction;
			var list = util.listDirectionsResult(directions);

			expect(list instanceof Array).toBe(true);
			expect(list.length).toEqual(2);
		});

		it('should parse single direction to mapped list', function() {
			var directions = JSON.parse(dirResult).route.direction;
			var list = util.listDirectionsResult(directions[0]);

			expect(list instanceof Array).toBe(true);
			expect(list.length).toEqual(1);
		});
	});

	describe('When prediction response XML is parsed to application data', function() {

		beforeEach( function() {
			spyOn(response, 'send').andCallFake(function(json) {
				predictionResult = json;
			});
			response.type('json');
			// stub out property that checks format in order to send()
			response.req = {
				params: {
					routeId: '1',
					directionId: '3',
					stopId: '2'
				},
				accepts: function() {
					return 'json';
				}
			};
			helper.controller.predictions(response.req, response);
		});

		it('should parse to map of predictions', function() {
			var predictionMap = util.mapPredictionResult(JSON.parse(predictionResult).predictions);
			var predictionList = predictionMap.predictions;

			expect(predictionList instanceof Array).toBe(true);
			expect(predictionList.length).toEqual(5);
		});
	});

});