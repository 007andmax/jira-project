'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyCtrl',
    ['$scope', 'CompaniesService', 'quicktech.common.services.UserNotificationService', 'UsersService', '$rootScope',
      function ($scope, CompaniesService, UserNotificationService, UsersService, $rootScope) {

        $scope.companyComponentsCount = {
          users: UsersService.getAllByCompanyId($scope.company.id)
        };

        initCompany();

        $rootScope.$on('newCompanyInfo'+$scope.company.id, function(){
          initCompany();
        });

        function initCompany() {
          if($scope.company) {
            var primaryContact,
              primaryAddress,
              primaryPhone;

            if ($scope.company.companyInfo) {

              console.log($scope.company.companyInfo, "COMPANY INFO");

              if ($scope.company.companyInfo.contacts) {
                for (var i = 0; i < $scope.company.companyInfo.contacts.length; i++) {
                  if (!primaryContact || $scope.company.companyInfo.contacts[i].priority > primaryContact.priority)
                    primaryContact = $scope.company.companyInfo.contacts[i];
                }
              }


              for (var i = 0; i < $scope.company.companyInfo.addresses.length; i++) {
                if ($scope.company.companyInfo.addresses[i].isPrimary) {
                  primaryAddress = $scope.company.companyInfo.addresses[i];
                }
              }

              if (primaryAddress && primaryAddress.phoneNumbers.length) {
                primaryPhone = primaryAddress.phoneNumbers[0];
              }
            }

            $scope.primaryContact = primaryContact;
            $scope.primaryAddress = primaryAddress;
            $scope.primaryPhone = primaryPhone;

            if (primaryAddress) {
              $scope.location = primaryAddress.addressWithSuitNumberAndPostalCode;
            } else {
              $scope.location = '';
            }
          }
        }


        $scope.getUserSubscribeClass = function () {
          if (!$scope.primaryContact || !$scope.primaryContact.subscription) {
            return;
          }

          if ($scope.primaryContact.subscription.ticket && $scope.primaryContact.subscription.invoice) {
            return 'badge-invoice-and-ticket-updates badge-updates';
          } else if ($scope.primaryContact.subscription.ticket && !$scope.primaryContact.subscription.invoice) {
            return 'badge-ticket-updates badge-updates';
          } else if (!$scope.primaryContact.subscription.ticket && $scope.primaryContact.subscription.invoice) {
            return 'badge-invoice-updates badge-updates';
          }
        };

      }]);

}());
