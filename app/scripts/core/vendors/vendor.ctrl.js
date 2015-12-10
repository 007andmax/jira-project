'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.vendorCtrl',
    ['$scope', 'CompaniesService', 'VendorsService', '$timeout',
      function ($scope, CompaniesService, VendorsService, $timeout) {

        $scope.locationIndex = 0;
        $scope.currentLocation = $scope.vendor.addresses[$scope.locationIndex];
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;

        //todo get contacts from db

        $scope.changeCurrentLocation = function (index) {
          if (0 <= index && index < $scope.vendor.addresses.length) {
            $scope.locationIndex = index;
            $timeout(function(){
              $scope.currentLocation = $scope.vendor.addresses[$scope.locationIndex];
            }, 300)
          }
        };

        $scope.archiveVendor = function () {
          VendorsService.archive($scope.vendor.id);
        };

        $scope.sendMail = function () {
          console.log('send mail ' + $scope.vendor.name);
        };

        $scope.getPrimaryBillengAddress = function(){
          for(var i = 0; i < $scope.vendor.addresses.length; i++){
            if($scope.vendor.addresses[i].isPrimary){
              return $scope.vendor.addresses[i].address;
            }
          }
        }

      }]);

}());
