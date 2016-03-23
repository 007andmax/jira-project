'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCompanyListTabCtrl',
    ['$scope', 'UsersService',
      function ($scope, UsersService) {

        $scope.selectedCompanyUsers = {};
        $scope.currentOpenCompanyMode = '';

        $scope.openCompanyInfo = function (companyId) {
          $scope.currentOpenCompany = companyId;
          $scope.selectedCompanyUsers = {};
          $scope.currentOpenCompanyMode = 'USERS-' + companyId;
        };

        $scope.openCompanyTab = function (mode, companyData) {

          if (mode === 'USERS-' && (!companyData.users || companyData.users.length < 1)) {
            return
          } else if (mode === 'DEVICES-' && (!companyData.devices || companyData.devices.length < 1)) {
            return
          }

          $scope.currentOpenCompanyMode = mode + companyData.company.id;
          $scope.currentOpenCompany = companyData.company.id;
        };

        $scope.sendEmailInPopover = function (userId) {
          var user = UsersService.getOneById(userId);
          window.open("mailto:" + user.primaryEmail);
        };

      }]);

}());
