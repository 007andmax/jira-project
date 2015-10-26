'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.totalReceivablesChartCtrl',
    ['$scope', '$stateParams', 'StatisticsService',
      function ($scope, $stateParams, StatisticsService) {

        var lastDayToGetClosedTkt = new Date(),
          timeRange = 29,
          today = new Date();

        today.setHours(0, 0, 0, 0);

        $scope.changeRangeDateToGetTotalReceivables = function (option) {

          var optionDay, year, month, day, firstDayToGetClosedTkt;

          $scope.totalReceivablesValue = 0;

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

          console.log(firstDayToGetClosedTkt, lastDayToGetClosedTkt)

          $scope.totalReceivableByDays = StatisticsService.getTotalReceivableByDays($stateParams.companyId, firstDayToGetClosedTkt, lastDayToGetClosedTkt, $scope, function () {

            for (var date in $scope.totalReceivableByDays) {
              if (date === 'staticCopy') {
                continue;
              }

              $scope.totalReceivablesValue += $scope.totalReceivableByDays[date];
            }

            if($scope.totalReceivablesValue){
              $scope.totalReceivablesValue = $scope.totalReceivablesValue.toFixed(2);
            }

            console.log($scope.totalReceivableByDays)
            console.log(Object.keys($scope.totalReceivableByDays).length)

          });

          $scope.disabledRightButton = +lastDayToGetClosedTkt >= +today;
          $scope.disabledLeftButton = firstDayToGetClosedTkt < ($scope.company.createdAt);
        };

        $scope.changeRangeDateToGetTotalReceivables();

      }]);

}());
