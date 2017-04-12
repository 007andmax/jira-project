'use strict';

(function(){

  angular.module("quicktech.common.directives").component("reportMenu", {
    templateUrl: '/html/scripts/common/directives/report-menu/report-menu.tpl.html',
    bindings: {
      className: '@',
      isDeviceHidden: '@?',
      isCustomerHidden: '@?'
    },
    controller: reportMenuCtrl
  });

  function reportMenuCtrl($scope, CompaniesService, DevicesService, $location) {
    var $ctrl = this;
    this.sendReportRequest = sendReportRequest;
    this.onDateRangeChangeReport = onDateRangeChangeReport;

    $ctrl.isDeviceHidden = $scope.$eval($ctrl.isDeviceHidden);
    $ctrl.isCustomerHidden = $scope.$eval($ctrl.isCustomerHidden);
    $scope.maxDateForDateRangeInputField = Date.now();
    $scope.reportType = "SUMMARY";
    $scope.clientCompanies = CompaniesService.getClientCompanies();

    var location = $location.url();

    function onDateRangeChangeReport(dates) {

      if(dates && dates.length && dates.length > 1) {

        var startMonth = dates[0].getMonth() + 1;
        var endMonth = dates[1].getMonth() + 1;

        $scope.startDate = dates[0].getFullYear() + "/" + addZeroIfNeed(startMonth) + "/" + addZeroIfNeed(dates[0].getDate());
        $scope.endDate = dates[1].getFullYear() + "/" + addZeroIfNeed(endMonth) + "/" + addZeroIfNeed(dates[1].getDate());
      }
    }

    function addZeroIfNeed(n){
      return n < 10 ? '0' + n : '' + n;
    }

    function sendReportRequest(reportSettings){
      console.log("data from form: ", reportSettings);
      var dataToSend = {
        startDate: $scope.startDate,
        endDate: $scope.endDate,
        type: $scope.reportType
      };
      if($scope.reportType === "DETAILED") {
        if(reportSettings.company) {
          dataToSend.companyId = reportSettings.company.id;
        }
        if(reportSettings.device) {
          dataToSend.deviceId = reportSettings.device.id;
        }
      }
      $scope.$emit("requestReportData", dataToSend, location)
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
      //console.log("$scope.clientCompanies: ", $scope.clientCompanies);
    });

    $scope.$watch("reportSetting.company", function(val){
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
