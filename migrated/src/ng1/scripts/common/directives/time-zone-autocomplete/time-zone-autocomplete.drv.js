'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("timeZoneAutocomplete", ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: '/ng1/scripts/common/directives/time-zone-autocomplete/time-zone-autocomplete.tpl.html',
      scope: {
        timeZones: '=',
        address: '=',
        saveFunc: '=?',
        qtTabIndex: '<qtTabIndex',
        activePlaceholder: '<activePlaceholder'
      },
      link: function ($scope, element) {
        var currentFocused,
          isOnFirstLevel = true,
          firstLevel = [],
          secondLevel = [],
          saveIndex,
          firstIndex,
          dropdown,
          anotherDropdown = false;

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

        $scope.$on('$destroy', function () {
          element.off('keydown', onKeyDown);
        });

        element.on('keydown', onKeyDown);

        function onKeyDown(e) {
          dropdown = element.find('.dropdown');

          if (dropdown.hasClass('open')) {
            if ($scope.filteredTimeZones && $scope.filteredTimeZones.length) {
              isOnFirstLevel = false;
              anotherDropdown = true;
              secondLevel = element.find('.time-zone-dropdown .time-zone.focusable');
            } else {
              firstLevel = element.find('.time-zone-dropdown .cities-names').children('.focusable');
              if (anotherDropdown) {
                isOnFirstLevel = true;
                anotherDropdown = false;
                firstIndex = undefined;
                saveIndex = 0;
              }
            }

            switch (e.which || e.keyCode) {
              case 13://enter
              {
                if (currentFocused) {
                  if (isOnFirstLevel && currentFocused.hasClass('expandable')) {
                    currentFocused.removeClass('time-zone-focused');
                    currentFocused.addClass('expanded');
                    $scope.expand($scope.citiesExpanded[currentFocused.attr('locale').split('/')[0] + currentFocused.attr('offset')], e);
                    secondLevel = currentFocused.siblings();
                    currentFocused = angular.element(secondLevel[0]);
                    currentFocused.addClass('time-zone-focused');
                    saveIndex = firstIndex;
                    firstIndex = 0;
                    isOnFirstLevel = false;
                  } else {
                    $scope.setTimeZone(currentFocused.attr('locale'), currentFocused.attr('offset'));
                    firstIndex = undefined;
                    saveIndex = 0;
                    isOnFirstLevel = true;
                    $timeout(closeDropdown);
                  }
                  $scope.$apply();
                }
                break;
              }
              case 27://escape
              {
                var currentParent = currentFocused.parent();
                if (currentParent.hasClass('expandable')) {
                  currentFocused.removeClass('time-zone-focused');
                  currentParent.removeClass('expanded');
                  $scope.expand($scope.citiesExpanded[currentFocused.attr('locale').split('/')[0] + currentFocused.attr('offset')], e, false);
                  $scope.$apply();
                  firstIndex = saveIndex;
                  currentFocused = changeFocus(currentFocused, firstLevel, firstIndex);
                  saveIndex = 0;
                } else {
                  firstIndex = undefined;
                  saveIndex = 0;
                  closeDropdown();
                }
                isOnFirstLevel = true;
                break;
              }
              case 38://up
              {
                if (!firstIndex) {
                  firstIndex = (isOnFirstLevel ? firstLevel.length : secondLevel.length) - 1;
                } else {
                  firstIndex--;
                }
                currentFocused = changeFocus(currentFocused, isOnFirstLevel ? firstLevel : secondLevel, firstIndex);
                break;
              }
              case 40://down
              {
                if (firstIndex === undefined || firstIndex === (isOnFirstLevel ? firstLevel.length : secondLevel.length) - 1) {
                  firstIndex = 0;
                } else {
                  firstIndex++;
                }
                currentFocused = changeFocus(currentFocused, isOnFirstLevel ? firstLevel : secondLevel, firstIndex);
                break;
              }

              default:
                return;
            }
            e.stopPropagation();
          } else {
            var keyCode = e.which || e.keyCode;
            if (keyCode === 13 || keyCode === 27 || keyCode === 38 || keyCode === 40) {
              dropdown.addClass('open');
            }
          }
        }

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

        function closeDropdown() {
          dropdown.removeClass('open');
          if (currentFocused) {
            currentFocused.removeClass('time-zone-focused');
            currentFocused = undefined;
          }
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
          $timeout($scope.saveFunc);
          $scope.timeZoneForm.$setPristine();
        };

        $scope.formatOffset = function (offset) {
          var minutesOffset = offset / 60000,
            sign = +offset < 0 ? '-' : '+',
            hours = Math.abs(Math.floor(minutesOffset / 60)) || '00',
            minutes = Math.abs(minutesOffset % 60) || '00';

          return '(UTC ' + sign + (hours.toString().length !== 2 ? ('0' + hours) : hours) +
            ':' + (minutes.toString().length !== 2 ? ('0' + minutes) : minutes) + ') ';
        };

        $scope.isShowingErrors = function (form, field) {
          return form && form[field] && form[field].$dirty && !$scope.address.fromGoogle;
        };

        $scope.expand = function (item, event, isClose) {
          item.expanded = isClose !== undefined ? isClose : !item.expanded;
          event.stopPropagation();
        };

        $scope.$watch('address.locale', function (locale) {
          console.log('locale',locale);
          if (locale && locale.length) {
            var matches = offsetPattern.exec(locale);
            matches ? filterTimeZones(null, parseOffset(matches)) : filterTimeZones(locale.split('/').pop());
            if ($scope.address.timeZone && locale !== $scope.address.timeZone.name) {
              $scope.address.fromGoogle = false;
            }
          } else if ($scope.address && $scope.address.country) {
            $scope.address.fromGoogle = false;

            var filteredTimeZones = [];
            for (var i = 0; i < $scope.timeZonesMapped.length; i++) {
              var timeZone = $scope.timeZonesMapped[i],
                country = timeZone.country;

              if (!Object.keys($scope.timeZones[$scope.address.country] || {}).length) {
                break;
              }

              if (country === $scope.address.country) {
                filteredTimeZones.push({ name: country + '/' + timeZone.city, offset: timeZone.offset });
              }
            }
            $scope.filteredTimeZones = filteredTimeZones;
          } else if ($scope.address) {
            $scope.address.fromGoogle = false;
          }

          $scope.preventDropDownOpening = $scope.address && $scope.address.fromGoogle;
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
          var filteredTimeZones = [];

          for (var i = 0, len = $scope.timeZonesMapped.length; i < len; i++) {
            var obj = $scope.timeZonesMapped[i],
              country = obj.country,
              city = obj.city,
              offsetValue = obj.offset,
              isCityFound = name && city.toLowerCase().indexOf(name.toLowerCase()) !== -1,
              isOffsetFound = angular.isNumber(offset) && offset === offsetValue,
              isCountryFound = name && country.toLowerCase().indexOf(name.toLowerCase()) !== -1;

            if ($scope.address && $scope.address.country) {
              if (Object.keys($scope.timeZones[$scope.address.country] || {}).length && country !== $scope.address.country) {
                continue;
              }
            }

            if (isCityFound || isCountryFound || isOffsetFound) {
              filteredTimeZones.push({ name: country + '/' + city, offset: offsetValue });
            }
          }

          $scope.filteredTimeZones = filteredTimeZones;
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
