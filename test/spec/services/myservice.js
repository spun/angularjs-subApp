/*global describe: false, beforeEach: false, inject: false, it: false, expect: false*/

'use strict';

describe('Service: myService', function () {

  // load the service's module
  beforeEach(module('subApp'));

  // instantiate service
  var myService;
  beforeEach(inject(function (_myService_) {
    myService = _myService_;
  }));

  it('should do something', function () {
    expect(!!myService).toBe(true);
  });

});
