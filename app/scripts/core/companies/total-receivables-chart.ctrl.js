'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.totalReceivablesChartCtrl',
    ['$scope', '$stateParams', 'StatisticsService',
      function ($scope, $stateParams, StatisticsService) {

        var lastDayToGetClosedTkt = new Date(),
          timeRange = 29,
          today = new Date();

        today.setHours(0, 0, 0, 0);

        $scope.totalReceivablesObj = StatisticsService.getReceivableAmountByCompany($stateParams.companyId, $scope, function (obj) {
          $scope.$watch('totalReceivablesObj.value', function () {
            $scope.totalReceivablesValue = obj.value;
            if ($scope.totalReceivablesValue > 0 && !$scope.isChartHasOpen) {
              //$scope.setCollapsedValue(false);
              $scope.setChartHasOpenValue(true);
            }
          })
        });

        $scope.changeRangeDateToGetTotalReceivables = function (option) {

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

          $scope.totalReceivableByDays = StatisticsService.getTotalReceivableByDays($stateParams.companyId, firstDayToGetClosedTkt, lastDayToGetClosedTkt, $scope);

          $scope.disabledRightButton = +lastDayToGetClosedTkt >= +today;
          $scope.disabledLeftButton = firstDayToGetClosedTkt < ($scope.company.createdAt);
        };

        $scope.changeRangeDateToGetTotalReceivables();

      }]);

}());
