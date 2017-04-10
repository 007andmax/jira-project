'use strict';

(function(){

  angular.module("quicktech.common.directives").component("reportMenu", {
    templateUrl: '/html/scripts/common/directives/report-menu/report-menu.tpl.html',
    bindings: {},
    controller: reportMenuCtrl
  });

  function reportMenuCtrl($scope, CompaniesService, DevicesService, $location) {
    var $ctrl = this;
    this.sendReportRequest = sendReportRequest;
    this.onDateRangeChangeReport = onDateRangeChangeReport;

    $scope.maxDateForDateRangeInputField = Date.now();
    $scope.reportType = "SUMMARY";
    $scope.clientCompanies = CompaniesService.getClientCompanies();

    /*function for reaching date from DATE RANGE form in template*/
    function onDateRangeChangeReport(dates) {

      function addZeroIfNeed(n){
        return n < 10 ? '0' + n : '' + n;
      }

      if(dates && dates.length && dates.length > 1) {

        var startMonth = dates[0].getMonth() + 1;
        var endMonth = dates[1].getMonth() + 1;

        $scope.startDate = dates[0].getFullYear() + "/" + addZeroIfNeed(startMonth) + "/" + addZeroIfNeed(dates[0].getDate());
        $scope.endDate = dates[1].getFullYear() + "/" + addZeroIfNeed(endMonth) + "/" + addZeroIfNeed(dates[1].getDate());
      }
    }

    function sendReportRequest(reportSettings){
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
          dataToSend.DeviceId = reportSettings.device.id;
        }
      }
      var location = $location.url();
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
    });

    $scope.$watch("reportSetting.company", function(val){
      $scope.filteredAgentList = $scope.agentsList;
      if (val && typeof val === 'object') {
        $scope.ticketCompanyChoosen = true;
        if (agentsByCompany) {
          $scope.filteredAgentList = agentsByCompany[val.id];
        }
      }
    })

  }

})();
