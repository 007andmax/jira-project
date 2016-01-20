'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.totalEarningChartCtrl',
    ['$scope', '$stateParams', 'StatisticsService', 'ReceivableService',
      function ($scope, $stateParams, StatisticsService, ReceivableService) {

        var lastDayToGetClosedTkt = new Date(),
          timeRange = 29,
          today = new Date();

        today.setHours(0, 0, 0, 0);

        $scope.totalEarningObj = ReceivableService.getReceivedPaymentsSumByCompany($stateParams.companyId, $scope, function (obj) {
          $scope.$watch('totalEarningObj.value', function () {
            $scope.totalEarningValue = obj.value;
            if ($scope.totalEarningValue > 0 && !$scope.isChartHasOpen) {
              $scope.setCollapsedValue(false);
              $scope.setChartHasOpenValue(true);
            }
          })
        });

        $scope.changeRangeDateToGetTotalEarnings = function (option) {

          var optionDay, year, month, day, firstDayToGetClosedTkt;

          year = lastDayToGetClosedTkt.getFullYear();
          month = lastDayToGetClosedTkt.getMonth();

          if (option === 'PREV') {
            optionDay = +lastDayToGetClosedTkt.getDate() - timeRange;
            lastDayToGetClosedTkt = new Date(year, month, optionDay);

          } else if (option === 'NEXT') {
            optionDay = +lastDayToGetClosedTkt.getDate() + timeRange;
            lastDayToGetClosedTkt = new Date(year, month, optionDay);
          }

          day = lastDayToGetClosedTkt.getDate() - timeRange;

          year = lastDayToGetClosedTkt.getFullYear();
          month = lastDayToGetClosedTkt.getMonth();
          firstDayToGetClosedTkt = new Date(year, month, day);

          $scope.totalEarningsByDays = StatisticsService.getTotalEarningsByDays($stateParams.companyId, firstDayToGetClosedTkt, lastDayToGetClosedTkt, $scope);

          $scope.disabledRightButton = +lastDayToGetClosedTkt >= +today;
          $scope.disabledLeftButton = firstDayToGetClosedTkt < ($scope.company.createdAt);
        };

        $scope.changeRangeDateToGetTotalEarnings();

      }]);

}());
