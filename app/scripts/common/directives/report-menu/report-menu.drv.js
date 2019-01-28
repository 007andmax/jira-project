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
      isProductOptions: '@?',
      isProductReportForCompanyTab: '@?',
      companyId: '=?',
      isSerialNumberOptions: '@?',
      commonCommissions: '<commonCommissions',
      detailedCommissions: '<detailedCommissions'
    },
    controller: reportMenuCtrl
  });

  reportMenuCtrl.$inject = ['$scope', 'CompaniesService', 'UsersService', 'DevicesService', '$location', 'ReportsService', '$filter', 'ProductsService', 'quicktech.common.services.SharedStateService', '$rootScope', '$timeout'];

  function reportMenuCtrl($scope, CompaniesService, UsersService, DevicesService, $location, ReportsService, $filter, ProductsService, SharedStateService, $rootScope, $timeout) {
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
    $ctrl.isProductReportForCompanyTab = $scope.$eval($ctrl.isProductReportForCompanyTab);
    $ctrl.isSerialNumberOptions = $scope.$eval($ctrl.isSerialNumberOptions);

    $ctrl.notifySelectionMap = {};
    $ctrl.tempUsers = [];
    $ctrl.isTechReport = $scope.$eval($ctrl.isTechReport);
    $ctrl.currentUser = UsersService.getCurrentUser();

    $scope.maxDateForDateRangeInputField = Date.now();

    $scope.currentCompany = CompaniesService.getCurrentCompany();
    $scope.customerTicketWithTimeSpent = true;
    $scope.customerTicketWithResponseTime = true;
    $scope.customerTicketShowTotalTicketAmount = true;
    // $scope.customerTicketTypes = ['Simple report', 'Extended report'];
    $scope.customerTicketType = 'Extended report';
    $scope.reportTypes = ['Summary', 'Detailed'];
    $scope.previousReportType = 'Summary';
    $scope.reportType = "Summary";
    $scope.techReportTypes = ['Billed time', 'Product sold'];
    $scope.techReportType = "Billed time";
    $scope.clientCompanies = CompaniesService.getClientCompanies();
    $scope.users = UsersService.getAllUsers();
    $scope.currentUser = UsersService.getCurrentUser();
    $scope.locationTechReport = $location.url();
    $scope.customerTicketWithProducts = true;
    $scope.customerTicketWithServices = true;

    $scope.detailsByProducts = true;

    $scope.customerTicketWithProducts= true;

    $scope.companyProfileSharedState = SharedStateService.getSharedState('companyProfile');

    // if($ctrl.isProductReportForCompanyTab && $ctrl.companyId) {
    //   ProductsService.getProductsByCompany($scope, $ctrl.companyId, function(resp) {
    //     $scope.autocompleteData = resp
    //   })
    // } else {
    //   $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);
    // }
    $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);

    $scope.loadProductByCategory = function (categoryId) {
      $scope.productsByCategory = ProductsService.getAllByCategory($scope, categoryId)
    };
    $scope.selectProduct = function (product) {
      $scope.selectedProduct = product;
    };

    $scope.removeProduct = function () {
      $scope.selectedProduct = undefined;
    };

    $scope.sendNewHTMLForPdf = function() {
      $rootScope.reportLineChanged = true;
    }

    $scope.usersCurrentCompany = UsersService.getAllByCompanyIdNonArchived(CompaniesService.getCurrentCompany().id);
    $scope.techUsers = UsersService.getTechUsers().filter(function(el) {
      return el.userEnabled && !el.deletedAt;
    });

    $scope.errorNassageForDate = true;
    $scope.errorNassageForCompany = true;
    $scope.errorNassageForSalesUser = true;

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
      $scope.availableTechusersWoCompany = true;
    }

    if (location === '/reports/ticket-report') {
      $scope.availableTechusersWoCompany = true;
    }

    $scope.resetDate = resetDate;
    $scope.togglePurchaseCost = togglePurchaseCost;

    $scope.reportSetting = {
      company: '',
      dateRange: {
        startDate: '',
        endDate: ''
      }
    };

     $scope.datePickerOptions = {
      opens: 'left',
      autoApply: true,
      locale: {
        format: "YYYY/MM/DD"
      }
    };

    $scope.isPurchaseShown = false;
    $rootScope.isPurchaseShown = $scope.isPurchaseShown;

    $scope.firstIteration = true;


    $scope.hideTotalTickets = function() {
      $rootScope.customerTicketShowTotalTicketAmount = $scope.customerTicketShowTotalTicketAmount;
    };

    // to clear company input field when report type changed to Summary
    $scope.$watch('reportType', function () {
      if (location === '/reports/byProducts' || location === '/reports/byCustomers') {
        if ($scope.reportType === 'Summary') {
          $scope.reportSetting.company = null;
        }
      }
    });

    $scope.$watch('detailsByProducts', function(val) {
      $rootScope.detailsByProducts = val;
    })

    $scope.$watch('customerTicketWithProducts', function(val) {
      $rootScope.customerTicketWithProducts = val;
    })

    $scope.$watch('customerTicketWithServices', function(val) {
      $rootScope.customerTicketWithServices = val;
    })

    $scope.$watch('customerTicketWithTimeSpent', function(val) {
      $rootScope.customerTicketWithTimeSpent = val;
    })

    $scope.$watch('reportSetting.dateRange', function() {
      if ($scope.reportSetting.dateRange) {
        onDateRangeChangeReport([$scope.reportSetting.dateRange.startDate, $scope.reportSetting.dateRange.endDate]);

        if ($scope.firstIteration) {
          $scope.firstIteration = false;

          // if ($ctrl.isProductReportForCompanyTab) {
          //   sendReportRequest($scope.reportSetting);
          // }

          return;
        }

        if ($ctrl.isTechReport) {
          sendReportRequest($scope.reportSetting);
        }

      }
    })


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

      if ($scope.techReportDateType !== 'CUSTOM') {
        resetDate();
      }

      sendTechDataRequest();
    }

    function resetDate() {
      $scope.reportSetting.dateRange = {
        startDate: '',
        endDate: ''
      }
    }

    function onDateRangeChangeReport(dates) {
      $scope.startDate = null;
      $scope.endDate = null;
      if (dates && dates.length && dates.length > 1) {
        $scope.startDate = formatDate(dates[0]);
        $scope.endDate = formatDate(dates[1]);
        $scope.errorNassageForDate = true;
      }
    }

    function togglePurchaseCost() {
      $scope.isPurchaseShown = !$scope.isPurchaseShown;
      $rootScope.isPurchaseShown = $scope.isPurchaseShown;

      $timeout(function () {
        $rootScope.reportLineChanged = true;
      }, 500);
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

    function formatDate(date) {
      if (!date) return '';
      return moment(date).format('YYYY/MM/DD');
    }

    function sendReportRequestForProductReportOnCompanyTab(reportSettings) {
      var companyFromProfile = CompaniesService.getOneById($scope.companyProfileSharedState.companyId);
      $scope.errorNassageForCompany = true;
      $scope.users = UsersService.getAllByCompanyIdNonArchived($ctrl.companyId);
      if ($scope.techUsers && $scope.techUsers.length > 0) {
        $scope.users = $scope.users.concat($scope.techUsers);
      }
      var techType = $scope.techReportType.split(' ').join('_').toUpperCase();
      var type = $scope.reportType.toUpperCase();
      var dataToSend = {
        type: type
      };
      dataToSend.startDate = $scope.startDate;
      dataToSend.endDate = $scope.endDate;
      dataToSend.companyId = $ctrl.companyId;
      if($scope.serialNumber) {
        dataToSend.serialNumber = $scope.serialNumber
      }
      if ($scope.selectedProduct) {
        dataToSend.productId = $scope.selectedProduct.versionedId.id
      }

      dataToSend.startDate = $scope.startDate || formatDate(new Date(companyFromProfile.createdAt));
        dataToSend.endDate = $scope.endDate || formatDate(now);

      lastSentData = dataToSend;

      $scope.$emit("requestReportData", dataToSend, location, techType);
    }


    function sendReportRequest(reportSettings) {
      $scope.errorNassageForCompany = true;
      $scope.errorNassageForSalesUser = true;

      if ($ctrl.isProductReportForCompanyTab) {
        $scope.users = UsersService.getAllByCompanyIdNonArchived($ctrl.companyId);
      } else if (reportSettings && reportSettings.company) {
        $scope.users = UsersService.getAllByCompanyIdNonArchived(reportSettings.company.id);
      } else {
        $scope.users = UsersService.getAllUsers();
      }
      if ($scope.techUsers && $scope.techUsers.length > 0) {
        $scope.users = $scope.users.concat($scope.techUsers);
      }

      if ($ctrl.isProductReportForCompanyTab) {

        sendReportRequestForProductReportOnCompanyTab(reportSettings)

      } else if (!$ctrl.isTechReport) {
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
          } else if (location === '/reports/ticket-report') {
            if (reportSettings.company) {
              var dataToSend = {
                company: reportSettings.company,
                companyId: reportSettings.company.id,
                extendedReport: ($scope.customerTicketType === 'Extended report'),
                withResponseTime: $scope.customerTicketWithResponseTime,
                withTimeSpent: true,
                showTotalTicketAmount: $scope.customerTicketShowTotalTicketAmount,
                startDate: $filter('date')(new Date($scope.startDate || reportSettings.company.createdAt), 'yyyy/MM/dd'),
                endDate: $filter('date')(new Date($scope.endDate || now), 'yyyy/MM/dd')
              };

              if ($ctrl.isShowTechSelectField && reportSettings && reportSettings.techUser) {
                dataToSend.userId = reportSettings.techUser.id
              }

              lastSentData = dataToSend;
              $scope.$emit("requestReportData", dataToSend, location, techType);

            } else {
              $scope.errorNassageForCompany = false;
            }
          } else if (location === '/reports/byCommissionsDetailed') {
            if (reportSettings.salesUser) {
              var dataToSend = {
                companyId: (reportSettings.company && reportSettings.company.id) || null,
                userId: (reportSettings.salesUser && reportSettings.salesUser.id) || null,
                type: "DETAILED",
                startDate: $filter('date')(new Date($scope.startDate || $scope.currentCompany.createdAt), 'yyyy/MM/dd'),
                endDate: $filter('date')(new Date($scope.endDate || now), 'yyyy/MM/dd')
              };

              // if ($ctrl.isShowTechSelectField && reportSettings && reportSettings.techUser) {
              //   dataToSend.userId = reportSettings.techUser.id
              // }

              lastSentData = dataToSend;
              $scope.$emit("requestReportData", dataToSend, location, techType);
            } else {
              // if (!$scope.startDate || !$scope.endDate) {
              //   $scope.errorNassageForDate = false;
              // }

              if (!reportSettings.salesUser) {
                $scope.errorNassageForSalesUser = false;
              }
            }
          } else if (location === '/reports/byCommissions') {
            // if (reportSettings.company) {
            //
            //
            // } else {
            //   $scope.errorNassageForCompany = false;
            // }

            if (reportSettings.salesUser) {
              var dataToSend = {
                companyId: (reportSettings.company && reportSettings.company.id) || null,
                userId: (reportSettings.salesUser && reportSettings.salesUser.id) || null,
                type: "SUMMARY",
                startDate: $filter('date')(new Date($scope.startDate || $scope.currentCompany.createdAt), 'yyyy/MM/dd'),
                endDate: $filter('date')(new Date($scope.endDate || now), 'yyyy/MM/dd')
              };

              // if ($ctrl.isShowTechSelectField && reportSettings && reportSettings.techUser) {
              //   dataToSend.userId = reportSettings.techUser.id
              // }

              lastSentData = dataToSend;
              $scope.$emit("requestReportData", dataToSend, location, techType);
            } else {
              // if (!$scope.startDate || !$scope.endDate) {
              //   $scope.errorNassageForDate = false;
              // }

              if (!reportSettings.salesUser) {
                $scope.errorNassageForSalesUser = false;
              }
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
              if ($scope.selectedProduct) {
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
              if ($scope.selectedProduct) {
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

    $scope.$watch('reportType', function (value) {
      if (value) {
        $scope.previousReportType = value;
        $scope.reportType = value;
        // console.log('$scope.reportType', $scope.reportType)
        // console.log('$scope.previousReportType', $scope.previousReportType)
      } else {
        $scope.reportType = $scope.previousReportType;
        // console.log('$scope.reportType', $scope.reportType)
        // console.log('$scope.previousReportType', $scope.previousReportType)
      }
    });

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
