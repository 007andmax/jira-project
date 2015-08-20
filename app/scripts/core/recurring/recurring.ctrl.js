'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.recurringCtrl',
    ['$scope', 'RecurringService', 'CompaniesService', '$rootScope',
      function ($scope, RecurringService, CompaniesService, $rootScope) {

        $scope.companySelection = {};

        $scope.recurringGraphData = RecurringService.getRecurringGraphData($scope);

        $scope.recurringCompanies = RecurringService.getRecurringCompanies($scope, function () {

          $scope.$watch('recurringCompanies', function () {

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
          $rootScope.$broadcast('cancelEditForm');
        };

        $scope.addCompany = function () {
          RecurringService.addCompany($scope.recurringCompanies, $scope.company.id);
          $scope.company = '';

        };

      }]);

}());
