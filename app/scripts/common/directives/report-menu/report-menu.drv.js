'use strict';

(function () {

  angular.module("quicktech.common.directives").component("reportMenu", {
    templateUrl: '/html/scripts/common/directives/report-menu/report-menu.tpl.html',
    bindings: {
      className: '@',
      isDeviceHidden: '@?',
      isCustomerHidden: '@?',
      openInPdf: '=?',
      downloadAsPdf: '=?',
      sendToMail: '=?',
      getUserName: '=?',
      emailPattern: '=?',
      isTechReport: '@?',
      isRadioButtonHidden: '@?',
      isDateRangeHidden: '@?',
      isShowTechSelectField: '@?',
      isReportAvailable: '=',
      isCustomerTicketOptions: '@?',
      isProductOptions: '@?'
    },
    controller: reportMenuCtrl
  });

  reportMenuCtrl.$inject = ['$scope', 'CompaniesService', 'UsersService', 'DevicesService', '$location', 'ReportsService', '$filter', 'ProductsService'];
  function reportMenuCtrl($scope, CompaniesService, UsersService, DevicesService, $location, ReportsService, $filter, ProductsService) {
    var $ctrl = this;
    this.sendReportRequest = sendReportRequest;
    this.exportFileToCsv = exportFileToCsv;
    this.addEmailToNotify = addEmailToNotify;
    this.onDateRangeChangeReport = onDateRangeChangeReport;
    this.getEmailsArray = getEmailsArray;
    this.emailSent = emailSent;
    this.setTechReportDateType = setTechReportDateType;
    this.sendTechDataRequest = sendTechDataRequest;

    var now = Date.now();
    var agentsByCompany = [];

    $ctrl.isDeviceHidden = $scope.$eval($ctrl.isDeviceHidden);
    $ctrl.isCustomerHidden = $scope.$eval($ctrl.isCustomerHidden);
    $ctrl.isRadioButtonHidden = $scope.$eval($ctrl.isRadioButtonHidden);
    $ctrl.isDateRangeHidden = $scope.$eval($ctrl.isDateRangeHidden);
    $ctrl.isShowTechSelectField = $scope.$eval($ctrl.isShowTechSelectField);
    $ctrl.isCustomerTicketOptions = $scope.$eval($ctrl.isCustomerTicketOptions);
    $ctrl.isProductOptions = $scope.$eval($ctrl.isProductOptions);

    $ctrl.notifySelectionMap = {};
    $ctrl.tempUsers = [];
    $ctrl.isTechReport = $scope.$eval($ctrl.isTechReport);
    $ctrl.currentUser = UsersService.getCurrentUser();

    $scope.maxDateForDateRangeInputField = Date.now();
    $scope.customerTicketWithTimeSpent = true;
    $scope.customerTicketWithResponseTime = true;
    $scope.customerTicketShowTotalTicketAmount = true;
    $scope.customerTicketTypes = ['Simple report', 'Extended report'];
    $scope.customerTicketType = 'Simple report';
    $scope.reportTypes = ['Summary', 'Detailed'];
    $scope.reportType = "Summary";
    $scope.techReportTypes = ['Billed time', 'Product sold'];
    $scope.techReportType = "Billed time";
    $scope.clientCompanies = CompaniesService.getClientCompanies();
    $scope.users = UsersService.getAllUsers();
    $scope.locationTechReport = $location.url();

    $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);
    $scope.loadProductByCategory = function (categoryId) {
      $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
    };
    $scope.selectProduct = function(product) {
      $scope.selectedProduct = product;
    };

    $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);

    $scope.errorNassageForDate = true;
    $scope.errorNassageForCompany = true;

    $scope.requiredForDeviceFiled = !$ctrl.isRadioButtonHidden || $scope.reportType === 'Summary';


    if ($ctrl.isRadioButtonHidden) {
      $scope.reportType = 'Detailed';
    }

    var location = $location.url(),
      lastSentData;

    if (location === '/reports/accountsReceivable') {
      sendReportRequest();
    }

    if (location === '/reports/remoteAccess') {
      $scope.reportType = 'Detailed';
    }

    $scope.reportSetting = {
      company: ''
    };

    // to clear company input field when report type changed to Summary
    $scope.$watch('reportType', function(){
      if (location === '/reports/byProducts' || location === '/reports/byCustomers') {
        if ($scope.reportType === 'Summary') {
          $scope.reportSetting.company = null;
        }
      }
    });


    if ($ctrl.isTechReport) {
      setTechReportDateType("TODAY");
    }

    function addEmailToNotify(email, sendMailForm) {
      if (email && $ctrl.emailPattern.test(email)) {
        $ctrl.notifySelectionMap[email] = true;
        $ctrl.tempUsers.unshift({primaryEmail: email, custom: true});
        $ctrl.emailToNotify = '';
        sendMailForm.$setPristine();
      }
    }

    function getEmailsArray(emailsMap) {
      return Object.keys(emailsMap).filter(function (email) {
        return emailsMap[email];
      });
    }

    function emailSent() {
      $ctrl.notifySelectionMap = {};
      $ctrl.tempUsers = [];
    }

    function setTechReportDateType(type) {
      $scope.techReportDateType = typeof type === 'string' ? type : 'CUSTOM';
      sendTechDataRequest();
    }

    function onDateRangeChangeReport(dates) {
      $scope.startDate = null;
      $scope.endDate = null;
      if (dates && dates.length && dates.length > 1) {
        var startMonth = dates[0].getMonth() + 1;
        var endMonth = dates[1].getMonth() + 1;
        $scope.startDate = dates[0].getFullYear() + "/" + addZeroIfNeed(startMonth) + "/" + addZeroIfNeed(dates[0].getDate());
        $scope.endDate = dates[1].getFullYear() + "/" + addZeroIfNeed(endMonth) + "/" + addZeroIfNeed(dates[1].getDate());
        $scope.errorNassageForDate = true;
      }
    }

    function addZeroIfNeed(n) {
      return n < 10 ? '0' + n : '' + n;
    }

    function sendTechDataRequest() {
      var type = $scope.techReportType.split(' ').join('_').toUpperCase();
      var techDataToSend = {
        dateRangeType: $scope.techReportDateType,
        type: type
      };
      if ($scope.techReportDateType === "CUSTOM") {
        techDataToSend.startDate = $scope.startDate;
        techDataToSend.endDate = $scope.endDate;
        if (!$scope.startDate || !$scope.endDate) {
          return;
        }
      }
      lastSentData = techDataToSend;
      $scope.$emit("requestReportData", techDataToSend, location, type);
      // $scope.startDate = null;
      // techDataToSend.endDate = null;
    }


    function sendReportRequest(reportSettings) {
      $scope.errorNassageForCompany = true;

      if (!$ctrl.isTechReport) {
        var techType = $scope.techReportType.split(' ').join('_').toUpperCase();
        var type = $scope.reportType.toUpperCase();
        if ($ctrl.isRadioButtonHidden) {
          if (location === '/reports/remoteAccess') {
            var dataToSend = {
              type: 'SUMMARY'
            };

            if (reportSettings && reportSettings.company) {
              dataToSend.type = 'DETAILED';
              dataToSend.companyId = reportSettings.company.id;
            }
            if (reportSettings && reportSettings.device) {
              dataToSend.deviceId = reportSettings.device.id;
            }
            if ($ctrl.isShowTechSelectField && reportSettings && reportSettings.techUser) {
              dataToSend.userId = reportSettings.techUser.id
            }
            if (!$ctrl.isDateRangeHidden) {
              if ($scope.startDate && $scope.endDate) {
                dataToSend.startDate = $scope.startDate;
                dataToSend.endDate = $scope.endDate;

                lastSentData = dataToSend;
                $scope.$emit("requestReportData", dataToSend, location, techType)
              } else {
                $scope.errorNassageForDate = false;
              }
            }
          } else if(location === '/reports/ticket-report') {
            if (reportSettings.company) {
              var dataToSend = {
                company: reportSettings.company,
                companyId: reportSettings.company.id,
                extendedReport: ($scope.customerTicketType === 'Extended report'),
                withResponseTime: $scope.customerTicketWithResponseTime,
                withTimeSpent: $scope.customerTicketWithTimeSpent,
                showTotalTicketAmount: $scope.customerTicketShowTotalTicketAmount,
                startDate: $filter('date')(new Date(reportSettings.startDate || reportSettings.company.createdAt), 'yyyy/MM/dd'),
                endDate: $filter('date')(new Date(reportSettings.endDate || now), 'yyyy/MM/dd')
              };
              lastSentData = dataToSend;
              $scope.$emit("requestReportData", dataToSend, location, techType);

            } else {
              $scope.errorNassageForCompany = false;
            }
          } else {
            var dataToSend = {
              type: type
            };
            if (reportSettings && reportSettings.company) {
              dataToSend.companyId = reportSettings.company.id;
            }
            lastSentData = dataToSend;
            $scope.$emit("requestReportData", dataToSend, location, techType)
          }

        } else if (location === '/reports/byProducts' || location === '/reports/byCustomers') {

          if (type === "SUMMARY") {
            if ($scope.startDate && $scope.endDate) {
              var dataToSend = {
                type: type
              };
              dataToSend.startDate = $scope.startDate;
              dataToSend.endDate = $scope.endDate;
              lastSentData = dataToSend;
              if($scope.selectedProduct) {
                dataToSend.productId = $scope.selectedProduct.versionedId.id
              }
              $scope.$emit("requestReportData", dataToSend, location, techType);
            } else {
              $scope.errorNassageForDate = false;
            }
          }
          if (type === "DETAILED") {
            if ($scope.startDate && $scope.endDate) {
              var dataToSend = {
                type: type
              };
              dataToSend.startDate = $scope.startDate;
              dataToSend.endDate = $scope.endDate;
              if($scope.selectedProduct) {
                dataToSend.productId = $scope.selectedProduct.versionedId.id
              }
              if (reportSettings.company) {
                dataToSend.companyId = reportSettings.company.id;
                lastSentData = dataToSend;
                $scope.$emit("requestReportData", dataToSend, location, techType);
              } else {
                $scope.errorNassageForCompany = false;
              }

            } else {
              $scope.errorNassageForDate = false;
            }
          }

        } else if ($scope.startDate && $scope.endDate) {
          var dataToSend = {
            type: type
          };
          if (!$ctrl.isDateRangeHidden) {
            dataToSend.startDate = $scope.startDate;
            dataToSend.endDate = $scope.endDate;
          }

          if (type === "DETAILED" && !$ctrl.isCustomerHidden) {
            if (reportSettings.company) {
              dataToSend.companyId = reportSettings.company.id;
            }
            if (reportSettings.device) {
              dataToSend.deviceId = reportSettings.device.id;
            }
            if ($ctrl.isShowTechSelectField && reportSettings.techUser) {
              dataToSend.userId = reportSettings.techUser.id
            }
          }
          lastSentData = dataToSend;
          $scope.$emit("requestReportData", dataToSend, location, techType);

        } else {
          $scope.errorNassageForDate = false;
        }


      } else {
        sendTechDataRequest();
      }

      //lastSentData = dataToSend;
      //$scope.$emit("requestReportData", dataToSend, location)
    }

    function exportFileToCsv() {
      if (lastSentData) {
        switch (location) {
          case('/reports/remoteAccess') :
            ReportsService.exportCsvRemoteAccess(lastSentData);
            break;
          case('/reports/byTaxes'):
            ReportsService.exportCsvByTaxes(lastSentData);
            break;
          case('/reports/byCustomers'):
            ReportsService.exportCsvByCustomers(lastSentData);
            break;
          case('/reports/byProducts'):
            ReportsService.exportCsvByProducts(lastSentData);
            break;
          case('/reports/accountsReceivable'):
            ReportsService.exportCsvAccountsReceivable(lastSentData);
            break;
          case('/reports/byTechSold'):
            ReportsService.exportCsvByTechSold(lastSentData);
            break;
          case('/reports/techReport-TicketCreated'):
            ReportsService.exportCsvByTechTicketCreated(lastSentData);
            break;
          case('/reports/techReport-ProductSales'):
            ReportsService.exportCsvByTechProductSold(lastSentData);
            break;
          default:
            console.log("wrong location")
        }
      }
    }


    DevicesService.getDevicesCount($scope, function (agents) {
      agentsByCompany = agents;
      var agentsList = [];
      for (var companyId in agents) {
        if (companyId !== 'staticCopy') {
          agentsList = agentsList.concat(agents[companyId].map(function (agent) {
            agent.companyId = companyId;
            return agent;
          }));
        }
      }
      $scope.agentsList = angular.copy(agentsList);
    });

    $scope.$watch("reportSetting.company", function (val) {
      $scope.filteredAgentList = $scope.agentsList;
      if (val && typeof val === 'object') {
        $scope.ticketCompanyChoosen = true;
        if (agentsByCompany) {
          $scope.filteredAgentList = agentsByCompany[val.id];
        }
      }
    });

  }

})();
