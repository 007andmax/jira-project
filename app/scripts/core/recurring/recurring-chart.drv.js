'use strict';

(function () {

  angular.module("quicktech.core.recurring").directive("recurringCharts",
    ['$filter', function ($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: "<div class='chart'><canvas recurring-graph style='width: 100%; height: 100%; background: white'/>" +
        "<canvas tooltip-message width='126px' height='118px' style='position: relative; border-radius: 3px; box-shadow: 0 0 5px 0 rgba( 10, 45, 89, .25 );'></canvas></div>",
        scope: {
          firstGradientColor: "=firstGradientColor",
          secondGradientColor: "=secondGradientColor"
        },
        link: function ($scope, element, attrs, ctrl) {

          var chart = element.find('[recurring-graph]'),
            chartContext = chart[0].getContext("2d"),
            backgroundColour = chart.css('background-color'),
            tooltipMessage = [],
            tooltip = element.find('[tooltip-message]'),
            tooltipContext = tooltip[0].getContext("2d"),
            interval = {};

          tooltip.hide();

          $scope.$watch(function () {
            return ctrl.$viewValue;
          }, drawTotalChart, true);

          $(window).resize(function () {
            drawTotalChart();
          });

          function drawTotalChart() {

            var chartData = ctrl.$viewValue;

            chartContext.clearRect(0, 0, chart.width(), chart.height());

            chartContext.canvas.width = chartContext.canvas.clientWidth;
            chartContext.canvas.height = chartContext.canvas.clientHeight;

            if (chartData === undefined || chartData.length === 0) {
              return;
            }

            if (chartData[0].length !== chartData[1].length || chartData[0].length !== chartData[2].length || chartData[1].length !== chartData[2].length) {
              console.error('broken chart data')
            }

            var chartWidth = chart.width(),
              chartHeight = chart.height(),
              chartDataLength = chartData[0].length,
              maxValue = getMaxValue(chartData, chartDataLength),
              coef = Math.pow(10, ((maxValue.toFixed(0)).length - 2)),
              maxMark = (Math.ceil(maxValue / coef)) * coef,
              rectCoef = 0.8 * chartHeight / maxMark;

            interval = {
              bottomRect: chartHeight - (chartHeight * 0.15),
              bottomDate: chartHeight - (chartHeight * 0.05),
              leftRect: (chartWidth * 0.07),
              leftMarkLines: (chartWidth * 0.06),
              leftMarkValue: (((maxMark.toString()).length * 6) + 5),
              betweenRect: (chartWidth * 0.0156),
              widthRect: (chartWidth * 0.0156),
              betweenMarkLines: chartHeight * 0.2
            };

            if (maxMark < 30) {
              while ((maxMark % 2) !== 0) {
                maxMark++
              }
            } else if (maxMark < 100) {
              while ((maxMark % 10) !== 0) {
                maxMark++
              }
            }

            chartContext.font = "12px myriad-pro";
            chartContext.textAlign = "right";
            chartContext.fillStyle = "#7c8999";

            chartContext.fillText(maxMark, interval.leftMarkValue, interval.bottomRect - (interval.betweenMarkLines * 4));
            chartContext.fillText((maxMark / 2), interval.leftMarkValue, interval.bottomRect - (interval.betweenMarkLines * 2));
            chartContext.fillText('0', interval.leftMarkValue, interval.bottomRect);

            chartContext.fillText('-', interval.leftMarkLines, interval.bottomRect + 3 - (interval.betweenMarkLines * 4));
            chartContext.fillText('-', interval.leftMarkLines, interval.bottomRect + 3 - (interval.betweenMarkLines * 3));
            chartContext.fillText('-', interval.leftMarkLines, interval.bottomRect + 3 - (interval.betweenMarkLines * 2));
            chartContext.fillText('-', interval.leftMarkLines, interval.bottomRect + 3 - (interval.betweenMarkLines));
            chartContext.fillText('-', interval.leftMarkLines, interval.bottomRect + 3);

            var countDays = 1,
              heightWeeklyRect = 0,
              heightMonthlyRect = 0,
              heightYearlyRect = 0;

            tooltipMessage = [];

            for (var i = 0; i < chartDataLength; i++) {

              heightWeeklyRect = (chartData[0][i].sum * rectCoef);
              heightMonthlyRect = (chartData[1][i].sum * rectCoef);
              heightYearlyRect = (chartData[2][i].sum * rectCoef);

              chartContext.fillStyle = ('#E55035');
              chartContext.fillRect(interval.leftRect, interval.bottomRect, interval.widthRect, -heightWeeklyRect);

              chartContext.fillStyle = ('#68AF4E');
              chartContext.fillRect(interval.leftRect, interval.bottomRect - heightWeeklyRect - 1, interval.widthRect, -heightMonthlyRect);

              chartContext.fillStyle = ('#F3AE31');
              chartContext.fillRect(interval.leftRect, interval.bottomRect - heightWeeklyRect - heightMonthlyRect - (heightMonthlyRect ? 2 : 1), interval.widthRect, -heightYearlyRect);

              if ((countDays - 2) % 3 === 0) {

                var markDay = $filter('date')(chartData[0][i].date, 'd MMM');

                chartContext.fillStyle = "#7c8999";
                chartContext.textAlign = "center";
                chartContext.fillText(markDay, (interval.leftRect + (interval.widthRect / 2)), interval.bottomDate);
              }

              tooltipMessage.push({
                x1: interval.leftRect,
                y1: interval.bottomRect,
                x2: interval.leftRect + interval.widthRect,
                y2: interval.bottomRect - (heightWeeklyRect + heightMonthlyRect + heightYearlyRect),
                value: [chartData[0][i].sum, chartData[1][i].sum, chartData[2][i].sum],
                date: chartData[0][i].date
              });

              interval.leftRect += interval.betweenRect + interval.widthRect;
              countDays++;
            }

          }

          function getMaxValue(chartData, chartDataLength) {

            var maxValue = 0,
              sumValue = 0;

            for (var i = 0; i < chartDataLength; i++) {
              sumValue = chartData[0][i].sum + chartData[1][i].sum + chartData[2][i].sum;

              if (sumValue > maxValue) {
                maxValue = sumValue
              }
            }

            return maxValue;
          }

          chart.on('mousemove', function (e) {
            handleMouseMove(e, tooltipMessage);
          });

          function handleMouseMove(e, tooltipMessage) {

            var canvasOffset = chart.offset(),
              offsetX = canvasOffset.left + document.body.scrollLeft,
              offsetY = canvasOffset.top - document.body.scrollTop,
              mouseX = parseInt(e.clientX - offsetX),
              mouseY = parseInt(e.clientY - offsetY),
              redrawGraph = false;

            for (var i = 0; i < tooltipMessage.length; i++) {
              var rect = tooltipMessage[i],
                mouseOnRect = isMouseOnRect(mouseX, mouseY, rect);

              if (!mouseOnRect && rect.isTooltipShown) {
                redrawGraph = true;
                rect.isTooltipShown = false;
                tooltip.hide();
                continue;
              }

              if (mouseOnRect && !rect.isTooltipShown) {
                redrawGraph = true;
                rect.isTooltipShown = true;
                showTooltip(rect);
              }
            }
          }

          function isMouseOnRect(mouseX, mouseY, positionRect) {
            var trueForX = (mouseX > positionRect.x1 && mouseX < positionRect.x2);
            var trueForY = (mouseY > positionRect.y2 && mouseY < positionRect.y1);

            return (trueForX && trueForY);
          }

          function showTooltip(rect) {

            var date = $filter('date')(rect.date, 'EEE, d MMM yyyy'),
              leftPaddingCircle = 23,
              topPaddingCircle = 25;

            tooltipContext.clearRect(0, 0, tooltip.width(), tooltip.height());

            tooltipContext.fillStyle = "#141E2A";
            tooltipContext.fillRect(0, 0, tooltip.width(), tooltip.height());

            tooltipContext.textAlign = "left";
            tooltipContext.font = "14px myriad-pro";

            tooltipContext.fillStyle = backgroundColour;
            tooltipContext.fillText($filter('currency')(rect.value[2], '', 0) + ' USD', 32, topPaddingCircle + 5);
            drawIdentificationCircle('#F3AE31');

            tooltipContext.fillStyle = backgroundColour;
            tooltipContext.fillText($filter('currency')(rect.value[1], '', 0) + ' USD', 32, topPaddingCircle + 5);
            drawIdentificationCircle('#68AF4E');

            tooltipContext.fillStyle = backgroundColour;
            tooltipContext.fillText($filter('currency')(rect.value[0], '', 0) + ' USD', 32, topPaddingCircle + 5);
            drawIdentificationCircle('#E55035');

            tooltipContext.textAlign = "center";
            tooltipContext.font = "11px myriad-pro";
            tooltipContext.fillStyle = '#94a4b8';
            tooltipContext.fillText(date.toUpperCase(), tooltip.width() / 2, 98);

            tooltip.css({
              top: ( -(rect.y1 - rect.y2) - 177) + 'px',
              left: (rect.x1 + interval.widthRect / 2) - (tooltip.width() / 2) + 'px'
            });

            tooltip.show();

            function drawIdentificationCircle(color) {

              tooltipContext.beginPath();
              tooltipContext.fillStyle = color;
              tooltipContext.arc(leftPaddingCircle, topPaddingCircle, 3, 0, Math.PI * 2);
              tooltipContext.fill();
              tooltipContext.closePath();

              topPaddingCircle += 20;
            }
          }

        }
      }
    }]);
})();
