'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.recurringCtrl',
    ['$scope', 'RecurringService', 'CompaniesService', '$rootScope',
      function ($scope, RecurringService, CompaniesService, $rootScope) {

        $scope.editInvoiceId = '';

        RecurringService.getAll($scope, function (resp) {
          $scope.invoices = resp;
        });

        var graphData = RecurringService.getRecurringGraphData($scope, function () {
          $scope.last30DaysValue = 0;
          var recurringGraphData = [];

          for (var r = 0; r < graphData.length; r++) {

            var needToSetData = (recurringGraphData.length === 0);

            for (var i = 0; i < graphData[r].length; i++) {
              $scope.last30DaysValue += graphData[r][i].sum;

              if (needToSetData) {
                recurringGraphData[i] = {
                  sum: +graphData[0][i].sum + +graphData[1][i].sum + +graphData[2][i].sum,
                  date: graphData[0][i].date
                }
              }
            }
          }

          $scope.recurringGraphData = recurringGraphData;

        });

        $scope.toogleNewForm = function (isOpen) {
          $scope.editInvoiceId = isOpen ? 'new-invocie' : '';
        };

        $scope.invoicesOrder = function (item) {
          if (item.company && item.company.id) {
            var company = CompaniesService.getOneById(item.company.id);
            return company.name
          }
        };
        //$scope.recurringCompanies = RecurringService.getRecurringCompanies($scope, function () {
        //
        //  $scope.$watch('recurringCompanies', function () {
        //
        //    for (var i = 0; i < $scope.recurringCompanies.length; i++) {
        //      var company = $scope.recurringCompanies[i];
        //      if (!company.company.name) {
        //        company.company.name = CompaniesService.getOneById(company.company.id).name;
        //      }
        //    }
        //
        //    var clientCompanies = CompaniesService.getClientCompanies(),
        //      recurringCompaniesId = [];
        //    $scope.notRecurringCompaniesArray = [];
        //
        //    for (var j = 0; j < $scope.recurringCompanies.length; j++) {
        //      recurringCompaniesId.push($scope.recurringCompanies[j].company.id)
        //    }
        //
        //    for (var i = 0; i < clientCompanies.length; i++) {
        //      if ((recurringCompaniesId.indexOf(clientCompanies[i].id)) < 0) {
        //        $scope.notRecurringCompaniesArray.push(clientCompanies[i]);
        //      }
        //    }
        //
        //  }, true);
        //});

        //$scope.openAddCompanyForm = function () {
        //  $scope.isShowAddCompany = true;
        //  $rootScope.$broadcast('cancelEditForm');
        //};

        //$scope.addCompany = function () {
        //  RecurringService.addCompany($scope.recurringCompanies, $scope.company.id);
        //  $rootScope.$broadcast('cancelEditForm');
        //  $scope.isShowAddCompany = false;
        //  $scope.company = '';
        //};
        //
        //$scope.closeChooseCompanyForm = function(){
        //  $scope.isShowAddCompany = false;
        //}

      }]);

}());
