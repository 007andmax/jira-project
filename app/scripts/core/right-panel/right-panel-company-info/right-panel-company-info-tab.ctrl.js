'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCompanyInfoTabCtrl',
    ['$scope', 'CompaniesService', 'DevicesService', 'UsersService',
      function ($scope, CompaniesService, DevicesService, UsersService) {

        $scope.$watch('companyGroupedData.company.id', function () {
          $scope.companyContacts = CompaniesService.getCompanyContacts($scope, $scope.companyGroupedData.company.id);

          DevicesService.getDefaultCompanyCredentials($scope.companyGroupedData.company.id, function (resp) {
            $scope.isCompanyHasUserNameAndPass = (resp.login || resp.password);
          });

          $scope.downloadAgentUser = {
            name: '',
            password: '',
            companyId: $scope.companyGroupedData.company.id
          };
        });

        $scope.sendEmailInPopover = function (contactId) {
          var user = UsersService.getOneById(contactId);
          window.open("mailto:" + user.primaryEmail, '_parent');
        };

        $scope.downloadAgent = function () {
          DevicesService.downloadAgent($scope.downloadAgentUser.companyId, $scope.downloadAgentUser.name, $scope.downloadAgentUser.password, function () {
            $scope.isCompanyHasUserNameAndPass = true;
          })
        };

      }]);

}());
