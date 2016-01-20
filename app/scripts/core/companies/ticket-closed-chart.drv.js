'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("ticketClosedChart",
    ['$filter', '$timeout', function ($filter, $timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: "<div class='chart-area' ng-if='includeCanvas'><canvas class='chart' ticket-closed-graph style='width: 100%; height: 100%; background: white'/>" +
        "<canvas tooltip-message width='75px' height='40px' style='position: relative; border-radius: 3px; box-shadow: 0 0 5px 0 rgba( 10, 45, 89, .25 );'></canvas></div>",
        scope: {
          isCollapsed: '=ticketClosedChart'
        },
        link: function ($scope, element, attrs, ctrl) {

          $scope.$watch('isCollapsed', function (val) {
            if (!val) {
              $scope.includeCanvas = true;
              $timeout(function () {
                reinitializeGraph();
              }, 0);
            } else {
              $scope.includeCanvas = false;
            }
          });

          function reinitializeGraph() {
            var chart = element.find('[ticket-closed-graph]'),
              chartContext = chart[0].getContext("2d"),
              backgroundColour = chart.css('background-color'),
              tooltipMessage = [],
              tooltip = element.find('[tooltip-message]'),
              tooltipContext = tooltip[0].getContext("2d"),
              widthRectangle;

            tooltip.hide();

            $scope.$watch(function () {
              return ctrl.$viewValue;
            }, drawticketClosedChart, true);

            $(window).resize(function () {
              drawticketClosedChart();
            });

            function drawticketClosedChart() {

              var chartData = ctrl.$viewValue;

              if (chart[0].clientWidth < 1 || chart[0].clientHeight < 1) {
                $timeout(function () {
                  reinitializeGraph();
                }, 300);
                return;
              }

              chartContext.clearRect(0, 0, chart.width(), chart.height());

              chartContext.canvas.width = chartContext.canvas.clientWidth;
              chartContext.canvas.height = chartContext.canvas.clientHeight;

              if (chartData === undefined) {
                return;
              }

              var chartWidth = chart.width(),
                chartHeight = chart.height(),
                maxValue = getMaxValue(chartData),
                coef = Math.pow(10, ((maxValue.toFixed(0)).length - 2)),
                maxMark = (Math.ceil(maxValue / coef)) * coef,
                markCoef = 0.79,
                marginLeft = chartWidth / 6.5,
                widthBetweenRectangle = chartWidth / 5.7,
                widthBetweenMarker = chartHeight / 6,
                widthBetweenBottomAndRectangle = chartHeight / 5,
                widthBetweenLeftAndText = chartWidth / 19,
                widthBetweenLeftAndMarker = chartWidth / 10,
                widthBetweenDateAndRectangle = chartHeight / 14;

              if (maxMark < 30) {
                while ((maxMark % 2) !== 0) {
                  maxMark++
                }
              } else if (maxMark < 100) {
                while ((maxMark % 10) !== 0) {
                  maxMark++
                }
              }

              var heightCoefValue = ((0.85 * chartHeight * markCoef) / maxMark);
              widthRectangle = chartWidth / 14.8;

              chartContext.font = "12px myriad-pro";
              chartContext.textAlign = "right";
              chartContext.fillStyle = "#7c8999";

              chartContext.fillText(maxMark, widthBetweenLeftAndText, chartHeight - (widthBetweenBottomAndRectangle + 4 * widthBetweenMarker));
              chartContext.fillText((maxMark / 2), widthBetweenLeftAndText, chartHeight - (widthBetweenBottomAndRectangle + 2 * widthBetweenMarker));
              chartContext.fillText('0', widthBetweenLeftAndText, chartHeight - widthBetweenBottomAndRectangle);

              chartContext.fillStyle = "#2d8ae5";

              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - (widthBetweenBottomAndRectangle + 4 * widthBetweenMarker));
              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - (widthBetweenBottomAndRectangle + 3 * widthBetweenMarker));
              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - (widthBetweenBottomAndRectangle + 2 * widthBetweenMarker));
              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - (widthBetweenBottomAndRectangle + widthBetweenMarker));
              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - widthBetweenBottomAndRectangle);

              var linearGradient = chartContext.createLinearGradient(0, 0, 0, chartHeight - widthBetweenBottomAndRectangle - 2);
              linearGradient.addColorStop(0, "#1A7DDC");
              linearGradient.addColorStop(1, "#3AA4E5");

              chartContext.textAlign = "center";

              tooltipMessage = [];

              for (var i = 0; i < chartData.length; i++) {

                var date = $filter('date')(chartData[i].date, 'd MMM');

                chartContext.fillStyle = linearGradient;
                chartContext.fillRect(marginLeft, chartHeight * markCoef, widthRectangle, -(chartData[i].value * heightCoefValue));

                chartContext.fillStyle = "#7c8999";
                chartContext.fillText(date || '', marginLeft + widthRectangle / 2, chartHeight - widthBetweenBottomAndRectangle + widthBetweenDateAndRectangle);

                tooltipMessage.push({
                  x1: marginLeft,
                  y1: chartHeight * markCoef,
                  x2: marginLeft + widthRectangle,
                  y2: chartHeight * markCoef - chartData[i].value * heightCoefValue,
                  value: chartData[i].value,
                  fromDate: chartData[i].fromDate,
                  toDate: chartData[i].toDate
                });

                marginLeft += widthBetweenRectangle + widthRectangle;
              }
            }

            function getMaxValue(chartData) {

              var maxValue = 0;

              for (var i = 0; i < chartData.length; i++) {
                if (maxValue < chartData[i].value) {
                  maxValue = chartData[i].value;
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
                  mouseOnRect = isMouseOnCircle(mouseX, mouseY, rect);

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

            function isMouseOnCircle(mouseX, mouseY, positionRect) {
              var trueForX = (mouseX > positionRect.x1 && mouseX < positionRect.x2);
              var trueForY = (mouseY > positionRect.y2 && mouseY < positionRect.y1);

              return (trueForX && trueForY);
            }

            function showTooltip(rect) {

              var currentValue = rect.value,
                rangeDate = $filter('date')(rect.fromDate, 'd MMM') + ' - ' + $filter('date')(rect.toDate, 'd MMM');


              tooltipContext.clearRect(0, 0, tooltip.width(), tooltip.height());

              tooltipContext.fillStyle = "#141E2A";
              tooltipContext.fillRect(0, 0, tooltip.width(), tooltip.height());

              tooltipContext.textAlign = "center";
              tooltipContext.fillStyle = backgroundColour;
              tooltipContext.fillText(currentValue, tooltip.width() / 2, 14);

              tooltipContext.fillStyle = '#616F7F';
              tooltipContext.fillText(rangeDate, tooltip.width() / 2, 30);

              tooltip.css({
                top: ( -(rect.y1 - rect.y2) - 90) + 'px',
                left: (rect.x1 + widthRectangle / 2) - (tooltip.width() / 2) + 'px'
              });

              tooltip.show();
            }
          }

        }
      }
    }]);
})();
