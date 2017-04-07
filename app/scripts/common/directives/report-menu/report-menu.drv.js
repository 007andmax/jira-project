'use strict';

(function(){

  angular.module("quicktech.common.directives").component("reportMenu", {
    templateUrl: '/html/scripts/common/directives/report-menu/report-menu.tpl.html',
    bindings: {},
    controller: reportMenuCtrl
  });

  function reportMenuCtrl($scope, CompaniesService, DevicesService) {
    var $ctrl = this;
    this.sendReportRequest = sendReportRequest;
    this.onDateRangeChangeReport = onDateRangeChangeReport;

    $scope.maxDateForDateRangeInputField = Date.now();
    $scope.reportType = "SUMMARY";
    $scope.clientCompanies = CompaniesService.getClientCompanies();

    /*function for reaching date from DATE RANGE form in template*/
    function onDateRangeChangeReport(dates) {

      function addZ(n){
        return n < 10 ? '0' + n : '' + n;
      }

      console.log("dates: ", dates);
      if(dates && dates.length && dates.length > 1) {

        var startMonth = dates[0].getMonth() + 1;
        var endMonth = dates[1].getMonth() + 1;

        $scope.startDate = dates[0].getFullYear() + "/" + addZ(startMonth) + "/" + addZ(dates[0].getDate());
        $scope.endDate = dates[1].getFullYear() + "/" + addZ(endMonth) + "/" + addZ(dates[1].getDate());
      }
    }

    function sendReportRequest(reportSettings){
      console.log("data in form: ", reportSettings);
      var dataToSend = {
        startDate: $scope.startDate,
        endDate: $scope.endDate,
        companyId: reportSettings.company.id,
        deviceId: reportSettings.device.id,
        type: $scope.reportType
      };
      console.log("Data in child Ctrl ", dataToSend);
      $scope.$emit("requestReportData", dataToSend)
    }

    var agentsByCompany = [];

    DevicesService.getDevicesCount($scope, function (agents) {
      agentsByCompany = agents;
      console.log("agents: ", agents);

      var agentsList = [];
      for (var companyId in agents) {
        if (companyId !== 'staticCopy') {
          agentsList = agentsList.concat(agents[companyId].map(function (agent) {
            agent.companyId = companyId;

            if ($scope.resolvedCompanyId === companyId && $scope.resolvedDeviceId === agent.id) {
              $timeout(function () {
                $scope.ticketAgent = agent;
              })
            }

            return agent;
          }));
        }
      }
      $scope.agentsList = angular.copy(agentsList);
    });

    $scope.$watch("reportSetting.company", function(val){
      console.log("val: ", val);
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
