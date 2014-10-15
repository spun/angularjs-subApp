/*global angular: false*/
/*jslint regexp: true */

/**
 * @ngdoc service
 * @name subApp.myService
 * @description
 * # myService
 * Service in the subApp.
 */

var myServices = angular.module('subApp.services', []);
myServices.value('version', '0.1');

myServices.factory('FileCenter', ['subtitleTimeFilter', function (subtitleTimeFilter) {
    'use strict';

    return {
        fileLoaded: false,
        name: '',
        type: '',
        lastModifiedDate: '',
        size: 0,
        lines: [],

        setSize: function (num) {
            this.size = num;
        },

        addLine: function (numLine, startTime, endTime, lineContent) {

            var line = {
                'lineNumber': numLine,
                'startTime': startTime,
                'endTime': endTime,
                'lineContent': lineContent
            };

            this.lines.push(line);
        },

        timeToMiliseconds: function (time) {
            var miliseconds = 0;
            miliseconds += parseInt(time.hours, 10) * 3600000;
            miliseconds += parseInt(time.minutes, 10) * 60000;
            miliseconds += parseInt(time.seconds, 10) * 1000;
            miliseconds += parseInt(time.miliseconds, 10);

            return miliseconds;
        },

        milisecondsToTime: function (timeStamp) {
            var temp,
                time = {};

            time.miliseconds = timeStamp % 1000;
            temp = Math.floor(timeStamp / 1000);
            time.seconds = temp % 60;
            temp = Math.floor(temp / 60);
            time.minutes = temp % 60;
            temp = Math.floor(temp / 60);
            time.hours = temp;

            return time;
        },

        addTime: function (resyncTime) {
            var i = 0,
                numLines = this.lines.length,
                startTime,
                startTimeMs,
                startTimeResult,
                endTime,
                endTimeMs,
                endTimeResult,
                resyncTimeMs = this.timeToMiliseconds(resyncTime);

            for (i = 0; i < numLines; i += 1) {
                startTime = this.lines[i].startTime;
                startTimeMs = this.timeToMiliseconds(startTime);
                startTimeResult = startTimeMs + resyncTimeMs;
                this.lines[i].startTime = this.milisecondsToTime(startTimeResult);

                endTime = this.lines[i].endTime;
                endTimeMs = this.timeToMiliseconds(endTime);
                endTimeResult = endTimeMs + resyncTimeMs;
                this.lines[i].endTime = this.milisecondsToTime(endTimeResult);
            }
        },

        removeTime: function (resyncTime) {
            var i = 0,
                numLines = this.lines.length,
                startTime,
                startTimeMs,
                startTimeResult,
                endTime,
                endTimeMs,
                endTimeResult,
                resyncTimeMs = this.timeToMiliseconds(resyncTime);

            for (i = 0; i < numLines; i += 1) {
                startTime = this.lines[i].startTime;
                startTimeMs = this.timeToMiliseconds(startTime);
                startTimeResult = startTimeMs - resyncTimeMs;
                if (startTimeResult > 0) {
                    this.lines[i].startTime = this.milisecondsToTime(startTimeResult);
                } else {
                    this.lines[i].startTime = {hours: 0, minutes: 0, seconds: 0, miliseconds: 0};
                }

                endTime = this.lines[i].endTime;
                endTimeMs = this.timeToMiliseconds(endTime);
                endTimeResult = endTimeMs - resyncTimeMs;
                if (endTimeResult > 0) {
                    this.lines[i].endTime = this.milisecondsToTime(endTimeResult);
                } else {
                    this.lines[i].endTime = {hours: 0, minutes: 0, seconds: 0, miliseconds: 0};
                }
            }
        },

        importFile: function (fileName, extension, fileSize, fileType, fileLastModDate, text) {
            this.reset();

            this.name = fileName;
            this.size = fileSize;
            this.type = fileType;
            this.lastModifiedDate = fileLastModDate;

            switch (extension) {
            case 'srt': //SubRip
                this.importSubRip(text);
                break;
            case 'xml': //XML
                break;
            /*default:
                console.log("Bad extension again");*/
            }
        },

        // *.srt
        importSubRip: function (rawInput) {
            var re = /(\d+)\r\n([\d+:,]+) --> ([\d+:,]+)\r\n(.*\r\n.*)/g,
                startTimeParts,
                startTimeParts2,
                startTime,
                endTimeParts,
                endTimeParts2,
                endTime,
                m = re.exec(rawInput);

            while (m !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex += 1;
                }

                startTimeParts = m[2].split(':');
                startTimeParts2 = startTimeParts[2].split(',');
                startTime = {
                    hours: parseInt(startTimeParts[0], 10),
                    minutes: parseInt(startTimeParts[1], 10),
                    seconds: parseInt(startTimeParts2[0], 10),
                    miliseconds: parseInt(startTimeParts2[1], 10)
                };

                endTimeParts = m[3].split(':');
                endTimeParts2 = endTimeParts[2].split(',');
                endTime = {
                    hours: parseInt(endTimeParts[0], 10),
                    minutes: parseInt(endTimeParts[1], 10),
                    seconds: parseInt(endTimeParts2[0], 10),
                    miliseconds: parseInt(endTimeParts2[1], 10)
                };
                this.addLine(m[1], startTime, endTime, m[4]);

                m = re.exec(rawInput);
            }
            this.fileLoaded = true;
        },

        exportSubRip: function () {
            var result = '',
                numLines = this.lines.length,
                i = 0;
            for (i = 0; i < numLines; i += 1) {
                result += (this.lines[i].lineNumber + '\r\n');
                result += subtitleTimeFilter(this.lines[i].startTime) + ' --> ' + subtitleTimeFilter(this.lines[i].endTime) + '\r\n';
                result += (this.lines[i].lineContent + '\r\n' + '\r\n');
            }

            return result;
        },

        reset: function () {
            this.fileLoaded = false;
            this.name = '';
            this.type = '';
            this.lastModifiedDate = '';
            this.size = 0;
            while (this.lines.length > 0) {
                this.lines.pop();
            }

        }
    };
}]);
