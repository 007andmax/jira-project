'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("timeZoneAutocomplete", function () {
      return {
        restrict: 'E',
        templateUrl: '/html/scripts/common/directives/time-zone-autocomplete/time-zone-autocomplete.tpl.html',
        scope: {
          timeZones: '=',
          address: '='
        },
        controller: function ($scope) {
          var offsetPattern = /(\+|\-)?(\d{1,2}):?(\d{1,2})?/;
          $scope.citiesExpanded = [];

          $scope.setTimeZone = function (timeZoneName, offset) {
            $scope.address.timeZone = $scope.address.timeZone || {};
            $scope.address.locale = timeZoneName;
            $scope.address.timeZone.name = timeZoneName;
            $scope.address.timeZone.timeOffset = offset;
            $scope.timeZoneForm.$setPristine();
          };

          $scope.formatOffset = function (offset) {
            var minutesOffset = offset / 60000,
              sign = Math.sign(offset) === -1 ? '-' : '+',
              hours = Math.abs(Math.floor(minutesOffset / 60)) || '00',
              minutes = Math.abs(minutesOffset % 60) || '00';

            return '(UTC ' + sign + (hours.toString().length !== 2 ? ('0' + hours) : hours) +
              ':' + (minutes.toString().length !== 2 ? ('0' + minutes) : minutes) + ') ';
          };

          $scope.isShowingErrors = function(form, field) {
            return form[field] && form[field].$dirty;
          };

          $scope.expand = function (item, event) {
            item.expanded = !item.expanded;
            event.stopPropagation();
          };

          $scope.$watch('address.locale', function (locale) {
            if (locale && locale.length) {
              var matches = offsetPattern.exec(locale);
              matches ? filterTimeZones(null, parseOffset(matches)) : filterTimeZones(locale.split('/').pop());
            }
          });

          $scope.showDropDown = function () {
            return $scope.timeZoneForm.$dirty || !$scope.address.locale;
          };

          $scope.eraseInput = function (event) {
            $scope.address.locale = '';
            $scope.timeZoneForm.timeZone.$setDirty();
            event.stopPropagation();
          };

          function filterTimeZones(name, offset) {
            $scope.filteredTimeZones = [];
            for (var prop in $scope.timeZones) {
              for (var timeZone in $scope.timeZones[prop]) {
                var group = $scope.timeZones[prop][timeZone];
                for (var index in group) {
                  var city = group[index];
                  if (name && city.toLowerCase().indexOf(name.toLowerCase()) !== -1)
                    $scope.filteredTimeZones.push({ name: prop + '/' + city, offset: timeZone });
                  if ((offset || offset === 0) && offset === parseInt(timeZone))
                    $scope.filteredTimeZones.push({ name: prop + '/' + city, offset: timeZone });
                }
              }
            }
          }

          function parseOffset(matches) {
            var minutes = parseInt(matches[3]) || 0,
              hours = parseInt(matches[2]) || 0,
              offset = hours * 3600000 + minutes * 60000;

            return matches[1] === '-' ? -offset : offset;
          }
        }
      }
    });

})();
