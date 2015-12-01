'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.vendorCtrl',
    ['$scope', 'CompaniesService', 'VendorsService',
      function ($scope, CompaniesService, VendorsService) {

        $scope.locationIndex = 0;
        $scope.currentLocation = $scope.vendor.addresses[$scope.locationIndex];
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;

        //todo get contacts from db

        $scope.changeCurrentLocation = function (index) {
          if (0 <= index && index < $scope.vendor.addresses.length) {
            $scope.locationIndex = index;
            $scope.currentLocation = $scope.vendor.addresses[$scope.locationIndex];
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
