'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCompanyInfoTabCtrl',
    ['$scope', 'CompaniesService', 'DevicesService',
      function ($scope, CompaniesService, DevicesService) {

        $scope.$watch('companyGroupedData.company.id', function () {
          $scope.companyContacts = CompaniesService.getCompanyContacts($scope, $scope.companyGroupedData.company.id);

          DevicesService.isCompanyHasUserNameAndPass($scope.companyGroupedData.company.id, function(resp){
            $scope.isCompanyHasUserNameAndPass = resp;
          });

          $scope.downloadAgentUser = {
            name: '',
            password: '',
            companyId: $scope.companyGroupedData.company.id
          };
        });

        $scope.sendEmailInPopover = function (contactId) {
          console.log('send email in popover ' + contactId)
        };

        $scope.downloadAgent = function(){
          DevicesService.downloadAgent($scope.downloadAgentUser.companyId, $scope.downloadAgentUser.name, $scope.downloadAgentUser.password, function(){
            $scope.isCompanyHasUserNameAndPass = true;
          })
        };

      }]);

}());
