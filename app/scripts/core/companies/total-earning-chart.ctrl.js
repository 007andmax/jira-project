'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.totalEarningChartCtrl',
    ['$scope', '$stateParams', 'StatisticsService',
      function ($scope, $stateParams, StatisticsService) {

        var lastDayToGetClosedTkt = new Date(),
          timeRange = 29,
          today = new Date();

        today.setHours(0, 0, 0, 0);

        $scope.changeRangeDateToGetTotalEarnings = function (option) {

          var optionDay, year, month, day, firstDayToGetClosedTkt;

          $scope.totalEarningValue = 0;

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

          $scope.totalEarningsByDays = StatisticsService.getTotalEarningsByDays($stateParams.companyId, firstDayToGetClosedTkt, lastDayToGetClosedTkt, $scope, function () {

            for (var date in $scope.totalEarningsByDays) {
              if (date === 'staticCopy') {
                continue;
              }

              $scope.totalEarningValue += $scope.totalEarningsByDays[date];
            }

          });

          $scope.disabledRightButton = +lastDayToGetClosedTkt >= +today;
          $scope.disabledLeftButton = firstDayToGetClosedTkt < ($scope.company.createdAt);
        };

        $scope.changeRangeDateToGetTotalEarnings();

      }]);

}());
