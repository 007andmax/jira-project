'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("companyAddressAutocomplete",
    ['$timeout', 'quicktech.common.services.GoogleMapService', function ($timeout, GoogleMapService) {
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

          var mapDiv = element.find('[map]');
          var map;

          $scope.$watch(function () {
            return ngModelCtrl.$viewValue
          }, function (val) {
            if (val) {

              var hasLocation = ngModelCtrl.$viewValue.locationLat && ngModelCtrl.$viewValue.locationLng;

              if (hasLocation) {
                var centerLatLng = {
                  lat: ngModelCtrl.$viewValue.locationLat,
                  lng: ngModelCtrl.$viewValue.locationLng
                };

                if (!map) {
                  map = GoogleMapService.createMap(mapDiv, centerLatLng).map;
                } else {
                  GoogleMapService.setCenter(centerLatLng)
                }

              }

            }
          }, true);

        }
      }
    }]);

})();
