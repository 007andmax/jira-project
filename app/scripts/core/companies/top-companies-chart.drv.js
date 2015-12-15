'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("topCompaniesCharts",
    ['$filter', 'CompaniesService', function ($filter, CompaniesService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: "<div class='chart-area'><canvas class='chart' ticket-closed-graph style='width: 100%; height: 100%; background: white'/>" +
        "<canvas tooltip-message style='position: relative; border-radius: 3px; box-shadow: 0 0 5px 0 rgba( 10, 45, 89, .25 );'></canvas></div>",
        scope: {
          firstGradientColor: "=firstGradientColor",
          secondGradientColor: "=secondGradientColor"
        },
        link: function ($scope, element, attrs, ctrl) {

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
          }, drawTotalChart, true);

          $(window).resize(function() {
            drawTotalChart();
          });

          function drawTotalChart() {

            var chartData = ctrl.$viewValue;
            var chartDataLength = Object.keys(chartData).length - 1;

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
              markCoef = 0.95,
              marginLeft = chartWidth / 8,
              widthBetweenRectangle = chartWidth / chartDataLength / 2.2,
              widthBetweenMarker = chartHeight / 5,
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

            chartContext.fillText(maxMark, widthBetweenLeftAndText, chartHeight * markCoef - 4 * widthBetweenMarker);
            chartContext.fillText((maxMark / 2), widthBetweenLeftAndText, chartHeight * markCoef - 2 * widthBetweenMarker);
            chartContext.fillText('0', widthBetweenLeftAndText, chartHeight * markCoef);

            chartContext.fillStyle = $scope.firstGradientColor;

            chartContext.fillText('-', widthBetweenLeftAndMarker, (chartHeight * markCoef - 4 * widthBetweenMarker) + 3);
            chartContext.fillText('-', widthBetweenLeftAndMarker, (chartHeight * markCoef - 3 * widthBetweenMarker) + 3);
            chartContext.fillText('-', widthBetweenLeftAndMarker, (chartHeight * markCoef - 2 * widthBetweenMarker) + 3);
            chartContext.fillText('-', widthBetweenLeftAndMarker, (chartHeight * markCoef - widthBetweenMarker) + 3);
            chartContext.fillText('-', widthBetweenLeftAndMarker, (chartHeight * markCoef) + 3);

            var linearGradient = chartContext.createLinearGradient(0, 0, 0, chartHeight - widthBetweenBottomAndRectangle - 2);
            linearGradient.addColorStop(0, $scope.firstGradientColor);
            linearGradient.addColorStop(1, $scope.secondGradientColor);

            chartContext.textAlign = "center";

            tooltipMessage = [];

            var countDays = 0;

            for (var companyId in chartData) {

              if(companyId === 'staticCopy'){
                continue;
              }

              chartContext.fillStyle = linearGradient;
              chartContext.fillRect(marginLeft, chartHeight * markCoef, widthRectangle, - (chartData[companyId] * heightCoefValue));

              tooltipMessage.push({
                x1: marginLeft,
                y1: chartHeight * markCoef,
                x2: marginLeft + widthRectangle,
                y2: chartHeight * markCoef - chartData[companyId] * heightCoefValue,
                value: chartData[companyId],
                companyId: companyId
              });

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

            var currentValue = parseInt(rect.value),
              companyName = CompaniesService.getOneById(rect.companyId).name,
              tooltipWidth = companyName.length > 7 ? ((companyName.length * 5) + 48) : 84;

            tooltip.width(tooltipWidth);
            tooltip.height(68);

            tooltipContext.canvas.width = tooltip.width();
            tooltipContext.canvas.height = tooltip.height();

            tooltipContext.clearRect(0, 0, tooltip.width(), tooltip.height());

            tooltipContext.fillStyle = "#151e29";
            tooltipContext.fillRect(0, 0, tooltip.width(), tooltip.height());

            tooltipContext.textAlign = "left";
            tooltipContext.fillStyle = backgroundColour;
            tooltipContext.font = "14px myriad-pro";
            tooltipContext.fillText(currentValue, 20, 30);

            tooltipContext.fillStyle = '#94a4b8';
            tooltipContext.font = "11px myriad-pro";
            tooltipContext.fillText(companyName.toUpperCase(), 20, 48);

            tooltip.css({
              top: ( -(rect.y1 - rect.y2) - 90) + 'px',
              left: (rect.x1 + widthRectangle / 2) - (tooltip.width() / 2) + 'px'
            });

            tooltip.show();
          }

        }
      }
    }]);
})();
