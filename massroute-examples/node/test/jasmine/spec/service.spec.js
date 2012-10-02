describe('Service', function() {

    var supportUrl = process.cwd() + '/jasmine/support',
        // using mocked proxy in order to test parser on service with canned data and not request from server when running tests.
        service = require(supportUrl + '/mock.service.js').service;

    it('getRoutes() should parse and return list of routes', function() {

      var timeout, result;
      timeout = setTimeout( function() {
        service.getRoutes().then( function( value ) {
          result = value;

          expect(result).not.toBeUndefined();
          expect(result instanceof Array).toBe(true);
          expect(result.length).toEqual(3);
          asyncSpecDone();
        });
        clearTimeout(timeout);
      }, 1000);
      
      asyncSpecWait(1);

    });

});