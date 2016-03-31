'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("timeZoneAutocomplete", [
    '$document', function ($document) {
      return {
        restrict: 'E',
        templateUrl: '/html/scripts/common/directives/time-zone-autocomplete/time-zone-autocomplete.tpl.html',
        scope: {
          timeZones: '=',
          address: '='
        },
        link: function ($scope) {
          var currentFocused,
            firstLevel = [],
            secondLevel = [],
            expanded = false,
            saveIndex = 0,
            firstIndex = 0;

          $scope.timeZonesMapped = [];

          for (var prop in $scope.timeZones) {
            for (var timeZone in $scope.timeZones[prop]) {
              var group = $scope.timeZones[prop][timeZone];
              for (var index in group) {
                var city = group[index];
                $scope.timeZonesMapped.push({
                  offset: parseInt(timeZone),
                  country: prop,
                  city: city
                });
              }
            }
          }

          $document.on('keydown', function (e) {
            if ($document.find('.dropdown').hasClass('open')) {
              if (!firstLevel.length){
                firstLevel = angular.element($document.find('.time-zone-dropdown .cities-names')).children('.focusable');
                currentFocused = angular.element(firstLevel[0]);
              }

              switch (e.which || e.keyCode) {
                case 13:
                {
                  if (currentFocused) {
                    currentFocused.removeClass('time-zone-focused');
                    if (currentFocused.hasClass('expandable')) {
                      $scope.expand($scope.citiesExpanded[currentFocused.attr('locale').split('/')[0] + currentFocused.attr('offset')], e);
                      secondLevel = currentFocused.siblings();
                      currentFocused = angular.element(secondLevel[0]);
                      currentFocused.addClass('time-zone-focused');
                      expanded = true;
                      saveIndex = firstIndex;
                      firstIndex = 0;
                    }
                    else {
                      $scope.setTimeZone(currentFocused.attr('locale'), currentFocused.attr('offset'));
                      firstIndex = 0;
                      saveIndex = 0;
                      currentFocused = angular.element(firstLevel[0]);
                    }

                    $scope.$apply();
                  }

                  break;
                }
                case 27:
                {
                  currentFocused.removeClass('time-zone-focused');
                  currentFocused = angular.element(firstLevel[saveIndex]);
                  if (currentFocused.hasClass('expandable')) {
                    $scope.expand($scope.citiesExpanded[currentFocused.attr('locale').split('/')[0] + currentFocused.attr('offset')], e);
                    $scope.$apply();
                    currentFocused.addClass('time-zone-focused');
                    expanded = false;
                    firstIndex = saveIndex;
                    saveIndex = 0;
                  }
                  break;
                }
                case 38:
                {
                  if (!expanded) {
                    if (--firstIndex < 0) firstIndex = firstLevel.length - 1;
                    currentFocused = changeFocus(currentFocused, firstLevel, firstIndex);
                  } else {
                    if (--firstIndex < 0) firstIndex = secondLevel.length - 1;
                    currentFocused = changeFocus(currentFocused, secondLevel, firstIndex);
                  }
                  break;
                }
                case 40:
                {
                  if (!expanded) {
                    if (++firstIndex >= firstLevel.length) firstIndex = 0;
                    currentFocused = changeFocus(currentFocused, firstLevel, firstIndex);
                  } else {
                    if (++firstIndex >= secondLevel.length) firstIndex = 0;
                    currentFocused = changeFocus(currentFocused, secondLevel, firstIndex);
                  }
                  break;
                }

                default:
                  return;
              }
              e.preventDefault();
            }
          });

          function changeFocus(current, array, index) {
            var temp;

            current = angular.element(current);
            temp = angular.element(array[index]);

            current.removeClass('time-zone-focused');
            current = temp;
            current.addClass('time-zone-focused');
            current[0].scrollIntoViewIfNeeded(false);
            return current;
          }
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

          $scope.isShowingErrors = function (form, field) {
            return form[field] && form[field].$dirty && !$scope.address.fromGoogle;
          };

          $scope.expand = function (item, event) {
            item.expanded = !item.expanded;
            event.stopPropagation();
          };

          $scope.$watch('address.locale', function (locale) {
            if (locale && locale.length) {
              var matches = offsetPattern.exec(locale);
              matches ? filterTimeZones(null, parseOffset(matches)) : filterTimeZones(locale.split('/').pop());
              if ($scope.address.timeZone && locale !== $scope.address.timeZone.name) $scope.address.fromGoogle = false;
            }
          });

          $scope.showDropDown = function () {
            return $scope.timeZoneForm.$dirty || ($scope.address && !$scope.address.locale);
          };

          $scope.eraseInput = function (event) {
            $scope.address.locale = '';
            $scope.timeZoneForm.timeZone.$setDirty();
            $scope.address.fromGoogle = false;
            event.stopPropagation();
          };

          function filterTimeZones(name, offset) {
            $scope.filteredTimeZones = [];
            for (var prop in $scope.timeZonesMapped) {
              var obj = $scope.timeZonesMapped[prop],
                country = obj.country,
                city = obj.city,
                offsetValue = obj.offset;

              if ((name && city.toLowerCase().indexOf(name.toLowerCase()) !== -1) || (angular.isNumber(offset) && offset === offsetValue)) {
                $scope.filteredTimeZones.push({ name: country + '/' + city, offset: offsetValue });
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
    }
  ]);

})();
