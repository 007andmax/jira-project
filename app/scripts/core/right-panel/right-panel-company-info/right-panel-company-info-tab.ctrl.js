'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCompanyInfoTabCtrl',
    ['$scope', '$rootScope', 'RightPanelService', 'TicketTagsService', '$stateParams', 'quicktech.common.services.PermissionsService',
      'CompaniesService', 'quicktech.common.services.SharedStateService', 'UsersService',
      function ($scope, $rootScope, RightPanelService, TicketTagsService, $stateParams, PermissionsService, CompaniesService) {

        $scope.$watch('companyGroupedData.company.id', function(){
          $scope.companyContacts = CompaniesService.getCompanyContacts($scope, $scope.companyGroupedData.company.id);
        });

        $scope.sendEmailInPopover = function (contactId) {
          console.log('send email in popover ' + contactId)
        };

      }]);

}());
