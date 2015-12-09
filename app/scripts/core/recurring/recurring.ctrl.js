'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.recurringCtrl',
    ['$scope', 'RecurringService', 'CompaniesService', '$rootScope',
      function ($scope, RecurringService, CompaniesService, $rootScope) {

        $scope.isShowAddCompany = false;
        $scope.companySelection = {};

        $scope.recurringGraphData = RecurringService.getRecurringGraphData($scope, function () {
          $scope.last30DaysValue = 0;

          for (var r = 0; r < $scope.recurringGraphData.length; r++) {

            for (var i = 0; i < $scope.recurringGraphData[r].length; i++) {

              $scope.last30DaysValue += $scope.recurringGraphData[r][i].sum;
            }
          }


        });

        $scope.recurringCompanies = RecurringService.getRecurringCompanies($scope, function () {

          $scope.$watch('recurringCompanies', function () {

            for (var i = 0; i < $scope.recurringCompanies.length; i++) {
              var company = $scope.recurringCompanies[i];
              if (!company.company.name) {
                company.company.name = CompaniesService.getOneById(company.company.id).name;
              }
            }

            var clientCompanies = CompaniesService.getClientCompanies(),
              recurringCompaniesId = [];
            $scope.notRecurringCompaniesArray = [];

            for (var j = 0; j < $scope.recurringCompanies.length; j++) {
              recurringCompaniesId.push($scope.recurringCompanies[j].company.id)
            }

            for (var i = 0; i < clientCompanies.length; i++) {
              if ((recurringCompaniesId.indexOf(clientCompanies[i].id)) < 0) {
                $scope.notRecurringCompaniesArray.push(clientCompanies[i]);
              }
            }

          }, true);
        });


        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.openAddCompanyForm = function () {
          $scope.isShowAddCompany = true;
          $rootScope.$broadcast('cancelEditForm');
        };

        $scope.addCompany = function () {
          RecurringService.addCompany($scope.recurringCompanies, $scope.company.id);
          $rootScope.$broadcast('cancelEditForm');
          $scope.company = '';
        };

      }]);

}());
