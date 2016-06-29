'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.usersCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'CompaniesService', 'UsersService',
      function ($scope, SharedStateService, CompaniesService, UsersService) {
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.searchValue = '';
        $scope.chooseCompany = false;
        $scope.sharedState = SharedStateService.getSharedState('usersHeader');
        $scope.companies = CompaniesService.getClientCompanies().filter(function (company) {
          return !company.isDefault;
        });

        if (globalSearch.userFilter) {
          var selectedUser = UsersService.getOneById(globalSearch.userFilter);
          $scope.searchValue = selectedUser.firstName + ' ' + selectedUser.lastName;
          globalSearch.userFilter = undefined;
        }

        $scope.clearInput = function () {
          $scope.searchValue = '';
          $scope.chooseCompany = false;
          $scope.sharedState.filter.companyId = '';
          $scope.sharedState.filter.keyword = '';
        };

        $scope.$watch('searchValue', function (val) {
          if (!val) {
            return
          }

          if (typeof val === 'object') {
            $scope.chooseCompany = true;
            $scope.sharedState.filter.companyId = val.id;
            $scope.sharedState.filter.keyword = '';
          } else {
            $scope.chooseCompany = false;
            $scope.sharedState.filter.companyId = '';
            $scope.sharedState.filter.keyword = val;
          }
        });

        $scope.$on('$destroy', function () {
          $scope.clearInput();
        })

      }]);

}());
