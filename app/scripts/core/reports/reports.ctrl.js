'use strict';

(function () {

  angular.module('quicktech.core.reports').controller('quicktech.core.reports.reportsCtrl',
    ['$scope', 'ReportsService', function ($scope, ReportsService) {

      $scope.parseDate = Date.parse.bind(Date);

      $scope.reportByTaxes = {};
      $scope.reportByCustomers = {};
      $scope.reportByProducts = {};
      $scope.reportByTechSold = {};
      $scope.reportRemoteAccess = {};

      function getReportByTaxes(data) {
        ReportsService.getReportByTaxes(data, function (resp) {
            console.log("Resp from service: ", resp);
            $scope.reportByTaxes = resp;
          });
      }

      function getReportByCustomers(data) {
        ReportsService.getReportByCustomers(data, function(resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByCustomers = resp;
        });
      }

      function getReportByProducts(data) {
        ReportsService.getReportByProducts(data, function(resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByProducts = resp;
        });
      }

      function getReportByTechSold(data) {
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
              getReportByCustomers(data);
              break;
            case('/reports/byProducts'):
              getReportByProducts(data);
              break;
            case('/reports/byTechSold'):
              getReportByTechSold(data);
              break;
            default:
              console.log("wrong location")
          }
        }

      })


    }])

})();
