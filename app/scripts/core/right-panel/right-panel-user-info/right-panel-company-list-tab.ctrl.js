'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCompanyListTabCtrl',
    ['$scope', 'RightPanelService', 'TicketTagsService', '$stateParams', 'quicktech.common.services.PermissionsService',
      'CompaniesService', 'quicktech.common.services.SharedStateService', 'UsersService',
      function ($scope, RightPanelService, TicketTagsService, $stateParams, PermissionsService, CompaniesService, SharedStateService, UsersService) {

        $scope.selectedCompanyUsers = {};
        $scope.currentOpenCompanyMode = '';

        $scope.openCompanyInfo = function (companyId) {
          $scope.currentOpenCompany = companyId;
          $scope.selectedCompanyUsers = {};
          $scope.currentOpenCompanyMode = 'USERS-' + companyId;
        };

        $scope.openCompanyTab = function(mode, companyId){
          $scope.currentOpenCompanyMode = mode + companyId;
          $scope.currentOpenCompany = companyId;
        };

        $scope.sendEmailInPopover = function(userId){
          console.log('send email ' + userId)
        };

      }]);

}());
