'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("billableChart",
    [function () {
      return {
        restrict: 'A',
        scope: {
          billableChartData: '=billableChartData'
        },
        link: function ($scope, element, attrs) {

          $scope.$watch('billableChartData', drawBillableChart);

          function drawBillableChart(chartData){
            console.log(chartData);

            var chart = $("#billableChart");

              console.log(chart)
              console.log(element)

              var chartContext = element[0].getContext("2d"),
              chartX = chart.width(),
              chartY = chart.height();

            console.log(chartX, chartY)

            chartContext.beginPath();

            chartContext.moveTo(500,150);
            chartContext.lineTo(550,175);
            chartContext.lineTo(550,125);
            chartContext.fill();

          }

        }
      }
    }]);
})();
