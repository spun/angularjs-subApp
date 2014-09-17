/*global angular: false, FileReader: false*/

/**
 * @ngdoc directive
 * @name subApp.directive:uploadsDirective
 * @description
 * # uploadsDirective
 */

var uploadsDirectives = angular.module('subApp.directives.uploads', []);

uploadsDirectives.directive('upload',  ['FileCenter', 'toastService', function (FileCenter, toast) {
    'use strict';

    return {
        restrict: 'A',
        controller: function ($scope) {
            this.processFiles = function (files) {

                var numFiles = files.length,
                    f,
                    reader,
                    pat = /^[\u0000-\uFFF0]*$/, // Special characters regexp
                    fileExtensionReg = /^.+\.(srt|xml)$/i,  // Supported extension regexp,
                    fileExtensionRegResult,
                    encodingsArray = ['UTF-8', 'ASCII'],
                    encodingPos = 0;

                if (numFiles === 1) {
                    f = files[0];
                    encodingPos = 0;

                    // Check file extension
                    fileExtensionRegResult = fileExtensionReg.exec(f.name);
                    if (fileExtensionRegResult === null) {
                        toast.pop('Only SubRip files (srt) are supported right now');
                        $scope.$apply();
                    } else {
                        // Read file
                        reader = new FileReader();
                        reader.onload = (function (file, position) {
                            return function () {

                                // TextFile content
                                var text = this.result;

                                // Test Special characters
                                if (pat.test(text)) {
                                    // Valid encoding detected
                                    FileCenter.importFile(f.name, fileExtensionRegResult[1], f.size, f.type, f.lastModifiedDate, text);
                                    $scope.$apply();
                                } else {
                                    // Test failed
                                    position += 1;
                                    if (encodingsArray[position]) {
                                        // New test
                                        this.readAsText(file, encodingsArray[position]);
                                    } //else {
                                        // All tests failed
                                    //}
                                }
                            };
                        }(f, encodingPos));
                        reader.readAsText(f, encodingsArray[encodingPos]);
                    }
                }
            };
        }
    };
}]);

uploadsDirectives.directive('dndUpload', function () {
    'use strict';

    return {
        restrict: 'A',
        require: 'upload',
        link: function (scope, elm, attrs, uploadCtrl) {
            elm.bind('dragover', function (evt) {
                elm.addClass('fileover');
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy';
            });

            elm.bind('dragleave', function (evt) {
                elm.removeClass('fileover');
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy';
            });

            elm.bind('drop', function (evt) {
                elm.removeClass('fileover');

                var files = evt.dataTransfer.files;
                uploadCtrl.processFiles(files);

                evt.stopPropagation();
                evt.preventDefault();
            });
        }
    };
});

uploadsDirectives.directive('manualUpload', function () {
    'use strict';

    return {
        restrict: 'A',
        require: 'upload',
        link: function (scope, elm, attrs, uploadCtrl) {
            elm.bind('change', function (evt) {
                var files = evt.target.files;
                uploadCtrl.processFiles(files);
            });
        }
    };
});
