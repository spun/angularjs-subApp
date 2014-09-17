/*global angular: false, describe: false, beforeEach: false, inject: false, it: false, expect: false*/

'use strict';

describe('Directive: toastDirective', function () {

  // load the directive's module
  beforeEach(module('subApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<toast-directive></toast-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the toastDirective directive');
  }));
});
