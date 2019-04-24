'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("addressAutocomplete",
    ['$timeout', '$http', 'AddressesService', 'quicktech.common.services.GoogleMapService',
      function ($timeout, $http, AddressesService, GoogleMapService) {
        return {
          restrict: 'A',
          require: 'ngModel',
          scope: {
            model: '=ngModel',
            showValidationMessages: '=showValidationMessages',
            saveFunc: '=?',
            focusAddress: '=?',
            isAddressRequired: '=?',
            useAlternativeMap: '@?',
            onlyAddress: '<onlyAddress',
            qtTabIndex: '<qtTabIndex',
            activePlaceholder: '<activePlaceholder'

          },
          templateUrl: function (elem, attr) {
            return '/ng1/scripts/core/' + attr.templatePage + '/address-autocomplete.tpl.html';
          },
          link: function ($scope, element, attrs, ngModelCtrl) {

            var mapDiv = element.find('[map]'),
              input = element.find('[map-input]'),
              inputCtrl = input.controller('ngModel'),
              autocomplete = new google.maps.places.Autocomplete(input[0]),
              map,
              useAlternativeMap = $scope.$eval($scope.useAlternativeMap),
              marker,
              centerLatLng,
              savedAddress = ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.address;

            var hasLocation = ngModelCtrl.$viewValue.locationLat && ngModelCtrl.$viewValue.locationLng;

            if (hasLocation) {
              centerLatLng = {
                lat: ngModelCtrl.$viewValue.locationLat,
                lng: ngModelCtrl.$viewValue.locationLng
              };
            }

            if (!mapDiv.length) {
              mapDiv = angular.element(document).find('[alternative-map]');
            }
            var googleData = GoogleMapService.createMap(mapDiv, centerLatLng, useAlternativeMap);

            map = googleData.map;
            marker = googleData.marker;

            $scope.isShowingErrors = function (form, fieldName) {
              return form && form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
            };

            autocomplete.setTypes(['address']);

            $scope.$watch(function () {
              return ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.address;
            }, function () {
              if (inputCtrl) {
                if (!savedAddress && ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.address) {
                  savedAddress = ngModelCtrl.$viewValue.address;
                }

                resetMap();
              }
            });

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
              var place = autocomplete.getPlace();

              inputCtrl.$setValidity('correct', !!place && !!place.geometry);

              if (!place || !place.geometry) {
                return;
              }

              ngModelCtrl.$viewValue.address = savedAddress = input.val();
              ngModelCtrl.$viewValue.locationLat = place.geometry.location.lat();
              ngModelCtrl.$viewValue.locationLng = place.geometry.location.lng();

              ngModelCtrl.$viewValue.postalCode = '';

              for (var i = 0, len = place.address_components.length; i < len; i++) {
                if (place.address_components[i].types.indexOf('country') !== -1) {
                  ngModelCtrl.$viewValue.country = place.address_components[i].long_name;
                  ngModelCtrl.$viewValue.countryCode = place.address_components[i].short_name;
                }
                if (place.address_components[i].types.indexOf('postal_code') !== -1) {
                  ngModelCtrl.$viewValue.postalCode = place.address_components[i].short_name;
                }
                if (place.address_components[i].types.indexOf('locality') !== -1) {
                  ngModelCtrl.$viewValue.longCity = place.address_components[i].long_name;
                  ngModelCtrl.$viewValue.shortCity = place.address_components[i].short_name;
                }
                if (place.address_components[i].types.indexOf('administrative_area_level_1') !== -1) {
                  ngModelCtrl.$viewValue.longState = place.address_components[i].long_name;
                  ngModelCtrl.$viewValue.shortState = place.address_components[i].short_name;
                }
              }

              $http.get('https://maps.googleapis.com/maps/api/timezone/json?location= ' +
                ngModelCtrl.$viewValue.locationLat + ',' + ngModelCtrl.$viewValue.locationLng +
                '&timestamp=0&key=AIzaSyAgGwfeFw-YYwcH600VwXs7uwoPp-wMHyI')
                .then(function successCallback(response) {
                  if (response.data.timeZoneId) {
                    AddressesService.getLocaleByName(response.data.timeZoneId, function (timeZoneObj) {
                      ngModelCtrl.$viewValue.locale = timeZoneObj.name;
                      ngModelCtrl.$viewValue.timeZone = timeZoneObj;
                      ngModelCtrl.$viewValue.fromGoogle = true;
                      $timeout(function () {
                        $scope.saveFunc && $scope.saveFunc();
                      })
                    })
                  }
                }, function errorCallback(response) {
                  var message;
                  if (response.data) {
                    message = response.data.message || 'no provided message in response';
                  } else {
                    message = 'empty response';
                  }
                  console.error('Error: ' + message);
                });
            });

            function resetMap() {

              var hasMark = ngModelCtrl.$viewValue &&
                ngModelCtrl.$viewValue.locationLat &&
                ngModelCtrl.$viewValue.locationLng &&
                savedAddress === ngModelCtrl.$viewValue.address;

              if (ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.address) {
                //
                // commented code to add ability of custom address (add address manually)
                //
                //inputCtrl.$setValidity('correct', !!hasMark);
              } else {
                inputCtrl.$setValidity('correct', true);
              }

              var hasLocation = ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.locationLat && ngModelCtrl.$viewValue.locationLng;

              if (hasLocation) {
                var centerLatLng = {
                  lat: ngModelCtrl.$viewValue.locationLat,
                  lng: ngModelCtrl.$viewValue.locationLng
                };

                GoogleMapService.setCenter(centerLatLng, useAlternativeMap);
                marker.setVisible(true);
              } else {
                marker.setVisible(false);
              }

            }
          }
        }
      }]);
})();
