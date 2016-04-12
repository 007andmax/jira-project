'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.editCompanyCtrl',
    ['$scope', 'CompaniesService', '$stateParams', '$state',
      function ($scope, CompaniesService, $stateParams, $state) {

        $scope.getNameHeader = function(){

          if($stateParams.companyId){

            var company =  CompaniesService.getOneById($stateParams.companyId);
            return 'Edit ' + company.name;

          } else {
            return 'Create Company';
          }

        };

        $scope.back = function () {
          if($stateParams.companyId){
            $state.go('companyProfile', { companyId: $stateParams.companyId });
          } else {
            $state.go('companies');
          }
        };

      }]);

}());
