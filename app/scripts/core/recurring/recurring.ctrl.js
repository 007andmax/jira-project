'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.recurringCtrl',
    ['$scope', 'RecurringService', 'CompaniesService', '$rootScope',
      function ($scope, RecurringService, CompaniesService, $rootScope) {

        $scope.companySelection = {};

        $scope.recurringGraphData = RecurringService.getRecurringGraphData($scope);

        $scope.recurringCompanies = RecurringService.getRecurringCompanies($scope, function () {

          $scope.allCompanies = CompaniesService.getAllCompanies();

          $scope.$watch('recurringCompanies', function () {
            $scope.notRecurringCompaniesArray = [];
            for (var i = 0; i < $scope.allCompanies.length; i++) {
              var companyCount = 0;
              for (var j = 0; j < $scope.recurringCompanies.length; j++) {
                if ($scope.allCompanies[i].id !== $scope.recurringCompanies[j].company.id) {
                  companyCount++;
                }
              }
              if (companyCount === $scope.recurringCompanies.length) {
                $scope.notRecurringCompaniesArray.push($scope.allCompanies[i]);
              }
            }
          }, true);

        });



        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.openAddCompanyForm = function () {
          $rootScope.$broadcast('cancelEditForm');
        };

        $scope.addCompany = function () {
          RecurringService.addCompany($scope.recurringCompanies, $scope.company.id);
          $scope.company = '';

        };

      }]);

}());
