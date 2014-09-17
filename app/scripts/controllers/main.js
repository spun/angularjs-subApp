/*global angular: false*/
/*jslint browser: true */

/**
 * @ngdoc function
 * @name subApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the subApp
 */

var myControllers = angular.module('subApp.controllers', []);

myControllers.controller('MainCtrl', ['$scope', 'FileCenter', 'toastService', function ($scope, FileCenter, toast) {
    'use strict';

    $scope.file = FileCenter;

    $scope.showLineList = false;
    $scope.showSyncOptions = false;

    $scope.selectedLinesArray = [];
    $scope.resyncTime = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        miliseconds: 0
    };

    $scope.toggleLineList = function () {
        $scope.showLineList = !$scope.showLineList;
        if ($scope.showLineList === true) {
            if ($scope.showLineList === true) {
                $scope.showSyncOptions = !$scope.showLineList;
            }
        } else {
            $scope.deselectAll();
        }
    };

    $scope.toggleSyncOptions = function () {
        $scope.showSyncOptions = !$scope.showSyncOptions;
        if ($scope.showLineList === true) {
            if ($scope.showLineList === true) {
                $scope.showLineList = !$scope.showSyncOptions;
            }
        }

    };

    $scope.selectLine = function (line, event) {
        if (line.selected === true) {
            $scope.deselectAll();
        } else {
            $scope.deselectAll();
            line.selected = true;
            $scope.selectedLinesArray.push(line);
            event.stopPropagation();
            event.preventDefault();
        }
    };

    $scope.deselectAll = function () {
        while ($scope.selectedLinesArray.length > 0) {
            $scope.selectedLinesArray.pop().selected = false;
        }
    };

    $scope.sync = function (addTime) {

        if (addTime === true) { // Delay
            FileCenter.addTime($scope.resyncTime);
            toast.pop('Time added');
        } else if (addTime === false) {
            FileCenter.removeTime($scope.resyncTime);
            toast.pop('Time removed');
        }

        $scope.showSyncOptions = false;

        $scope.resyncTime = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            miliseconds: 0
        };
    };

    $scope.closeFile = function () {
        $scope.deselectAll();
        $scope.showLineList = false;
        $scope.showSyncOptions = false;
        $scope.file.reset();
    };

    $scope.download = function () {
        var result = FileCenter.exportSubRip(),
            a = document.createElement('a');

        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
        a.setAttribute('download', $scope.file.name);

        // Append anchor to body (firefox).
        document.body.appendChild(a);
        a.click();

        // Remove anchor from body
        document.body.removeChild(a);
    };

}]);
