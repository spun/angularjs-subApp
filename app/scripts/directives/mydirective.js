/*global angular: false*/
/*jslint regexp: true */

/**
 * @ngdoc directive
 * @name subApp.directive:myDirective
 * @description
 * # myDirective
 */

var myDirectives = angular.module('subApp.directives', []);

myDirectives.directive('wKeydown', function () {
    'use strict';

    return function (scope, elm, attr) {
        elm.bind('keydown', function (e) {
            switch (e.keyCode) {
            case 27: //Escape
                return scope.$apply(attr.wEsc);
            /*default:
                console.log(e.keyCode);*/
            }
        });
    };
});

myDirectives.directive('timeStampEditor', function () {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            description: '@',
            time: '='
        },
        template:
            '<p>' +
            '    Minutes:' +
            '    </br><input type="range" min="0" max="59" ng-model="time.minutes"/>' +
            '</p>' +
            '<p>' +
            '    Seconds:' +
            '    </br><input type="range" min="0" max="59" ng-model="time.seconds"/>' +
            '</p>' +
            '<p>' +
            '    Miliseconds:' +
            '    </br><input type="range" min="0" max="999" ng-model="time.miliseconds"/>' +
            '</p>' +
            '<p>' +
            '    {{description}}: ' +
            '       <input type="text" min="0" max="99" size="2" ng-model="time.hours"/> :' +
            '    <input type="text" min="0" max="59" size="2" ng-model="time.minutes"/> :' +
            '    <input type="text" min="0" max="59" size="2" ng-model="time.seconds"/> ,' +
            '    <input type="text" min="0" max="999" size="3" ng-model="time.miliseconds"/>' +
            '</p>'
    };
});
