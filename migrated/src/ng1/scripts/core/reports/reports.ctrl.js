'use strict';

(function () {

  angular.module('quicktech.core.reports').controller('quicktech.core.reports.reportsCtrl',
    ['$scope', 'ReportsService', '$timeout', 'quicktech.common.services.PermissionsService', 'StatisticsService', '$state', '$rootScope', 'CompaniesService', 'UsersService', '$http',
      function ($scope, ReportsService, $timeout, PermissionsService, StatisticsService, $state, $rootScope, CompaniesService, UsersService) {

      $scope.parseDate = Date.parse.bind(Date);
      $scope.$on('loadingInProgressSoft', function(val) {
        $scope.loadingInProgressSoft = val;
      });

      $scope.PermissionsService = PermissionsService;

      $scope.reportByTaxes = {};
      $scope.reportByCustomers = {};
      $scope.reportByProducts = {};
      $scope.reportByTechSold = {};
      $scope.reportRemoteAccess = {};
      $scope.techReportTicketCreated = {};
      $scope.techReportProductSales = {};
      $scope.reportAccountsReceivable = {};
      $scope.reportHardwareSummary = [];
      $scope.reportSoftwareSummaryData = [];
      $scope.reportTransformedSoftwareSummaryData = [];
      $scope.softwareSummaryType = 1;


      $scope.loadingInProgress = false;
      $scope.isReportAvailable = false;

      $scope.taxesLabels = [];
      $scope.currentCompany = CompaniesService.getCurrentCompany();
      // $scope.company;
      $scope.companyLogo;
      $scope.date = new Date();

      $scope.user = $rootScope.currentUser;
      $scope.username = $scope.user.firstName + ' ' + $scope.user.lastName;

      $scope.chartData = [];
      $scope.chartColors = ["#16a4fa", "#ffb937", "#ff6e61", "#2ec866", "#f9f916", "#ff1ed2", "#1bf4fc", "#7d1a9e",'#7f1313'];
      $scope.Math = Math;
      $scope.softSelect = [];

      $scope.chartOptions = {
        chart: {
                type: 'pieChart',
                height: 350,
                donut: true,
                x: function(d){return d.name;},
                y: function(d){return d.time;},
                showLabels: false,
                color: function(d,i){
                    return  $scope.chartColors[i]
                },

                pie: {
                    startAngle: function(d) { return d.startAngle },
                    endAngle: function(d) { return d.endAngle }
                },
                showLegend: false,
                duration: 500,
                legend: {
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                }
            }
      };


      $scope.chartNoDataAvailable = {
        chart:  Object.assign({}, $scope.chartOptions.chart)
      };

      $scope.chartNoDataAvailable.chart.tooltip = {
        contentGenerator: function() {
          return '<table><tr><td>No data available</td></tr></table>';
        },
      };

      $scope.chartOptionsToggler = $scope.chartOptions;


      var techReportTypeForChart;
      var renderFinished = {
        lines: false,
        columns: false
      };

      $scope.$watch('currentCompany', function(val) {
        $scope.companyLogo = $rootScope.getCompanyLogoUrl(val);
      });

      $scope.$on('currentCompany', function(val) {
        $scope.companyLogo = $rootScope.getCompanyLogoUrl(val);
      });


      $scope.getServices = function(ticket) {
        return ticket.updates && ticket.updates.filter(function(el) {
          return el.type === "SERVICE";
        });
      };

      $scope.getProducts = function(ticket) {
        return ticket.updates && ticket.updates.filter(function(el) {
          return el.type === "PRODUCT"
        });
      };

      $scope.buildPdf = buildPdf;

      $scope.durationFilter = function(quanity) {
        var minutes = (quanity * 60) % 60;
        var hours = Math.floor(quanity);
        hours = String(hours).length < 2 ? '0' + hours : hours;
        minutes = String(minutes).length < 2 ? '0' + minutes : minutes;
        return hours + ':' + minutes;
      };

      $scope.calcTaxes = function(taxes, sum) {
        var rate = 0;
        taxes.forEach(function(tax) {
          rate += tax.rate;
        });
        return (sum / 100) * rate;
      };




      $scope.reportType = {
        SUMMARY: 'Summary',
        DETAILED: 'Detailed'
      };

      function getTaxesLabels() {
        if ($scope.reportByTaxes.type === 'DETAILED') {
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
        $scope.isReportAvailable = false;
        if (data.companyId) {
          $scope.company = CompaniesService.getOneById(data.companyId)
        }
        ReportsService.getReportByTaxes(data, function (resp) {
          $scope.reportByTaxes = resp;
          $scope.isReportAvailable = !!resp.lines && resp.lines.length;
          getTaxesLabels();
          $scope.loadingInProgress = false;
        });
      }

      function getReportByCustomers(data) {
        $scope.reportByCustomers = {};
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;
        if (data.companyId) {
          $scope.company = CompaniesService.getOneById(data.companyId)
        }
        ReportsService.getReportByCustomers(data, function (resp) {
          $scope.reportByCustomers = resp;
          $scope.isReportAvailable = !!resp.lines && resp.lines.length;
          $scope.loadingInProgress = false;
        });
      }

      function getReportByProducts(data) {
        $scope.reportByProducts = {};
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;
        if (data.companyId) {
          $scope.company = CompaniesService.getOneById(data.companyId)
        }
        ReportsService.getReportByProducts(data, function (resp) {
          $scope.reportByProducts = resp;
          $scope.isReportAvailable = !!resp.lines && resp.lines.length;
          $scope.loadingInProgress = false;
        });
      }

      function getReportByTechSold(data) {
        $scope.reportByTechSold={};
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;
        if (data.companyId) {
          $scope.company = CompaniesService.getOneById(data.companyId)
        }
        ReportsService.getReportByTechSold(data, function (resp) {
          $scope.reportByTechSold = resp;
          $scope.isReportAvailable = !!resp.lines && resp.lines.length;
        });
      }

      function getReportRemoteAccess(data) {
        $scope.reportRemoteAccess = {};
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;
        if (data.companyId) {
          $scope.company = CompaniesService.getOneById(data.companyId)
        }
        ReportsService.getReportRemoteAccess(data, function (resp) {
          $scope.reportRemoteAccess = resp;
          $scope.isReportAvailable = !!resp.lines && resp.lines.length;
          $scope.loadingInProgress = false;
        });
      }

      function getTechReportTickedCreated(data) {
        $scope.loadingInProgress = true;
        $scope.responseSuccess = false;
        $scope.isReportAvailable = false;
        if (data.companyId) {
          $scope.company = CompaniesService.getOneById(data.companyId)
        }
        ReportsService.getTechReportTicketCreated(data, function (resp) {
          $scope.techReportTicketCreated = resp;
          $scope.isReportAvailable = !!resp.lines && resp.lines.length;
          $scope.responseSuccess = true;
          addDataToChartForTicketCreated($scope.techReportTicketCreated);
        })
      }

      function getTechReportProductSales(data) {
        $scope.loadingInProgress = true;
        $scope.responseSuccess = false;
        $scope.isReportAvailable = false;
        if (data.companyId) {
          $scope.company = CompaniesService.getOneById(data.companyId)
        }
        ReportsService.getTechReportProductSales(data, function (resp) {
          $scope.techReportProductSales = resp;
          $scope.isReportAvailable = !!resp.lines && resp.lines.length;
          $scope.responseSuccess = true;
          addDataToChartForProductSales($scope.techReportProductSales);
        })
      }

      function getReportAccountsReceivable(data) {
        $scope.reportAccountsReceivable = {};
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;
        var dataToSend;
        if(data.type === 'SUMMARY') {
          dataToSend = {}
        } else {
          dataToSend = {
            companyId: data.companyId
          }
        }

        if (dataToSend.companyId) {
          $scope.company = CompaniesService.getOneById(dataToSend.companyId)
        }

        ReportsService.getReportAccountsReceivable(dataToSend, function (resp) {
          $scope.reportAccountsReceivable = resp;
          $scope.isReportAvailable = !!resp.lines && resp.lines.length;
          $scope.loadingInProgress = false;
        })
      }

      function getDataForSummaryReports() {
        if (location.hash === '#/reports/hardware-summary'){
          getTableTitleForHardwareSummaryFromRootScope();
        } else if(location.hash === '#/reports/device-ip-summary') {
          getTableTitleForDeviceIpFromRootScope();
        } else if(location.hash === '#/reports/software-summary') {
          getTableTitleForSoftwareSummaryFromRootScope();
        }
      }

      function getTableTitleForSoftwareSummaryFromRootScope(){
        $scope.softwareSummarySoft = $rootScope.softwareSummarySoft;
        $scope.softwareSummarySelectedCompany = $rootScope.softwareSummarySelectedCompany;
        $scope.softwareSummarySelectedCompanyInfo = $rootScope.softwareSummarySelectedCompanyInfo;
        $scope.softwareSummaryWithCompanyName = $rootScope.softwareSummaryWithCompanyName;
        $scope.softwareSummaryWithTotalInstalls = $rootScope.softwareSummaryWithTotalInstalls;
        $scope.softwareSummaryWithDevice = $rootScope.softwareSummaryWithDevice;
        $scope.softwareSummaryWithSoftwareTitle = $rootScope.softwareSummaryWithSoftwareTitle;
        $scope.softwareSummaryWithInstalationKey = $rootScope.softwareSummaryWithInstalationKey;
        $scope.softwareSummaryWithPublisher = $rootScope.softwareSummaryWithPublisher;
        $scope.softwareSummaryWithVersion = $rootScope.softwareSummaryWithVersion;
        $scope.softwareSummaryWithInstallDate = $rootScope.softwareSummaryWithInstallDate;
      }

      function getTableTitleForDeviceIpFromRootScope(){
        $scope.deviceIpSummaryWithDevice = $rootScope.deviceIpSummaryWithDevice;
        $scope.deviceIpSummaryWithNetworkName = $rootScope.deviceIpSummaryWithNetworkName;
        $scope.deviceIpSummaryWithLinkSpeed = $rootScope.deviceIpSummaryWithLinkSpeed;
        $scope.deviceIpSummaryWithDhcp = $rootScope.deviceIpSummaryWithDhcp;
        $scope.deviceIpSummaryWithIpAddress = $rootScope.deviceIpSummaryWithIpAddress;
        $scope.deviceIpSummaryWithSubnet = $rootScope.deviceIpSummaryWithSubnet;
        $scope.deviceIpSummaryWithGateway = $rootScope.deviceIpSummaryWithGateway;
        $scope.deviceIpSummaryWithDns1 = $rootScope.deviceIpSummaryWithDns1;
        $scope.deviceIpSummaryWithDns2 = $rootScope.deviceIpSummaryWithDns2;
        $scope.deviceIpSummaryWithWanIp = $rootScope.deviceIpSummaryWithWanIp;
      }

      function getTableTitleForHardwareSummaryFromRootScope(){
        $scope.hardwareSummaryWithDevice = $rootScope.hardwareSummaryWithDevice;
        $scope.hardwareSummaryWithOperationSystem = $rootScope.hardwareSummaryWithOperationSystem;
        $scope.hardwareSummaryWithCpu = $rootScope.hardwareSummaryWithCpu;
        $scope.hardwareSummaryWithRam = $rootScope.hardwareSummaryWithRam;
        $scope.hardwareSummaryWithDisk = $rootScope.hardwareSummaryWithDisk;
        $scope.hardwareSummaryWithWarrenty = $rootScope.hardwareSummaryWithWarrenty;
        $scope.hardwareSummaryWithSerialNumber = $rootScope.hardwareSummaryWithSerialNumber;
      }

      function getReportHardwareSummary(data, tech) {
        getDataForSummaryReports();
        $scope.reportAccountsReceivable = {};
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;
        var dataToSend;
        if ((data.type !== 'SUMMARY') || (tech === true)) {
          dataToSend = {
            companyId: data.companyId,
            selectedCompany: data.selectedCompany,
            device: data.deviceId
          };
        } else {
          dataToSend = {};
        }
        if (dataToSend.companyId) {
          $scope.company = $scope.softwareSummarySelectedCompanyInfo;
        }
          ReportsService.getReportSummary(dataToSend, function (resp) {
            if (location.hash !== '#/reports/software-summary') { $scope.reportHardwareSummary = resp }
            if (location.hash === '#/reports/hardware-summary') {
              $scope.hardwareSummaryWithDeviceItem = $scope.hardwareSummaryWithDevice;
              $scope.hardwareSummaryWithOperationSystemItem = $scope.hardwareSummaryWithOperationSystem;
              $scope.hardwareSummaryWithCpuItem = $scope.hardwareSummaryWithCpu;
              $scope.hardwareSummaryWithRamItem = $scope.hardwareSummaryWithRam;
              $scope.hardwareSummaryWithDiskItem = $scope.hardwareSummaryWithDisk;
              $scope.hardwareSummaryWithWarrentyItem = $scope.hardwareSummaryWithWarrenty;
              $scope.hardwareSummaryWithSerialNumberItem = $scope.hardwareSummaryWithSerialNumber;
            } else if (location.hash === '#/reports/device-ip-summary') {
              $scope.deviceIpSummaryWithDeviceItem = $scope.deviceIpSummaryWithDevice;
              $scope.deviceIpSummaryWithNetworkNameItem = $scope.deviceIpSummaryWithNetworkName;
              $scope.deviceIpSummaryWithLinkSpeedItem = $scope.deviceIpSummaryWithLinkSpeed;
              $scope.deviceIpSummaryWithDhcpItem = $scope.deviceIpSummaryWithDhcp;
              $scope.deviceIpSummaryWithIpAddressItem = $scope.deviceIpSummaryWithIpAddress;
              $scope.deviceIpSummaryWithSubnetItem = $scope.deviceIpSummaryWithSubnet;
              $scope.deviceIpSummaryWithGatewayItem = $scope.deviceIpSummaryWithGateway;
              $scope.deviceIpSummaryWithDns1Item = $scope.deviceIpSummaryWithDns1;
              $scope.deviceIpSummaryWithDns2Item = $scope.deviceIpSummaryWithDns2;
              $scope.deviceIpSummaryWithWanIpItem = $scope.deviceIpSummaryWithWanIp;
            } else if (location.hash === '#/reports/software-summary') {
              setTableTitleForSoftwareSummary();
            }
            if ($rootScope.hardwareSummaryDevice) {
              $scope.reportHardwareSummary[$scope.company.id] = resp[$scope.company.id].filter(function (item) {
                return item.agentId === $rootScope.hardwareSummaryDevice.agentId;
              });
            }
            getSoftwareSummaryData(dataToSend);
          });
      }

      function setTableTitleForSoftwareSummary() {
        $scope.softwareSummaryWithCompanyNameItem = $scope.softwareSummaryWithCompanyName;
        $scope.softwareSummaryWithTotalInstallsItem = $scope.softwareSummaryWithTotalInstalls;
        $scope.softwareSummaryWithDeviceItem = $scope.softwareSummaryWithDevice;
        $scope.softwareSummaryWithSoftwareTitleItem = $scope.softwareSummaryWithSoftwareTitle;
        $scope.softwareSummaryWithInstalationKeyItem = $scope.softwareSummaryWithInstalationKey;
        $scope.softwareSummaryWithPublisherItem = $scope.softwareSummaryWithPublisher;
        $scope.softwareSummaryWithVersionItem = $scope.softwareSummaryWithVersion;
        $scope.softwareSummaryWithInstallDateItem = $scope.softwareSummaryWithInstallDate;
      }

      function getSoftwareSummaryData(dataToSend) {
        $scope.reportSoftwareSummaryData = [];
        ReportsService.getReportSummary(dataToSend, function (resp) {
          filterReportSoftwareSummaryData(dataToSend);
          endReportDataLoading(resp, dataToSend);
        });
      }

      function filterReportSoftwareSummaryData(dataToSend) {
        $scope.loadingInProgress = true;
        $scope.reportTransformedSoftwareSummaryData = [];
        findWithCompany(dataToSend);
      }

      function findWithCompany(data) {
        var reportTransformedSoftwareSummaryDataInside = [];
        console.log($scope.softwareSummarySelectedCompany, '$scope.softwareSummarySelectedCompany');
        if (data.device) {
          console.log( $scope.softwareSummarySelectedCompany, data);
          $scope.reportSoftwareSummaryData = $scope.softwareSummarySelectedCompany && $scope.softwareSummarySelectedCompany.data[data.companyId].filter(function(item){
            return item.id === data.device;
          });
        } else {
          $scope.reportSoftwareSummaryData = $scope.softwareSummarySelectedCompany.data[data.companyId];
        }
        if ($scope.reportSoftwareSummaryData && $scope.reportSoftwareSummaryData.length > 0 && (location.hash === '#/reports/software-summary')) {
          $scope.reportSoftwareSummaryData.map(function(item) {
            if (item.report && item.report && item.report.softList ){
              item.report.softList.map(function(soft) {
                return reportTransformedSoftwareSummaryDataInside.push({
                  device: item.hostName,
                  softwareTitle: soft.softName,
                  installationKey: '',
                  publisher: soft.softPublisher,
                  version: soft.softVersion,
                  installDate: soft.softInstalledOn
                });
              });
            }
          });
        }
        if ($scope.softwareSummarySoft) {
          const type = $scope.softwareSummarySoft.type;
          const name = $scope.softwareSummarySoft.name;
          reportTransformedSoftwareSummaryDataInside = reportTransformedSoftwareSummaryDataInside.filter(function(item) {
            if (type === 'publisher') {
              return item.publisher === name;
            } else {
              return item.softwareTitle === name;
            }
          });
        }
        if (location.hash !== '#/reports/software-summary') {
          reportTransformedSoftwareSummaryDataInside = $scope.reportSoftwareSummaryData;
        }
        $scope.loadingInProgress = false;
        return ($scope.reportTransformedSoftwareSummaryData = reportTransformedSoftwareSummaryDataInside);
      }

      function endReportDataLoading(resp, dataToSend) {
        $scope.isReportAvailable = !!resp[dataToSend.companyId];
        $scope.loadingInProgress = false;
      }

      function filterReportByCompanyName(reportTransformedSoftwareSummaryDataInside, selectedCompany) {
        return reportTransformedSoftwareSummaryDataInside.filter(function(item) {
          return item.companyName === selectedCompany;
        })
      }

      function createSortItem(softListItem, companyId, selectedCompany, device){
        return({
          companyName: CompaniesService.getOneById(companyId).name,
          device: device,
          totalInstalls: 1,
          softwareTitle: softListItem.softName,
          publisher: softListItem.softPublisher,
          version: softListItem.softVersion,
          installDate: softListItem.softInstalledOn
        });
      }

      function getReportCommissions(data) {
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;

        ReportsService.getReportByCommissions(data, function(res) {

          $scope.isReportAvailable = res.lines && res.lines.length;

          $scope.loadingInProgress = false;
          $scope.commissionsReport = res;
          $scope.showCategoriesData = true;

          var salesByCustomers = [];
          var totalSum = res.totalSum;
          var categories = res.categorySalesValue;

          $scope.commissionsReport.lines = res.lines.map(function(el) {
            el.totalSum = el.totalSum.toFixed(2);

            return el;
          });


          var newCategories = categories;

          if (!newCategories || !Object.keys(newCategories).length) {
            newCategories = { 'No data available': '1'  };

            $scope.showCategoriesData = false;
            $scope.chartOptionsToggler = $scope.chartNoDataAvailable;
          } else {
            $scope.chartOptionsToggler = $scope.chartOptions;

          }

          $scope.byCategoriesChartData = Object.keys(newCategories)
            .map(function(key, i) {
              return {
                name: key,
                time: newCategories[key],
                color: $scope.chartColors[i],
              };
            })
            .sort(function(a, b) {
              return +b.time - +a.time;
            })
            .slice(0, 4);
          $scope.byCustomerChartData = $scope.commissionsReport.lines
            .sort(function(a, b) {
              return +b.totalSum - a.totalSum;
            })
            .slice(0, 4)
            .map(function(el, i) {
              return {
                name: el.companyName,
                time: el.totalSum,
                color: $scope.chartColors[i],
              };
            });
        });





      }


      function getDetailedReportCommissions(data) {
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;

        ReportsService.getReportByCommissions(data, function(res) {
          $scope.isReportAvailable = res.lines && res.lines.length;
          $scope.loadingInProgress = false;
          $scope.commissionsReport = res;
          $scope.showCategoriesData = true;
          var salesByCustomers = [];
          var totalSum = res.totalSum;
          var categories = res.categorySalesValue;
          $scope.commissionsReport.lines = res.lines.map(function(el) {return el;});
          res.lines = res.lines.map(function(el) {
            el.itemGroup = el.productCategory || normalizeString(el.agreementType);
            el.productPrice = el.productPrice || el.totalSum / el.billableQuantity;
            return el;
          });

          $scope.commissionsReport.priceSum = res.lines.reduce(function(acc, el) {
            acc += el.productPrice || 0;
            return acc;
          }, 0);

          $scope.detailsByProducts = $rootScope.detailsByProducts

          if (!$scope.detailsByProducts) {

            var data = res.lines.map(function(el) {
              if (el.agreementType === 'HOURLY') {
                el.firstLine = el.expenseName + ' - ' + 'Hourly' + ' - ' + el.serviceAgreementDescription;
              } else if (el.agreementType === 'BLOCK_TIME') {
                if (!el.exceededCommissionRateApplied) {
                  el.firstLine = el.expenseName + ' - ' + el.serviceAgreementDescription + (el.expenseBasedOnDefault ? '' : '- included hours');
                } else {
                  el.firstLine = el.expenseName + ' - ' + 'Block time' + ' - ' + el.serviceAgreementDescription + (el.expenseBasedOnDefault ? '' : ' - over hours');
                }
              } else if (el.agreementType === 'SERVICE_CONTRACT') {
                if (!el.exceededCommissionRateApplied) {
                  el.firstLine = el.expenseName + ' - ' + 'Service Contract' + ' - ' + el.serviceAgreementDescription;
                } else {
                  el.firstLine = el.expenseName + ' - ' + 'Service Contract' + ' - ' + el.serviceAgreementDescription + (el.expenseBasedOnDefault ? '' : ' - over hours');
                }

                if (el.expenseFromOtherTypeContract) {
                  el.firstLine = el.expenseName + ' - ' + 'Service Contract'  + ' - by Other';
                }
              } else {
                el.firstLine = el.expenseName;
              }

              return el;
            });


            var reducedData = data.reduce(function(acc, el) {
              var company = el.companyName;

              if (acc[company]) {
                acc[company].list.push(el);
              } else {
                acc[company] = {
                  list: [el]
                };
              }
              acc[company].commissionSum = (acc[company].commissionSum || 0) + el.commissionSum;
              acc[company].priceSum = (acc[company].priceSum || 0) + (el.productPrice || 0);
              acc[company].totalSum = (acc[company].totalSum || 0) + el.totalSum;
              return acc;
            }, {});
            $scope.reducedData = reducedData;
            $scope.reducedCompanies = Object.keys(reducedData);
          }
        })
      }

      function normalizeString(str) {
        if (!str) return str;
        str = str.split('_');
        str = str.map(function(el) {
          return el[0].toUpperCase() + el.slice(1).toLowerCase();
        });

        return str.join(' ');
      }

      function gerReportTicketReport(data) {
        $scope.loadingInProgress = true;
        $scope.isReportAvailable = false;

        if (data.companyId) {
          $scope.company = CompaniesService.getOneById(data.companyId);
        }

        $scope.showProducts = $rootScope.customerTicketWithProducts;
        $scope.showServices = $rootScope.customerTicketWithServices;



        console.log(data, 'DATA');

        StatisticsService.getCustomerTicketReport(data, function (resp){
          if(resp) {
            $scope.ticketReport = resp;
            $scope.ticketReport.showTotalTicketAmount = $scope.customerTicketShowTotalTicketAmount;
            if (resp.ticketsPerDate && resp.ticketsPerDate.length) {
              $scope.reportChartData = [];
              for (var i = 0; i < resp.ticketsPerDate.length; i++) {
                var item = resp.ticketsPerDate[i];
                if (item.ticketResolved) {
                  $scope.reportChartData.push(item);
                }
              }
            }

            if ($scope.ticketReport && $scope.ticketReport.tickets) {
              $scope.ticketReport.companyName = CompaniesService.getOneById($scope.ticketReport.companyId)

              $scope.ticketReport.tickets = $scope.ticketReport.tickets.map(function(ticket) {
                ticket.username = UsersService.getOneById(ticket.clientUserId);
                ticket.techUsername = UsersService.getOneById(ticket.techUserId);
                ticket.ticketCreatedAt = moment(new Date(ticket.ticketCreatedAt)).format('DD MMM YYYY, hh:mm a');

                return ticket;
              });

              calculateServicesTime($scope.ticketReport.tickets);
            }

            if ($rootScope.customerTicketShowTotalTicketAmount === false) {
              $scope.ticketReport.hideTotalTickets = true;
            }

            $scope.showHeader = $rootScope.customerTicketWithTimeSpent;
            $scope.ticketReport.startDate = moment(new Date(resp.startDate)).format('ll');
            $scope.ticketReport.endDate = moment(new Date(resp.endDate)).format('ll');
            $scope.loadingInProgress = false;
            $scope.isReportAvailable = true;
          }
        });
      }

      $scope.formatResponseTime = function(time) {
        if (!time && time !== 0) return;
        var hours = Math.floor(time / 60);
        var minutes = time % 60;
        return addZero(hours) + ':' + addZero(minutes) + ' hr';

        function addZero(num) {
          if (String(num).length < 2) {
            return '0' + num;
          }
          return num;
        }
      };

      $scope.getDiskSize = function (diskSize) {
        var size = 0;
        if (diskSize && diskSize.length > 0) {
          diskSize.map(function(item) {
            item.size = item.size? item.size : 0;
            return size += Number.parseInt(item.size);
          })
        }
        if (Math.floor(size/1073741824) > 1024) {
          return Math.floor((size/1073741824)/1024) + 'TB'
        } else {
          return Math.floor(size/1073741824) + 'GB'
        }
      };

      $scope.getRamSize = function (slots) {
        let ramSize = 0;
        slots.forEach( function(item) {
          ramSize = item.capacity;
        })
        return (ramSize > 0 && ramSize/1073741824 > 0)? (ramSize/1073741824) + 'GB' : 0 + 'GB';
        //return (ramSize > 0 && ramSize/1073741824 > 0)? Math.ceil(ramSize/1073741824) + 'GB' : 0 + 'GB';
      };

      function calculateServicesTime(tickets) {
        var overallTime = {};

        for (var i = 0; i < tickets.length; i++) {
          var upd = tickets[i].updates;

          if (!upd) continue;

          for (var j = 0; j < upd.length; j++) {
            if (upd[j].type === 'SERVICE') {
              var exp = upd[j].expenses;

              if (!exp) continue;

              for (var k = 0; k < exp.length; k++) {
                if (exp[k].isServiceExpense) {
                  var name = exp[k].name;
                  var time = exp[k].totalQuantity;

                  if (overallTime[name]) {
                    overallTime[name] += time;
                  } else {
                    overallTime[name] = time;
                  }
                }
              }
            }
          }
        }

        calculateTopTime(overallTime);
      }

      function calculateTopTime(timeObj) {
        var keys = Object.keys(timeObj);
        var timeArr = [];

        for (var i = 0; i < keys.length; i++) {
          var time = {
            name: keys[i],
            time: timeObj[keys[i]]
          };

          timeArr.push(time);
        }

        timeArr.sort(function(a, b) {
          return b.time - a.time;
        })

        var top = timeArr.slice(0, 8);
        var rest = timeArr.slice(8);

        if (rest.length) {
          var time = {
            name: 'Rest',
            time: rest.reduce(function(acc, i) {
              acc += i.time;
              return acc;
            }, 0)
          };
          top.push(time);


        }

        $scope.overallServiceTime = top;

        $scope.ticketReport.timeSpent = top.reduce(function(acc, el) {
          acc += el.time;
          return acc;
        }, 0);


        drawChart(top);
      }

      function drawChart(data) {
        if (!$scope.ticketReport.timeSpent) {
          data = [{
            time: 1,
            name: 'No data available'
          }];
          document.documentElement.classList.add('no-d3-tooltip');
        } else {
          document.documentElement.classList.remove('no-d3-tooltip');
        }
        $scope.chartData = data.map(function(el, i) {
          el.color = $scope.chartColors[i];
          return el;
        });
      }





      $scope.changeReportPageView = function (reportType) {
        $scope.reportPageType = reportType;
      };

      $scope.$on("requestReportData", function (event, data, location, techReportType) {
        if (location) {
          switch (location) {
            case('/reports/remoteAccess') :
              getReportRemoteAccess(data);
              $rootScope.reportName = 'remote_access_report';
              break;
            case('/reports/byTaxes'):
              getReportByTaxes(data);
              $rootScope.reportName = 'taxes_report';
              break;
            case('/reports/byCustomers'):
              getReportByCustomers(data);
              $rootScope.reportName = 'sales_report';
              break;
            case('/reports/byProducts'):
              getReportByProducts(data);
              $rootScope.reportName = 'products_report';
              break;
            case('/reports/byTechSold'):
              getReportByTechSold(data);
              $rootScope.reportName = 'tech_sold_report';
              break;
            case('/reports/techReport-TicketCreated'):
              getTechReportTickedCreated(data);
              techReportTypeForChart = techReportType;
              $rootScope.reportName = 'ticket_created';
              break;
            case('/reports/techReport-ProductSales'):
              getTechReportProductSales(data);
              techReportTypeForChart = techReportType;
              $rootScope.reportName = 'product_sold';
              break;
            case('/reports/accountsReceivable'):
              getReportAccountsReceivable(data);
              $rootScope.reportName = 'accounts_receivable';
              break;
            case('/reports/ticket-report'):
              gerReportTicketReport(data);
              $scope.customerTicketShowTotalTicketAmount = data.showTotalTicketAmount;
              $rootScope.reportName = 'customer-report-'+ data.company.name.toLowerCase().split(' ').join('-');
              break;
            case('/reports/byCommissionsDetailed'):
              getDetailedReportCommissions(data);
              // $scope.customerTicketShowTotalTicketAmount = data.showTotalTicketAmount;
              $rootScope.reportName = 'commissions-report';
              break;
            case('/reports/byCommissions'):
              getReportCommissions(data);
              // $scope.customerTicketShowTotalTicketAmount = data.showTotalTicketAmount;
              $rootScope.reportName = 'commissions-report';
              break;
            case('/reports/hardware-summary'):
              getReportHardwareSummary(data);
              $rootScope.reportName = 'hardware-summary';
              break;
            case('/reports/device-ip-summary'):
              getReportHardwareSummary(data);
              $rootScope.reportName = 'device-ip-summary';
              break;
            case('/reports/software-summary'):
              $scope.reportTransformedSoftwareSummaryData = [];
              getReportHardwareSummary(data, true);
              $rootScope.reportName = 'software-summary';
              break;
            default:
              console.log("wrong location")
          }
        }
        if($state.includes('companyProfile')) {
          getReportByProducts(data);
          $rootScope.reportName = 'products_report';
        }
      });

      var chartHeight = 400;

      function chartHeightChange(techData) {
        var calculatedHeight;
        if(techData) {
          calculatedHeight = 30 * (techData.lines.length + 5);
        } else {
          calculatedHeight = 400;
        }
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
          chartHeightChange(reportData);
          $scope.data.push(object1);
          $scope.data.push(object2);
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
            chartHeightChange(reportData);
            $scope.data.push(object1);
            /*IN CASE OF SECOND PARAMETER EXIST - ADD IT*/

          } else if (techReportTypeForChart === "PRODUCT_SOLD") {
            var totalSum = [];
            for (var i = 0; i < reportData.lines.length; i++) {
            //var sum = reportData.lines[i].totalSum + '$';
              var nameAndData = {
                "label": reportData.lines[i].fullName,
                "value": reportData.lines[i].totalSum
              };
              totalSum.push(nameAndData)
            }
            var object1 = {
              "key": "total sum, $",
              "color": "#d62728",
              "values": totalSum
            };
            chartHeightChange(reportData);
            $scope.data.push(object1);

            /*IN CASE OF SECOND PARAMETER EXIST - ADD IT*/

          }
        }
      }

      $scope.build = function(param) {
        $scope.buildPdf(param);
      };

      $scope.getDeviceReport = function (device, params){
        var currentItem = '';
        if (device.report) {
          device.report.networkAdapters.map(function(item) {
            if (item.ip_enabled) { currentItem = item[params];}
          });
          if (params === 'dns' || 'subnet') {
            var regex = /;/gi;
            currentItem = currentItem.replace(regex, '</br>');
            return currentItem;
          } else {
            return currentItem;
          }
        } else {
          return ''
        }
      };



      function buildPdf(param) {
        if (param) {
          var allRendersFinished = true;
          renderFinished[param] = true;
          for (var prop in renderFinished) {
            if (!renderFinished[prop]) {
              allRendersFinished = false;
              break;
            }
          }

          allRendersFinished && $scope.$broadcast('buildPdf-' + $rootScope.reportName);
        } else {
          $scope.$broadcast('buildPdf-' + $rootScope.reportName);
        }
      };

    }])

})();
