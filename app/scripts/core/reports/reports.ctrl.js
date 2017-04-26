'use strict';

(function () {

  angular.module('quicktech.core.reports').controller('quicktech.core.reports.reportsCtrl',
    ['$scope', 'ReportsService', '$timeout', 'quicktech.common.services.PermissionsService', function ($scope, ReportsService, $timeout, PermissionsService) {

      $scope.parseDate = Date.parse.bind(Date);

      $scope.PermissionsService = PermissionsService;

      $scope.reportByTaxes = {};
      $scope.reportByCustomers = {};
      $scope.reportByProducts = {};
      $scope.reportByTechSold = {};
      $scope.reportRemoteAccess = {};
      $scope.techReportTicketCreated = {};
      $scope.techReportProductSales = {};
      $scope.reportAccountsReceivable = {};

      $scope.loadingInProgress = false;

      $scope.taxesLabels = [];

      var techReportTypeForChart;
      var renderFinished = {
        lines: false,
        columns: false
      };

      $scope.reportType = {
        SUMMARY: 'Summary',
        DETAILED: 'Detailed'
      };

      function getTaxesLabels() {
        if ($scope.reportByTaxes.type === "DETAILED") {
          var labels = [];
          if ($scope.reportByTaxes.reducedTaxes) {
            Object.keys($scope.reportByTaxes.reducedTaxes).forEach(function (key) {
              labels.push(key);
            });
          }
          $scope.taxesLabels = labels;
        }
      }

      $scope.hideLoadingIndicator = function () {
        $scope.loadingInProgress = false;
      };

      function getReportByTaxes(data) {
        $scope.reportByTaxes = {};
        $scope.loadingInProgress = true;
        ReportsService.getReportByTaxes(data, function (resp) {
          $scope.reportByTaxes = resp;
          console.log(resp);
          getTaxesLabels();
          if (resp.lines === null || !resp.lines.length) {
            $scope.loadingInProgress = false;
          }
        });
      }

      function getReportByCustomers(data) {
        $scope.reportByCustomers = {};
        $scope.loadingInProgress = true;
        ReportsService.getReportByCustomers(data, function (resp) {
          $scope.reportByCustomers = resp;
          if (resp.lines === null || !resp.lines.length) {
            $scope.loadingInProgress = false;
          }
        });
      }

      function getReportByProducts(data) {
        $scope.reportByProducts = {};
        $scope.loadingInProgress = true;
        ReportsService.getReportByProducts(data, function (resp) {
          $scope.reportByProducts = resp;
          if (resp.products === null || !resp.products.length) {
            $scope.loadingInProgress = false;
          }
        });
      }

      function getReportByTechSold(data) {
        $scope.reportByTechSold={};
        $scope.loadingInProgress = true;
        ReportsService.getReportByTechSold(data, function (resp) {
          $scope.reportByTechSold = resp;
        });
      }

      function getReportRemoteAccess(data) {
        $scope.reportRemoteAccess = {};
        $scope.loadingInProgress = true;
        ReportsService.getReportRemoteAccess(data, function (resp) {
          $scope.reportRemoteAccess = resp;
          if (resp.lines === null || !resp.lines.length) {
            $scope.loadingInProgress = false;
          }
        });
      }

      function getTechReportTickedCreated(data) {
        $scope.loadingInProgress = true;
        $scope.responseSuccess = false;
        ReportsService.getTechReportTicketCreated(data, function (resp) {
          $scope.techReportTicketCreated = resp;
          $scope.responseSuccess = true;
          addDataToChartForTicketCreated($scope.techReportTicketCreated);
        })
      }

      function getTechReportProductSales(data) {
        $scope.loadingInProgress = true;
        $scope.responseSuccess = false;
        ReportsService.getTechReportProductSales(data, function (resp) {
          $scope.techReportProductSales = resp;
          $scope.responseSuccess = true;
          addDataToChartForProductSales($scope.techReportProductSales);
        })
      }

      function getReportAccountsReceivable(data) {
        $scope.reportAccountsReceivable = {};
        $scope.loadingInProgress = true;
        ReportsService.getReportAccountsReceivable(data, function (resp) {
          $scope.reportAccountsReceivable = resp;
          if (resp.lines === null || !resp.lines.length) {
            $scope.loadingInProgress = false;
          }
        })
      }


      $scope.changeReportPageView = function (reportType) {
        $scope.reportPageType = reportType;
      };

      $scope.$on("requestReportData", function (event, data, location, techReportType) {
        if (location) {
          switch (location) {
            case('/reports/remoteAccess') :
              getReportRemoteAccess(data);
              $scope.reportName = 'remote_access_report';
              break;
            case('/reports/byTaxes'):
              getReportByTaxes(data);
              $scope.reportName = 'taxes_report';
              break;
            case('/reports/byCustomers'):
              getReportByCustomers(data);
              $scope.reportName = 'sales_report';
              break;
            case('/reports/byProducts'):
              getReportByProducts(data);
              $scope.reportName = 'products_report';
              break;
            case('/reports/byTechSold'):
              getReportByTechSold(data);
              $scope.reportName = 'tech_sold_report';
              break;
            case('/reports/techReport-TicketCreated'):
              getTechReportTickedCreated(data);
              techReportTypeForChart = techReportType;
              $scope.reportName = 'ticket_created';
              break;
            case('/reports/techReport-ProductSales'):
              getTechReportProductSales(data);
              techReportTypeForChart = techReportType;
              $scope.reportName = 'product_sold';
              break;
            case('/reports/accountsReceivable'):
              getReportAccountsReceivable(data);
              $scope.reportName = 'accounts_receivable';
              break;
            default:
              console.log("wrong location")
          }
        }
      });

      var chartHeight = 400;

      function chartHeightChange() {
        var calculatedHeight;
        if($scope.data) {
          calculatedHeight = 30 * ($scope.data[0].values.length + 5);
        } else {
          calculatedHeight = 400;
        }
        console.log("calculatedHeight ", calculatedHeight);
        chartHeight =  calculatedHeight;
      }

      $scope.options = {
        chart: {
          type: 'multiBarHorizontalChart',
          height: chartHeight,
          margin: {left: 150},
          x: function (d) {
            return d.label;
          },
          y: function (d) {
            return d.value;
          },
          showControls: false,
          showValues: true,
          duration: 500,
          xAxis: {
            showMaxMin: false
          },
          yAxis: {
            tickFormat: function (d) {
              return d3.format('')(d);
            }
          },
          multibar: {
            dispatch: {
              renderEnd: function () {
                $timeout($scope.buildPdf);
              }
            }
          }
        }
      };

      $scope.data = [];

      function addDataToChartForTicketCreated(reportData) {
        $scope.data = [];
        if (reportData && reportData.lines) {
          var valueClosed = [];
          for (var i = 0; i < reportData.lines.length; i++) {
            var nameAndData = {
              "label": reportData.lines[i].fullName,
              "value": reportData.lines[i].closed
            };
            valueClosed.push(nameAndData)
          }
          var object1 = {
            "key": "Closed",
            "color": "#d62728",
            "values": valueClosed
          };

          var valueCreated = [];
          for (var i = 0; i < reportData.lines.length; i++) {
            var nameAndData2 = {
              "label": reportData.lines[i].fullName,
              "value": reportData.lines[i].created
            };
            valueCreated.push(nameAndData2)
          }
          var object2 = {
            "key": "Created",
            "color": "#1f77b4",
            "values": valueCreated
          };

          $scope.data.push(object1);
          $scope.data.push(object2);
          chartHeightChange();
        }
      }

      function addDataToChartForProductSales(reportData) {
        $scope.data = [];
        if (reportData && reportData.lines) {
          if (techReportTypeForChart === "BILLED_TIME") {
            var billedTime = [];
            for (var i = 0; i < reportData.lines.length; i++) {
              var nameAndData = {
                "label": reportData.lines[i].fullName,
                "value": reportData.lines[i].billedTime
              };
              billedTime.push(nameAndData)
            }
            var object1 = {
              "key": "Billed time",
              "color": "#d62728",
              "values": billedTime
            };
            $scope.data.push(object1);
            chartHeightChange();
            /*IN CASE OF SECOND PARAMETER EXIST - ADD IT*/

          } else if (techReportTypeForChart === "PRODUCT_SOLD") {
            var totalSum = [];
            for (var i = 0; i < reportData.lines.length; i++) {
              var nameAndData = {
                "label": reportData.lines[i].fullName,
                "value": reportData.lines[i].totalSum
              };
              totalSum.push(nameAndData)
            }
            var object1 = {
              "key": "total sum",
              "color": "#d62728",
              "values": totalSum
            };
            $scope.data.push(object1);
            chartHeightChange();
            /*IN CASE OF SECOND PARAMETER EXIST - ADD IT*/

          }
        }
      }

      $scope.buildPdf = function (param) {
        if (param) {
          var allRendersFinished = true;
          renderFinished[param] = true;
          for (var prop in renderFinished) {
            if (!renderFinished[prop]) {
              allRendersFinished = false;
              break;
            }
          }
          allRendersFinished && $scope.$broadcast('buildPdf-' + $scope.reportName);
        } else {
          $scope.$broadcast('buildPdf-' + $scope.reportName);
        }
      };

    }])

})();
