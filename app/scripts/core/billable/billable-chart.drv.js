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

          $scope.$watch('billableChartData', drawBillableChart, true);

          function drawBillableChart(chartData) {

            if (chartData.length === 0) {
              return;
            }
            //
            //console.log(chartData);
            //console.log(chartData.length);

            var maxValue = 0;

            for (var i = 0; i < chartData.length; i++) {
              if (i === 0 || maxValue < chartData[i].sum) {
                maxValue = chartData[i].sum;
              }
            }

            var coef = Math.pow(10, ((maxValue.toFixed(0)).length - 1));
            var maxMark = (Math.ceil(maxValue / coef)) * coef,
              midleMark = maxMark / 2,
              bottomMark = 0,
              background = element.css('background-color');

            var chart = $("#billableChart"),
              chartContext = chart[0].getContext("2d"),
              chartX = chart.width(),
              chartY = chart.height();

            var markCoef = 0.8,
              heightCoefValue = ((chartY * markCoef) / maxMark),
              paddingRightNumber = ('' + maxMark).length * 5 + 10,
              paddingRightLineMark = chartX * 0.06,
              paddingRightFirstValue = chartX * 0.0535;

            chartContext.font = "12px myriad-pro";
            chartContext.textAlign = "right";
            chartContext.fillStyle = "#7c8999";

            chartContext.fillText(maxMark, paddingRightNumber, 13);
            chartContext.fillText(midleMark, paddingRightNumber, (13 + chartY * (markCoef / 2)));
            chartContext.fillText(bottomMark, paddingRightNumber, (13 + chartY * markCoef));

            chartContext.fillStyle = "#2d8ae5";

            chartContext.fillText('-', paddingRightLineMark, 10);
            chartContext.fillText('-', paddingRightLineMark, (10 + chartY * (markCoef / 4)));
            chartContext.fillText('-', paddingRightLineMark, (10 + chartY * (markCoef / 2)));
            chartContext.fillText('-', paddingRightLineMark, (10 + chartY * (markCoef / 2)) + (chartY * (markCoef / 4)));
            chartContext.fillText('-', paddingRightLineMark, (10 + chartY * markCoef));

            drawLines(true);
            drawLines();

            function drawLines(drawGradient) {

              var distanceToNextValue = paddingRightFirstValue + 25,
                distanseBetweenValue = 0.0315 * chartX;

              chartContext.beginPath();

              if (drawGradient) {
                chartContext.moveTo(distanceToNextValue, markCoef * chartY);
              } else {
                chartContext.moveTo(distanceToNextValue, (markCoef * chartY - (heightCoefValue * chartData[0].sum) + 10));
              }

              for (var i = 0; i < chartData.length; i++) {

                //drawDonut(distanceToNextValue, (markCoef * chartY - (heightCoefValue * chartData[i].sum) + 10));

                chartContext.lineTo(distanceToNextValue, (markCoef * chartY - (heightCoefValue * chartData[i].sum) + 10));
                distanceToNextValue += distanseBetweenValue;

              }

              if (drawGradient) {
                var grd = chartContext.createLinearGradient(0, 0, 0, markCoef * chartY / 1.5);
                grd.addColorStop(0, "#cbe1f7");
                grd.addColorStop(1, background);


                chartContext.fillStyle = grd;
                chartContext.fill();
              }

              chartContext.strokeStyle = drawGradient ? background : "#2d8ae5";
              chartContext.stroke();

              chartContext.closePath();

            }

            function drawDonut(x, y) {

              chartContext.arc(x, y, 5, 0, Math.PI * 2);
              chartContext.moveTo(x, y);

              chartContext.fill();
            }

          }

        }
      }
    }]);
})();
