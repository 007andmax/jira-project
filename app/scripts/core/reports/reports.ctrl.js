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
      $scope.techReportTicketCreated = {};
      $scope.techReportProductSales = {};

      $scope.taxesLabels;

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
        if($scope.reportByTaxes.type === "DETAILED") {
          var labels = [];
          Object.keys($scope.reportByTaxes.reducedTaxes).forEach(function(key) {
            labels.push(key);
          });
          $scope.taxesLabels = labels;
          console.log(" $scope.taxesLabels: ",  $scope.taxesLabels);
        }
      }

      function getReportByTaxes(data) {
        ReportsService.getReportByTaxes(data, function (resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByTaxes = resp;
          getTaxesLabels();
        });
      }

      function getReportByCustomers(data) {
        ReportsService.getReportByCustomers(data, function (resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByCustomers = resp;
        });
      }

      function getReportByProducts(data) {
        ReportsService.getReportByProducts(data, function (resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByProducts = resp;
        });
      }

      function getReportByTechSold(data) {
        ReportsService.getReportByTechSold(data, function (resp) {
          console.log("Resp from service: ", resp);
          $scope.reportByTechSold = resp;
        });
      }

      function getReportRemoteAccess(data) {
        ReportsService.getReportRemoteAccess(data, function (resp) {
          console.log("Resp from service: ", resp);
          $scope.reportRemoteAccess = resp;
        });
      }

      function getTechReportTickedCreated(data) {
        ReportsService.getTechReportTicketCreated(data, function(resp) {
          console.log("Resp from service: ", resp);
          $scope.techReportTicketCreated = resp;
          addDataToChartForTicketCreated($scope.techReportTicketCreated);
        })
      }

      function getTechReportProductSales(data) {
        ReportsService.getTechReportProductSales(data, function(resp){
          console.log("Resp from service: ", resp);
          $scope.techReportProductSales = resp;
          addDataToChartForProductSales($scope.techReportProductSales);
        })
      }


      $scope.changeReportPageView = function (reportType) {
        $scope.reportPageType = reportType;
      };

      $scope.$on("requestReportData", function (event, data, location, techReportType) {
        console.log("parent ctrl data: ", data);
        console.log("parent ctrl techReportType: ", techReportType);
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
              break;
            case('/reports/techReport-ProductSales'):
              getTechReportProductSales(data);
              techReportTypeForChart = techReportType;
              break;
            default:
              console.log("wrong location")
          }
        }
      });

      $scope.options = {
        chart: {
          type: 'multiBarHorizontalChart',
          height: 400,
          margin: {left:150},
          x: function(d){return d.label;},
          y: function(d){return d.value;},
          showControls: false,
          showValues: true,
          duration: 500,
          xAxis: {
            showMaxMin: false,
          },
          yAxis: {
            tickFormat: function(d){
              return d3.format('')(d);
            }
          }
        }
      };
      // it might be good to add function to change $scope.options.height
      // height: changeHeight();

      $scope.data = [];

      function addDataToChartForTicketCreated(reportData) {
        $scope.data = [];
        if(reportData && reportData.lines) {
          var valueClosed = [];
          for(var i=0; i<reportData.lines.length; i++) {
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
          for(var i=0; i<reportData.lines.length; i++) {
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
        }
      }

      function addDataToChartForProductSales (reportData) {
        $scope.data = [];
        if(reportData && reportData.lines) {
          if(techReportTypeForChart === "BILLED_TIME") {
            var billedTime = [];
            for(var i=0; i<reportData.lines.length; i++) {
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
            /*IN CASE OF SECOND PARAMETER EXIST - ADD IT*/

          } else if (techReportTypeForChart === "PRODUCT_SOLD") {
            var totalSum = [];
            for(var i=0; i<reportData.lines.length; i++) {
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
