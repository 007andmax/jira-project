'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.vendorCtrl',
    ['$scope', 'CompaniesService', 'VendorsService',
      function ($scope, CompaniesService, VendorsService) {

        $scope.locationIndex = 0;
        $scope.currentLocation = $scope.vendor.addresses[$scope.locationIndex];
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;

        $scope.setShownSection = function (val) {
          $scope.shownSection = val;
        };

        //todo get contacts from db

        $scope.changeCurrentLocation = function (change) {
          change === 'right' ? $scope.locationIndex++ : $scope.locationIndex--;
          if (0 <= $scope.locationIndex && $scope.locationIndex < $scope.vendor.addresses.length) {
            $scope.currentLocation = $scope.vendor.addresses[$scope.locationIndex];
          } else {
            change === 'right' ? $scope.locationIndex-- : $scope.locationIndex++;
          }
        };

        $scope.archiveVendor = function () {
          VendorsService.archive($scope.vendor.id);
        };

        $scope.sendMail = function () {
          console.log('send mail ' + $scope.vendor.name);
        }

      }]);

}());
