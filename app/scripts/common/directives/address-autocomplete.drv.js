'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("addressAutocomplete",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          model: '=ngModel',
          showValidationMessages: '=showValidationMessages'
        },
        templateUrl: function (elem, attr) {
          return '/html/scripts/core/' + attr.templatePage + '/address-autocomplete.tpl.html';
        },
        link: function ($scope, element, attrs, ngModelCtrl) {

          var defaultZoom = 17,
            defaultCenter = new google.maps.LatLng(41.9955835, -93.63813119999998),
            mapOptions = {
              center: defaultCenter,
              zoom: defaultZoom
            },
            mapDiv = element.find('[map]')[0],
            input = element.find('input'),
            inputCtrl = input.controller('ngModel'),
            autocomplete = new google.maps.places.Autocomplete(input[0]);

          var hasLocation = ngModelCtrl.$viewValue.locationLat && ngModelCtrl.$viewValue.locationLng;
          if (hasLocation) {
            mapOptions.center = new google.maps.LatLng(ngModelCtrl.$viewValue.locationLat, ngModelCtrl.$viewValue.locationLng);
          }

          var map = new google.maps.Map(mapDiv, mapOptions),
            marker = new google.maps.Marker({
              map: map,
              anchorPoint: new google.maps.Point(0, -29)
            });
          autocomplete.setTypes(['address']);

          $scope.$watch(function () {
            return ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.address;
          }, resetMap);

          input.on('change', function () {
            inputCtrl.$setValidity('correct', false);

            ngModelCtrl.$viewValue.countryCode = undefined;
            ngModelCtrl.$viewValue.locationLat = undefined;
            ngModelCtrl.$viewValue.locationLng = undefined;
          });

          google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();

            inputCtrl.$setValidity('correct', !!place && !!place.geometry);

            if (!place || !place.geometry) {
              return;
            }

            ngModelCtrl.$viewValue.address = input.val();
            ngModelCtrl.$viewValue.countryCode = getCountryCode(place);
            ngModelCtrl.$viewValue.locationLat = place.geometry.location.G;
            ngModelCtrl.$viewValue.locationLng = place.geometry.location.K;

          });

          function getCountryCode(place) {
            for (var i = 0; i < place.address_components.length; i++) {
              var addressType = place.address_components[i].types[0];
              if (addressType === 'country') {
                return place.address_components[i].short_name;
              }
            }
          }

          function resetMap() {

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
