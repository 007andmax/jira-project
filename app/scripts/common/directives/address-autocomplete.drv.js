'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("addressAutocomplete",
    ['$timeout', '$http', 'AddressesService', '$rootScope', function ($timeout, $http, AddressesService, $rootScope) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          model: '=ngModel',
          showValidationMessages: '=showValidationMessages',
          isMapShown: "="
        },
        templateUrl: function (elem, attr) {
          return '/html/scripts/core/' + attr.templatePage + '/address-autocomplete.tpl.html';
        },
        link: function ($scope, element, attrs, ngModelCtrl) {

          var defaultZoom = 15,
            defaultCenter = new google.maps.LatLng(41.9955835, -93.63813119999998),
            mapOptions = {
              center: defaultCenter,
              zoom: defaultZoom,
              zoomControl: true,
              scaleControl: true,
              scrollwheel: false,
              zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
              }
            },
            mapDiv = element.find('[map]')[0],
            input = element.find('[map-input]'),
            inputCtrl = input.controller('ngModel'),
            autocomplete = new google.maps.places.Autocomplete(input[0]),
            map,
            marker;

          var hasLocation = ngModelCtrl.$viewValue.locationLat && ngModelCtrl.$viewValue.locationLng;
          if (hasLocation) {
            mapOptions.center = new google.maps.LatLng(ngModelCtrl.$viewValue.locationLat, ngModelCtrl.$viewValue.locationLng);
          }

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
          };

          map = new google.maps.Map(mapDiv, mapOptions);
          marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
          });
          autocomplete.setTypes(['address']);

          $scope.$watch(function () {
            return ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.address;
          }, function () {
            resetMap(google, map, marker, inputCtrl);
          });

          $scope.$watch('isMapShown', function (val) {
            if (val) {
              $timeout(function () {
                var center = map.getCenter();
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
              }, 0);
            }
          });

          google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();

            inputCtrl.$setValidity('correct', !!place && !!place.geometry);

            if (!place || !place.geometry) {
              return;
            }

            ngModelCtrl.$viewValue.address = input.val();
            ngModelCtrl.$viewValue.countryCode = getCountryCode(place);
            ngModelCtrl.$viewValue.locationLat = place.geometry.location.lat();
            ngModelCtrl.$viewValue.locationLng = place.geometry.location.lng();

            for (var i = 0, len = place.address_components.length; i < len; i++) {
              if (place.address_components[i].types.indexOf('country') !== -1) {
                ngModelCtrl.$viewValue.country = place.address_components[i].long_name;
              }
            }

            $http.get('https://maps.googleapis.com/maps/api/timezone/json?location= ' +
                ngModelCtrl.$viewValue.locationLat + ',' + ngModelCtrl.$viewValue.locationLng +
                '&timestamp=0&key=AIzaSyCJ40cLJD6gFdZ6j6HXf1D9oh8AK_BlW-Y')
              .then(function successCallback(response) {
                if (response.data.timeZoneId) {
                  AddressesService.getLocaleByName(response.data.timeZoneId, function (timeZoneObj) {
                    ngModelCtrl.$viewValue.locale = timeZoneObj.name;
                    ngModelCtrl.$viewValue.timeZone = timeZoneObj;
                    ngModelCtrl.$viewValue.fromGoogle = true;
                  })
                }
              }, function errorCallback(response) {
                console.log('error: ' + response.data ? (response.data.message || 'no provided message') : 'empty response');
              });

            if (place.address_components) {
              for (var i = place.address_components.length - 1; i >= 0; i--) {

                var isAddressTypesExist = place.address_components[i] && place.address_components[i].types;

                if (isAddressTypesExist && place.address_components[i].types[0] === 'postal_code') {
                  ngModelCtrl.$viewValue.postalCode = place.address_components[i].short_name;
                  break;
                } else {
                  ngModelCtrl.$viewValue.postalCode = '';
                }

              }
            }

            $scope.$apply();

            $rootScope.$broadcast('set-phone-number-prefix', ngModelCtrl.$viewValue.countryCode);
          });

          function getCountryCode(place) {
            for (var i = 0; i < place.address_components.length; i++) {
              var addressType = place.address_components[i].types[0];
              if (addressType === 'country') {
                return place.address_components[i].short_name;
              }
            }
          }

          function resetMap(google, map, marker, inputCtrl) {

            var hasMark = ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.locationLat && ngModelCtrl.$viewValue.locationLng;

            inputCtrl.$setValidity('correct', !!hasMark);

            var hasLocation = ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.locationLat && ngModelCtrl.$viewValue.locationLng;

            if (hasLocation) {
              var position = new google.maps.LatLng(ngModelCtrl.$viewValue.locationLat, ngModelCtrl.$viewValue.locationLng);

              marker.setPosition(position);
              marker.setVisible(true);

              map.setCenter(position);

            } else {
              marker.setVisible(false);
            }

          }
        }
      }
    }]);

})();
