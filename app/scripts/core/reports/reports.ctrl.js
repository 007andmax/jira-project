'use strict';

(function () {

  angular.module('quicktech.core.reports').controller('quicktech.core.reports.reportsCtrl',
    ['$scope', 'ReportsService', function ($scope, ReportsService) {

      $scope.reportByTaxes = {};
      $scope.reportByCustomers = {};
      $scope.reportByProducts = {};

      $scope.getReportsByTaxes = function(data) {
        ReportsService.getReportsByTaxes(data, function (resp) {
            $scope.reportByTaxes = resp;
          });
      };

      $scope.getReportsByCustomers = function(data) {
        ReportsService.getReportsByCustomers(data, function(resp) {
          $scope.reportByCustomers = resp;
        });
      };

      $scope.getReportsByProducts = function(data) {
        ReportsService.getReportByProducts(data, function(resp) {
          $scope.reportByProducts = resp;
        });
      };

      $scope.changeReportPageView = function(reportType) {
        $scope.reportPageType = reportType;
      };

      $scope.$on("requestReportData", function(event, data) {
        console.log("parent ctrl: ", data);
        /*
        * code for  report data send
        *
        *
        * */
      })


    }])

})();
