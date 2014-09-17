/*global angular: false*/

/**
 * @ngdoc filter
 * @name subApp.filter:myFilter
 * @function
 * @description
 * # myFilter
 * Filter in the subApp.
 */

var myFilters = angular.module('subApp.filters', []);

myFilters.filter('subtitleTime', function () {
    'use strict';

    function padWithZeroes(num, size) {
        var s = String(num);
        while (s.length < size) {
            s = '0' + s;
        }
        return s;
    }

    return function (timeStamp) {
        var stringResult = padWithZeroes(timeStamp.hours, 2) + ':';
        stringResult += padWithZeroes(timeStamp.minutes, 2) + ':';
        stringResult += padWithZeroes(timeStamp.seconds, 2) + ',';
        stringResult += padWithZeroes(timeStamp.miliseconds, 3);

        return stringResult;
    };
});
