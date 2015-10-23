'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.ticketsClosedChartCtrl',
    ['$scope', '$stateParams', 'StatisticsService',
      function ($scope, $stateParams, StatisticsService) {

        var lastDayToGetClosedTkt = new Date(),
          timeRange = 27,
          today = new Date();

        today.setHours(0, 0, 0, 0);

        $scope.changeRangeDateToGetClosedTkt = function (option) {

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

          $scope.ticketsClosedByDays = StatisticsService.getTicketsClosedByDays($stateParams.companyId, firstDayToGetClosedTkt, lastDayToGetClosedTkt, $scope, function () {

            var closedTicketsGraphData = [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
              countDay = 0,
              countRect = 0;

            $scope.allTicketsClosedByDays = 0;

            for (var date in $scope.ticketsClosedByDays) {
              if (date === 'staticCopy') {
                continue;
              }
              $scope.allTicketsClosedByDays += $scope.ticketsClosedByDays[date];

              if (countDay > 6) {
                countDay = 0;
                countRect++
              }

              closedTicketsGraphData[countRect].value += $scope.ticketsClosedByDays[date];

              if (countDay === 3) {
                closedTicketsGraphData[countRect].date = date;

              } else if (countDay === 0) {
                closedTicketsGraphData[countRect].fromDate = date;

              } else if (countDay === 6) {
                closedTicketsGraphData[countRect].toDate = date;
              }

              countDay++;
            }

            $scope.closedTicketsGraphData = closedTicketsGraphData
          });

          $scope.disabledRightButton = +lastDayToGetClosedTkt >= +today;
          $scope.disabledLeftButton = firstDayToGetClosedTkt < ($scope.company.createdAt);

        };

        $scope.changeRangeDateToGetClosedTkt();

      }]);

}());
