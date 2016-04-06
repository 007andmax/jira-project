'use strict';

(function () {

  angular.module('quicktech.core.vendors').controller('quicktech.core.vendors.vendorCtrl',
    ['$scope', 'CompaniesService', 'VendorsService', '$timeout', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, CompaniesService, VendorsService, $timeout, UserConfirmationsService) {

        $scope.locationIndex = 0;
        $scope.currentLocation = $scope.vendor.addresses[$scope.locationIndex];
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;

        //todo get contacts from db

        $scope.changeCurrentLocation = function (index) {
          if (0 <= index && index < $scope.vendor.addresses.length) {
            $scope.locationIndex = index;
            $timeout(function () {
              $scope.currentLocation = $scope.vendor.addresses[$scope.locationIndex];
            }, 300)
          }
        };

        $scope.archiveVendor = function () {
          var confirmMesage = 'Do you want to archive ' + $scope.vendor.name + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            VendorsService.archive($scope.vendor.id);
          });
        };

        $scope.getPrimaryBillengAddress = function () {
          for (var i = 0; i < $scope.vendor.addresses.length; i++) {
            if ($scope.vendor.addresses[i].isPrimary) {
              var address = $scope.vendor.addresses[i].suiteNumber ? $scope.vendor.addresses[i].suiteNumber + ', ' : '';
              address += $scope.vendor.addresses[i].address;
              address += $scope.vendor.addresses[i].postalCode ? ', ' + $scope.vendor.addresses[i].postalCode : '';
              return address;
            }
          }
        };

        $scope.getPriorityContact = function () {
          var priorityContact = $scope.vendor.contacts[0];

          for (var i = 1, len = $scope.vendor.contacts.length; i < len; i++) {
            if ($scope.vendor.contacts[i].priority < priorityContact.priority) {
              priorityContact = $scope.vendor.contacts[i]
            }
          }

          return priorityContact;
        }

      }]);

}());
