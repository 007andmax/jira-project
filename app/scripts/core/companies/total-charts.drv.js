'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("totalCharts",
    ['$filter', '$timeout', function ($filter, $timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: "<div class='chart-area' ng-if='includeCanvas'><canvas class='chart' ticket-closed-graph style='width: 100%; height: 100%; background: white'/>" +
        "<canvas tooltip-message width='84px' height='40px' style='position: relative; border-radius: 3px;box-shadow: 0 0 5px 0 rgba( 10, 45, 89, .25 );'></canvas></div>",
        scope: {
          firstGradientColor: "=firstGradientColor",
          secondGradientColor: "=secondGradientColor",
          isCollapsed: "=totalCharts"
        },
        link: function ($scope, element, attrs, ctrl) {

          var watchListener,
            resizeListener,
            isGraphDraw = false;

          $scope.$watch('isCollapsed', function (val) {
            if (!val) {
              isGraphDraw = false;
              $scope.includeCanvas = true;
              $timeout(function () {
                initializeGraph();
              }, 0);
            } else {
              $scope.includeCanvas = false;
            }
          });

          function initializeGraph() {

            if(!$scope.includeCanvas || isGraphDraw){
              return;
            }

            if (typeof watchListener === "function") {
              watchListener()
            }

            if (typeof resizeListener === "function") {
              resizeListener()
            }

            var chart = element.find('[ticket-closed-graph]'),
              chartContext = chart[0].getContext("2d"),
              backgroundColour = chart.css('background-color'),
              tooltipMessage = [],
              tooltip = element.find('[tooltip-message]'),
              tooltipContext = tooltip[0].getContext("2d"),
              widthRectangle;

            tooltip.hide();

            watchListener = $scope.$watch(function () {
              return ctrl.$viewValue;
            }, drawTotalChart, true);

            resizeListener = $(window).on('resize', function () {
              drawTotalChart();
            });

            function drawTotalChart() {

              var chartData = ctrl.$viewValue;
              var chartDataLength = Object.keys(chartData).length;

              if (chart[0].clientWidth < 1 || chart[0].clientHeight < 1) {
                $timeout(function () {
                  initializeGraph();
                }, 300);
                return;
              } else {
                isGraphDraw = true;
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
                marginLeft = chartWidth / 8,
                widthBetweenRectangle = chartWidth / chartDataLength / 2.3,
                widthBetweenMarker = chartHeight / 6,
                widthBetweenBottomAndRectangle = chartHeight / 5,
                widthBetweenLeftAndText = ('' + maxMark).length * 5 + 10,
                widthBetweenLeftAndMarker = chartWidth / 10;


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
              widthRectangle = chartWidth / chartDataLength / 2.2;

              chartContext.font = "12px myriad-pro";
              chartContext.textAlign = "right";
              chartContext.fillStyle = "#7c8999";

              chartContext.fillText(maxMark, widthBetweenLeftAndText, chartHeight - (widthBetweenBottomAndRectangle + 4 * widthBetweenMarker));
              chartContext.fillText((maxMark / 2), widthBetweenLeftAndText, chartHeight - (widthBetweenBottomAndRectangle + 2 * widthBetweenMarker));
              chartContext.fillText('0', widthBetweenLeftAndText, chartHeight - widthBetweenBottomAndRectangle);

              chartContext.fillStyle = $scope.firstGradientColor;

              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - (widthBetweenBottomAndRectangle + 4 * widthBetweenMarker));
              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - (widthBetweenBottomAndRectangle + 3 * widthBetweenMarker));
              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - (widthBetweenBottomAndRectangle + 2 * widthBetweenMarker));
              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - (widthBetweenBottomAndRectangle + widthBetweenMarker));
              chartContext.fillText('-', widthBetweenLeftAndMarker, chartHeight - widthBetweenBottomAndRectangle);

              var linearGradient = chartContext.createLinearGradient(0, 0, 0, chartHeight - widthBetweenBottomAndRectangle - 2);
              linearGradient.addColorStop(0, $scope.firstGradientColor);
              linearGradient.addColorStop(1, $scope.secondGradientColor);

              chartContext.textAlign = "center";

              tooltipMessage = [];

              var countDays = 0;

              for (var date in chartData) {

                chartContext.fillStyle = linearGradient;
                chartContext.fillRect(marginLeft, chartHeight * markCoef, widthRectangle, -(chartData[date] * heightCoefValue));

                tooltipMessage.push({
                  x1: marginLeft,
                  y1: chartHeight * markCoef,
                  x2: marginLeft + widthRectangle,
                  y2: chartHeight * markCoef - chartData[date] * heightCoefValue,
                  value: chartData[date],
                  date: date
                });

                if ((countDays - 2) % 9 === 0) {

                  var markDay = $filter('date')(date, 'd MMM');

                  chartContext.fillStyle = "#7c8999";
                  chartContext.fillText(markDay, marginLeft - 12, chartHeight * 0.94);
                }

                marginLeft += widthBetweenRectangle + widthRectangle;
                countDays++;
              }

            }

            function getMaxValue(chartData) {

              var maxValue = 0;

              for (var date in  chartData) {
                if (maxValue < chartData[date]) {
                  maxValue = chartData[date];
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

              var currentValue = rect.value,
                date = $filter('date')(rect.date, 'EEE, d MMM yyyy');


              tooltipContext.clearRect(0, 0, tooltip.width(), tooltip.height());

              tooltipContext.fillStyle = "#151e29";
              tooltipContext.fillRect(0, 0, tooltip.width(), tooltip.height());

              tooltipContext.textAlign = "center";
              tooltipContext.fillStyle = backgroundColour;
              tooltipContext.fillText(currentValue, tooltip.width() / 2, 14);

              tooltipContext.fillStyle = '#94a4b8';
              tooltipContext.fillText(date, tooltip.width() / 2, 30);

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
