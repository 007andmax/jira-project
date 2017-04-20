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
      isTechReport: "@?",
      isRadioButtonHidden: "@?"
    },
    controller: reportMenuCtrl
  });

  reportMenuCtrl.$inject = ['$scope', 'CompaniesService', 'UsersService', 'DevicesService', '$location', 'ReportsService'];
  function reportMenuCtrl($scope, CompaniesService, UsersService, DevicesService, $location, ReportsService) {
    var $ctrl = this;
    this.sendReportRequest = sendReportRequest;
    this.exportFileToCsv = exportFileToCsv;
    this.addEmailToNotify = addEmailToNotify;
    this.onDateRangeChangeReport = onDateRangeChangeReport;
    this.getEmailsArray = getEmailsArray;
    this.emailSent = emailSent;
    this.setTechReportDateType = setTechReportDateType;

    $ctrl.isDeviceHidden = $scope.$eval($ctrl.isDeviceHidden);
    $ctrl.isCustomerHidden = $scope.$eval($ctrl.isCustomerHidden);
    $ctrl.isRadioButtonHidden = $scope.$eval($ctrl.isRadioButtonHidden);

    $ctrl.notifySelectionMap = {};
    $ctrl.tempUsers = [];
    $ctrl.isTechReport = $scope.$eval($ctrl.isTechReport);
    $scope.maxDateForDateRangeInputField = Date.now();
    $scope.reportType = "SUMMARY";
    $scope.techReportType = "BILLED_TIME";
    $scope.techReportDateType = "TODAY";
    $scope.clientCompanies = CompaniesService.getClientCompanies();
    $scope.clientUsers = UsersService.getClientUsers();
    $scope.locationTechReport = $location.url();

    var location = $location.url(),
      lastSentData;

    function addEmailToNotify(email, sendMailForm) {
      if (email && $ctrl.emailPattern.test(email)) {
        $ctrl.notifySelectionMap[email] = true;
        $ctrl.tempUsers.push({primaryEmail: email});
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
      $scope.techReportDateType = type;
    }

    function onDateRangeChangeReport(dates) {
      if (dates && dates.length && dates.length > 1) {
        var startMonth = dates[0].getMonth() + 1;
        var endMonth = dates[1].getMonth() + 1;
        $scope.startDate = dates[0].getFullYear() + "/" + addZeroIfNeed(startMonth) + "/" + addZeroIfNeed(dates[0].getDate());
        $scope.endDate = dates[1].getFullYear() + "/" + addZeroIfNeed(endMonth) + "/" + addZeroIfNeed(dates[1].getDate());
      }
    }

    function addZeroIfNeed(n) {
      return n < 10 ? '0' + n : '' + n;
    }

    function sendReportRequest(reportSettings) {

      if (!$ctrl.isTechReport) {

        var dataToSend = {
          startDate: $scope.startDate,
          endDate: $scope.endDate,
          type: $scope.reportType
        };
        if ($scope.reportType === "DETAILED" && !$ctrl.isCustomerHidden) {
          if (reportSettings.company) {
            dataToSend.companyId = reportSettings.company.id;
          }
          if (reportSettings.device) {
            dataToSend.deviceId = reportSettings.device.id;
          }
        }
        lastSentData = dataToSend;
        $scope.$emit("requestReportData", dataToSend, location, $scope.techReportType)

      } else {

        var techDataToSend = {
          dateRangeType: $scope.techReportDateType,
          type: $scope.techReportType
        };
        if ($scope.techReportDateType === "CUSTOM") {
          techDataToSend.startDate = $scope.startDate;
          techDataToSend.endDate = $scope.endDate;
        }
        lastSentData = techDataToSend;
        $scope.$emit("requestReportData", techDataToSend, location, $scope.techReportType)
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

    var agentsByCompany = [];

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
