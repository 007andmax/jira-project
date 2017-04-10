'use strict';

(function () {

  angular.module('quicktech.core.reports').controller('quicktech.core.reports.reportsCtrl',
    ['$scope', 'ReportsService', function ($scope, ReportsService) {

      $scope.reportByTaxes = {};
      $scope.reportByCustomers = {};
      $scope.reportByProducts = {};
      $scope.reportByTechSold = {};
      $scope.reportRemoteAccess = {};

      function getReportsByTaxes(data) {
        ReportsService.getReportByTaxes(data, function (resp) {
            console.log("Resp from service: ", resp);
            $scope.reportByTaxes = resp;
          });
      }

      function getReportsByCustomers(data) {
        ReportsService.getReportByCustomers(data, function(resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByCustomers = resp;
        });
      }

      function getReportsByProducts(data) {
        ReportsService.getReportByProducts(data, function(resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByProducts = resp;
        });
      }

      function getReportsByTechSold(data) {
        ReportsService.getReportByTechSold(data, function(resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByTechSold = resp;
        });
      }

      function getReportRemoteAccess(data) {
        ReportsService.getReportRemoteAccess(data, function(resp) {
          console.log("Resp from service: ", resp);
          $scope.reportRemoteAccess = resp;
        });
      }


      $scope.changeReportPageView = function(reportType) {
        $scope.reportPageType = reportType;
      };

      $scope.$on("requestReportData", function(event, data, location) {
        console.log("parent ctrl: ", data);
        if(location) {
          switch(location) {
            case('/reports/remoteAccess') :
              getReportRemoteAccess(data);
              break;
            case('/reports/byTaxes'):
              getReportByTaxes(data);
              break;
            case('/reports/byCustomers'):
              getReportsByCustomers(data);
              break;
            case('/reports/byProducts'):
              getReportsByProducts(data);
              break;
            case('/reports/byTechSold'):
              getReportsByTechSold(data);
              break;
            default:
              console.log("wrong location")
          }
        }

      })


    }])

})();
