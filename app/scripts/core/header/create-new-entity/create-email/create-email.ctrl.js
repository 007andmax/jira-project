'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createEmailCtrl',
    ['$scope', 'ProductsService', 'CompaniesService', '$rootScope', 'quicktech.common.services.PermissionsService',
      'TaxesService', '$timeout',
    function ($scope, ProductsService, CompaniesService, $rootScope, PermissionsService, TaxesService, $timeout) {

      console.log('create email template', $scope.selectedUsers)

      $scope.emails = [];



      if ($scope.selectedUsers) {
        $scope.allUsersEmails = $scope.usersCtrl.shownUsers.map(function(el) {
          return el.primaryEmail;
        })
        $scope.selectedUsersCopy = Object.assign({}, $scope.selectedUsers);
        delete $scope.selectedUsersCopy.all;

        $scope.emails = $scope.usersCtrl.shownUsers.reduce(function(acc, el) {
          if ($scope.selectedUsersCopy[el.id]) {
            acc.push(el.primaryEmail);
          }

          return acc;
        }, [])


        console.log($scope.emails)
      } else if ($scope.selectedCompanies) {
        console.log($scope.companiesCtrl.shownCompanies, "SHOWNNNNN")
        $scope.allUsersEmails = $scope.companiesCtrl.shownCompanies.map(function(el) {

          return el.companyInfo.contacts[0].primaryEmail;
        })

        $scope.selectedCompaniesCopy = Object.assign({}, $scope.selectedCompanies);
        delete $scope.selectedCompaniesCopy.all;

        $scope.emails = $scope.companiesCtrl.shownCompanies.reduce(function(acc, el) {
          if ($scope.selectedCompaniesCopy[el.id]) {
            acc.push(el.companyInfo.contacts[0].primaryEmail);
          }

          return acc;
        }, [])


        console.log($scope.emails)


      }
    }]);

}());
