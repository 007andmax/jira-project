'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.workingHoursCtrl',
    ['$scope', 'CompaniesService', '$timeout', function ($scope, CompaniesService, $timeout) {
      var promise;

      $scope.isLastEnabledDay = function (workingDays, day) {
        return workingDays.filter(function (day) {
          return day.isSelected;
        }).length <= 1 && day.isSelected;
      };

      $scope.saveTicketResponseTimeSettings = function (form) {
       
        if (form.$valid) {
          var dto = angular.copy($scope.companyForSettingPage.responseTimeSettings);

          dto.outliersSeconds = $scope.outliersTime * 3600;
          dto.workingDays = dto.workingDays.filter(function (day) {
            var isSelected = day.isSelected;
            day.isSelected = undefined;
            return isSelected;
          });

          if (promise) {
            $timeout.cancel(promise);
          }

          promise = $timeout(function () {
            CompaniesService.saveForCompanyProfile(dto, 'workingTime');
          }, 400);
        }
      };

    }]);

}());
