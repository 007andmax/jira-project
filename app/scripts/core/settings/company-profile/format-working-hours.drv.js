'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("formatWorkingHours",
    function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          from: '=',
          to: '='
        },
        link: function ($scope, element, attrs, ctrl) {
          var pattern = /(?:[a-zA-Z]?\s?)*([0-9]{1,2}):([0-9]{1,2})(?:[a-zA-Z]?\s?)*([0-9]{1,2}):([0-9]{1,2})/;
          var defaultValue = 'from 09:00 to 18:00',
            defaultFrom = 9 * 3600,
            defaultTo = 18 * 3600;
          var startWith = 'from ', splitWith = ' to ';
          var initialized = false;

          $scope.$watchCollection('[from, to]', function () {
            if (!initialized && $scope.from !== undefined && $scope.to !== undefined) {
              var fromHours = Math.floor($scope.from / 3600), fromMinutes = Math.round($scope.from / 60 - fromHours * 60);
              var toHours = Math.floor($scope.to / 3600), toMinutes = Math.round($scope.to / 60 - toHours * 60);

              if (fromHours < 10) {
                fromHours = '0' + fromHours;
              }

              if (toHours < 10) {
                toHours = '0' + toHours;
              }

              if (fromMinutes < 10) {
                fromMinutes = '0' + fromMinutes;
              }

              if (toMinutes < 10) {
                toMinutes = '0' + toMinutes;
              }

              var value = startWith + fromHours + ':' + fromMinutes + splitWith + toHours + ':' + toMinutes;
              element.val(value);
              ctrl.$setViewValue(value);
              initialized = true;
            }
          });

          element.on('blur', formatOnInput);

          function checkPattern(value) {

            if (value) {
              var matches = pattern.exec(value);

              if (matches && matches.length) {
                var fromHours = matches[1],
                  fromMinutes = matches[2],
                  toHours = matches[3],
                  toMinutes = matches[4];
              }

              var isValid = fromHours && fromMinutes && toHours && toMinutes;
              if (isValid) {
                var invalidTimeRange = parseInt(fromHours) + parseInt(fromMinutes) < parseInt(toHours) + parseInt(toMinutes);
              }
              ctrl.$setValidity('invalidWorkingHours', !!isValid);
              ctrl.$setValidity('invalidTimeRange', !!invalidTimeRange);
            }
          }

          function formatOnInput() {
            var value = element.val();

            if (!value) {
              element.val(defaultValue);
              ctrl.$setViewValue(defaultValue);
              $scope.from = defaultFrom;
              $scope.to = defaultTo;
              return;
            }

            var from = '', to = '',
              isFromParsing = true;
            for (var i = 0; i < value.length; i++) {
              var char = value[i],
                nextChar = value[i + 1];

              if (isDigit(char) || char === ':') {
                if (isFromParsing) {
                  if (!isDigit(nextChar) && nextChar !== ':') {
                    isFromParsing = false;
                  }
                  from += char;
                } else {
                  to += char;
                }
              }
            }

            from = getValid24HoursTime(from, $scope, 'from');
            to = getValid24HoursTime(to, $scope, 'to');

            value = startWith + from + splitWith + to;
            element.val(value);
            ctrl.$setViewValue(value);

            checkPattern(value);
          }

          function getValid24HoursTime(time, model, field) {
            var splitTime = time.split(':'),
              hours = parseInt(splitTime[0]) || 0,
              minutes = (!splitTime[1] || splitTime[1].length > 1 ? parseInt(splitTime[1]) : parseInt(splitTime[1] + '0')) || 0;

            if (minutes > 59) {
              minutes = 0;
            }

            if (hours > 23) {
              hours = 23;
            }

            model[field] = hours * 3600 + minutes * 60;

            return (hours > 9 ? hours : '0' + hours) + ':' + (minutes > 9 ? minutes : '0' + minutes)
          }

          function isDigit(char) {
            return '0123456789'.indexOf(char) > -1;
          }

        }
      }
    });
})();
