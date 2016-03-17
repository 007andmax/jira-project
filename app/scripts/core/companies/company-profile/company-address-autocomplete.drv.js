'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("companyAddressAutocomplete",
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          model: '=ngModel',
          showValidationMessages: '=showValidationMessages',
          isMapShown: "="
        },
        templateUrl: '/html/scripts/core/companies/company-profile/address-autocomplete.tpl.html',
        link: function ($scope, element, attrs, ngModelCtrl) {

          var defaultZoom = 15,
            defaultCenter = new google.maps.LatLng(41.9955835, -93.63813119999998),
            mapOptions = {
              center: defaultCenter,
              zoom: defaultZoom,
              zoomControl: true,
              scaleControl: true,
              scrollwheel: false,
              streetViewControl: false,
              zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
              }
            },
            mapDiv = element.find('[map]')[0],
            map,
            marker;

          $scope.$watch(function () {
            return ngModelCtrl.$viewValue
          }, function (val) {
            if (val) {

              var hasLocation = ngModelCtrl.$viewValue.locationLat && ngModelCtrl.$viewValue.locationLng;

              if (hasLocation) {
                mapOptions.center = new google.maps.LatLng(ngModelCtrl.$viewValue.locationLat, ngModelCtrl.$viewValue.locationLng);
              }

              map = new google.maps.Map(mapDiv, mapOptions);
              marker = new google.maps.Marker({
                map: map,
                position: {
                  lat: ngModelCtrl.$viewValue.locationLat,
                  lng: ngModelCtrl.$viewValue.locationLng
                }
              });
            }
          }, true);

        }
      }
    }]);

})();
