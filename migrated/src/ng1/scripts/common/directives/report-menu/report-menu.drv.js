'use strict';

(function () {

  angular.module("quicktech.common.directives").component("reportMenu", {
    templateUrl: '/ng1/scripts/common/directives/report-menu/report-menu.tpl.html',
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
      isHardwareSummaryOptions: '@?',
      isDeviceIpSummaryOptions: '@?',
      isSoftwareSummaryOptions: '@?',
      isSoftListHidden: '@?',
      isProductOptions: '@?',
      isProductReportForCompanyTab: '@?',
      companyId: '=?',
      isSerialNumberOptions: '@?',
      commonCommissions: '<commonCommissions',
      detailedCommissions: '<detailedCommissions'
    },
    controller: reportMenuCtrl
  });

  reportMenuCtrl.$inject = ['$scope', 'CompaniesService', 'UsersService', 'DevicesService', '$location', 'ReportsService', '$filter', 'ProductsService', 'quicktech.common.services.SharedStateService', '$rootScope', '$timeout', '$http'];

  function reportMenuCtrl($scope, CompaniesService, UsersService, DevicesService, $location, ReportsService, $filter, ProductsService, SharedStateService, $rootScope, $timeout, $http) {
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
    $ctrl.isHardwareSummaryOptions = $scope.$eval($ctrl.isHardwareSummaryOptions);
    $ctrl.isDeviceIpSummaryOptions = $scope.$eval($ctrl.isDeviceIpSummaryOptions);
    $ctrl.isSoftwareSummaryOptions = $scope.$eval($ctrl.isSoftwareSummaryOptions);

    $ctrl.notifySelectionMap = {};
    $ctrl.tempUsers = [];
    $ctrl.isTechReport = $scope.$eval($ctrl.isTechReport);
    $ctrl.currentUser = UsersService.getCurrentUser();

    $scope.maxDateForDateRangeInputField = Date.now();

    $scope.currentCompany = CompaniesService.getCurrentCompany();
    $scope.customerTicketWithTimeSpent = true;
    $scope.customerTicketWithResponseTime = true;
    $scope.customerTicketShowTotalTicketAmount = true;
    // hardwareSummary items start
    $scope.hardwareSummaryWithDevice = true;
    $scope.hardwareSummaryWithOperationSystem = true;
    $scope.hardwareSummaryWithCpu = true;
    $scope.hardwareSummaryWithRam = true;
    $scope.hardwareSummaryWithDisk = true;
    $scope.hardwareSummaryWithWarrenty = true;
    $scope.hardwareSummaryWithSerialNumber = true;
    // hardwareSummary items end

    // deviceIpSummary items start
    $scope.deviceIpSummaryWithDevice = true;
    $scope.deviceIpSummaryWithNetworkName = true;
    $scope.deviceIpSummaryWithLinkSpeed = true;
    $scope.deviceIpSummaryWithDhcp = true;
    $scope.deviceIpSummaryWithIpAddress = true;
    $scope.deviceIpSummaryWithSubnet = true;
    $scope.deviceIpSummaryWithGateway = true;
    $scope.deviceIpSummaryWithDns1 = true;
    $scope.deviceIpSummaryWithDns2 = true;
    $scope.deviceIpSummaryWithWanIp = true;
    // deviceIpSummary items end


    //Software summary report start
    $scope.loadingInProgressSoft = true;
    $scope.softwareSummaryCompanyId = CompaniesService.getCurrentCompany().id;
    $scope.softwareSummaryWithCompanyName = true;
    $scope.softwareSummaryWithTotalInstalls = true;
    $scope.softwareSummaryWithDevice = true;
    $scope.softwareSummaryWithSoftwareTitle = true;
    $scope.softwareSummaryWithInstalationKey = true;
    $scope.softwareSummaryWithPublisher = true;
    $scope.softwareSummaryWithVersion = true;
    $scope.softwareSummaryWithInstallDate = true;
    $scope.errorMassageForSoftwareReportCompany = true;
    //Software summary report end


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

    $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);

    $scope.softSelect = [];

    function getSoftListForCompany(companyId) {
      ($location.url() === '/reports/software-summary') && ($scope.loadingInProgressSoft = false);
      $http.get('/devices/extended?companyId='+ companyId).then(function (resp) {
        $rootScope.softwareSummarySelectedCompany = resp;
        $scope.softSelect = [];
        if(resp) {
          Object.keys(resp.data).map(function(key) {
            const softlistArrayFromItem = resp.data[key];
            if (softlistArrayFromItem) {
              softlistArrayFromItem.map(function(item) {
                if (item.report) {
                  item.report.softList.map(function (item) {
                    item.softName && $scope.softSelect.push({name: item.softName, type: 'soft'});
                    item.softPublisher && $scope.softSelect.push({name: item.softPublisher, type: 'publisher'});
                  });
                }
              });
            }
          });
          var obj = {};
          for ( var i=0, len=$scope.softSelect.length; i < len; i++ ) {
            obj[$scope.softSelect[i]['name']] = $scope.softSelect[i];
          }
          $scope.softSelect = [];
          for ( var key in obj ) {
            $scope.softSelect.push(obj[key]);
          }
          ($location.url() === '/reports/software-summary') && ($scope.loadingInProgressSoft = true);
        }
      });
    }



    $scope.$watch('loadingInProgressSoft', function(val) {
      $rootScope.loadingInProgressSoft = val;
    });

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
    };

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
      soft: '',
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
    });

    $scope.$watch('customerTicketWithProducts', function(val) {
      $rootScope.customerTicketWithProducts = val;
    });

    $scope.$watch('customerTicketWithServices', function(val) {
      $rootScope.customerTicketWithServices = val;
    });

    $scope.$watch('customerTicketWithTimeSpent', function(val) {
      $rootScope.customerTicketWithTimeSpent = val;
    });

    //Hardware Summary reports items start
    $scope.$watch('hardwareSummaryWithDevice', function(val) {
      $rootScope.hardwareSummaryWithDevice = val;
    });

    $scope.$watch('hardwareSummaryWithOperationSystem', function(val) {
      $rootScope.hardwareSummaryWithOperationSystem = val;
    });

    $scope.$watch('hardwareSummaryWithCpu', function(val) {
      $rootScope.hardwareSummaryWithCpu = val;
    });

    $scope.$watch('hardwareSummaryWithRam', function(val) {
      $rootScope.hardwareSummaryWithRam = val;
    });

    $scope.$watch('hardwareSummaryWithDisk', function(val) {
      $rootScope.hardwareSummaryWithDisk = val;
    });

    $scope.$watch('hardwareSummaryWithWarrenty', function(val) {
      $rootScope.hardwareSummaryWithWarrenty = val;
    });

    $scope.$watch('hardwareSummaryWithSerialNumber', function(val) {
      $rootScope.hardwareSummaryWithSerialNumber = val;
    });
    //Hardware Summary reports items end

    //Device Ip Summary reports items start
    $scope.$watch('deviceIpSummaryWithDevice', function(val) {
      $rootScope.deviceIpSummaryWithDevice = val;
    });

    $scope.$watch('deviceIpSummaryWithNetworkName', function(val) {
      $rootScope.deviceIpSummaryWithNetworkName = val;
    });

    $scope.$watch('deviceIpSummaryWithLinkSpeed', function(val) {
      $rootScope.deviceIpSummaryWithLinkSpeed = val;
    });

    $scope.$watch('deviceIpSummaryWithDhcp', function(val) {
      $rootScope.deviceIpSummaryWithDhcp = val;
    });

    $scope.$watch('deviceIpSummaryWithDisk', function(val) {
      $rootScope.deviceIpSummaryWithDisk = val;
    });

    $scope.$watch('deviceIpSummaryWithIpAddress', function(val) {
      $rootScope.deviceIpSummaryWithIpAddress = val;
    });

    $scope.$watch('deviceIpSummaryWithSubnet', function(val) {
      $rootScope.deviceIpSummaryWithSubnet = val;
    });

    $scope.$watch('deviceIpSummaryWithGateway', function(val) {
      $rootScope.deviceIpSummaryWithGateway = val;
    });

    $scope.$watch('deviceIpSummaryWithDns1', function(val) {
      $rootScope.deviceIpSummaryWithDns1 = val;
    });

    $scope.$watch('deviceIpSummaryWithDns2', function(val) {
      $rootScope.deviceIpSummaryWithDns2 = val;
    });

    $scope.$watch('deviceIpSummaryWithWanIp', function(val) {
      $rootScope.deviceIpSummaryWithWanIp = val;
    });
    //Device Ip Summary reports items end

    //Software Summary reports items start
    $scope.$watch('softwareSummaryWithCompanyName', function(val) {
      $rootScope.softwareSummaryWithCompanyName = val;
    });

    $scope.$watch('softwareSummaryWithTotalInstalls', function(val) {
      $rootScope.softwareSummaryWithTotalInstalls = val;
    });

    $scope.$watch('softwareSummaryWithDevice', function(val) {
      $rootScope.softwareSummaryWithDevice = val;
    });

    $scope.$watch('softwareSummaryWithSoftwareTitle', function(val) {
      $rootScope.softwareSummaryWithSoftwareTitle = val;
    });

    $scope.$watch('softwareSummaryWithInstalationKey', function(val) {
      $rootScope.softwareSummaryWithInstalationKey = val;
    });

    $scope.$watch('softwareSummaryWithPublisher', function(val) {
      $rootScope.softwareSummaryWithPublisher = val;
    });

    $scope.$watch('softwareSummaryWithVersion', function(val) {
      $rootScope.softwareSummaryWithVersion = val;
    });

    $scope.$watch('softwareSummaryWithInstallDate', function(val) {
      $rootScope.softwareSummaryWithInstallDate = val;
    });
    //Software Summary reports items end

    $scope.$watch('reportSetting.device', function(val) {
      $rootScope.hardwareSummaryDevice = val.device;
    });

    $scope.$watch('reportSetting.soft', function(val) {
      $rootScope.softwareSummarySoft = val;
      if (val && !$scope.reportSetting.company) {
        $scope.softwareSummaryWithDevice = false;
        $scope.softwareSummaryWithInstalationKey = false;
      } else if((val && $scope.reportSetting.company) || (!val && $scope.reportSetting.company)){
        $scope.softwareSummaryWithDevice = true;
        $scope.softwareSummaryWithInstalationKey = true;
        $scope.softwareSummaryWithCompanyName = false;
        $scope.softwareSummaryWithTotalInstalls = false;
      } else {
        $scope.softwareSummaryWithDevice = true;
        $scope.softwareSummaryWithInstalationKey = true;
        $scope.softwareSummaryWithCompanyName = true;
        $scope.softwareSummaryWithTotalInstalls = true;
      }
    });

    $scope.$watch('reportSetting.dateRange', function() {
      if ($scope.reportSetting.dateRange) {
        onDateRangeChangeReport([$scope.reportSetting.dateRange.startDate, $scope.reportSetting.dateRange.endDate]);

        if ($scope.firstIteration) {
          $scope.firstIteration = false;
          return;
        }

        if ($ctrl.isTechReport) {
          sendReportRequest($scope.reportSetting);
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
      $scope.$emit('requestReportData', techDataToSend, location, type);
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

            } else if (reportSettings.techUser) {
             
              var dataToSend = {
                company: '',
                companyId: '',
                extendedReport: ($scope.customerTicketType === 'Extended report'),
                withResponseTime: $scope.customerTicketWithResponseTime,
                withTimeSpent: true,
                showTotalTicketAmount: $scope.customerTicketShowTotalTicketAmount,
                startDate: $filter('date')(new Date($scope.startDate || $scope.currentCompany.createdAt), 'yyyy/MM/dd'),
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

              lastSentData = dataToSend;
              $scope.$emit("requestReportData", dataToSend, location, techType);
            } else {
              if (!reportSettings.salesUser) {
                $scope.errorNassageForSalesUser = false;
              }
            }
          } else if (location === '/reports/hardware-summary' || location === '/reports/device-ip-summary') {
            const dataToSend = {
              type: 'SUMMARY'
            };
            if (reportSettings && reportSettings.company) {
              dataToSend.type = 'DETAILED';
              dataToSend.companyId = reportSettings.company.id;
              if (reportSettings && reportSettings.device) {
                dataToSend.deviceId = reportSettings.device.id;
              }
              lastSentData = dataToSend;
              $scope.$emit("requestReportData", dataToSend, location, techType)
            }
            else {
              return $scope.errorNassageForCompany = false;
            }
          } else if(location === '/reports/software-summary'){
            const dataToSend = {
              type: 'SUMMARY'
            };
            if (reportSettings && reportSettings.company && (reportSettings.device || reportSettings.soft)) {
              dataToSend.type = 'DETAILED';
              dataToSend.companyId = reportSettings.company.id;
              dataToSend.selectedCompany = reportSettings.company && reportSettings.company.id;
              if (reportSettings && reportSettings.device) {
                dataToSend.deviceId = reportSettings.device.id;
              }
              lastSentData = dataToSend;
              $scope.$emit('requestReportData', dataToSend, location, techType);
            } else if(reportSettings.company) {
              dataToSend.companyId = reportSettings.company.id;
              dataToSend.selectedCompany = reportSettings.company && reportSettings.company.id;
              $scope.$emit('requestReportData', dataToSend, location, techType);
            }
            if (!reportSettings.company) {
              return $scope.errorNassageForCompany = false;
            } else {
              $scope.errorMassageForSoftwareReport = true;
              $scope.errorMassageForSoftwareReport = true;
            }
          } else if (location === '/reports/byCommissions') {
            if (reportSettings.salesUser) {
              var dataToSend = {
                companyId: (reportSettings.company && reportSettings.company.id) || null,
                userId: (reportSettings.salesUser && reportSettings.salesUser.id) || null,
                type: "SUMMARY",
                startDate: $filter('date')(new Date($scope.startDate || $scope.currentCompany.createdAt), 'yyyy/MM/dd'),
                endDate: $filter('date')(new Date($scope.endDate || now), 'yyyy/MM/dd')
              };
              lastSentData = dataToSend;
              $scope.$emit("requestReportData", dataToSend, location, techType);
            } else {
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
      } else {
        $scope.reportType = $scope.previousReportType;
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
          case('/reports/hardware-summary'):
            ReportsService.exportCsvByTechSummary(lastSentData);
            break;
          default:
           
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
      $rootScope.softwareSummarySelectedCompanyInfo = val;
      val && val.id && getSoftListForCompany(val.id);
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
