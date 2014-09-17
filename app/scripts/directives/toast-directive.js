/*global angular: false*/

var toastDirective = angular.module('toast', ['ngAnimate']);

toastDirective.service('toastService', ['$rootScope', function ($rootScope) {
    'use strict';

    this.pop = function (msg) {
        this.toast = {
            message: msg
        };
        $rootScope.$broadcast('toast-newToast');
    };
}]);

toastDirective.directive('toastContainer', ['$timeout', 'toastService', function ($timeout, toastService) {
    'use strict';

    return {
        scope: true,
        link: function (scope) {

            scope.toastList = [];

            function removeToast(toast) {
                var index = scope.toastList.indexOf(toast);
                if (index > -1) {
                    scope.toastList.splice(index, 1);
                }
            }

            function setTimeout(toast, time) {
                toast.timeout = $timeout(function () {
                    removeToast(toast);
                }, time);
            }

            function addToast(toast) {
                scope.toastList.unshift(toast);
                setTimeout(toast, 3000);
            }

            scope.$on('toast-newToast', function () {
                addToast(toastService.toast);
            });
        },

        template: '<div class="toast-container">' +
            '<div ng-repeat="toast in toastList" class="toast">' +
            '    {{toast.message}}' +
            '</div>' +
            '</div>'
    };
}]);
