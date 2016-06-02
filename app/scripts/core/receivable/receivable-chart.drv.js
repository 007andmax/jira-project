'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("receivableChart",
    ['$filter', function ($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: "<div><canvas class='chart' linear-graph style='background: white'/>" +
        "<canvas tooltip-message width='112px' height='68px' style='position: absolute; border-radius: 3px; box-shadow: 0 0 5px 0 rgba( 10, 45, 89, .25 );'></canvas></div>",
        scope: {},
        link: function ($scope, element, attrs, ctrl) {

          var tooltip = element.find('[tooltip-message]'),
            tooltipContext = tooltip[0].getContext("2d"),
            chart = element.find('[linear-graph]'),
            chartContext = chart[0].getContext("2d"),
            backgroundColour = chart.css('background-color'),
            graphPoints = [],
            tooltipIndex = {index: undefined, numberLine: 0},
            interval = {};

          tooltip.hide();

          $scope.$watch(function () {
            return ctrl.$viewValue;
          }, drawRecurringChart, true);

          window.onresize = function () {
            drawRecurringChart()
          };

          function drawRecurringChart() {

            var chartData = ctrl.$viewValue;

            chartContext.clearRect(0, 0, chart.width(), chart.height());

            chartContext.canvas.width = chartContext.canvas.clientWidth;
            chartContext.canvas.height = chartContext.canvas.clientHeight;

            if (chartData === undefined || chartData.length === 0) {
              return;
            }

            var chartWidth = chart.width(),
              chartHeight = chart.height(),
              maxValue = getMaxValue(chartData),
              coef = Math.pow(10, ((maxValue.toFixed(0)).length - 2)),
              maxMark = Math.round(Math.ceil(maxValue / coef) * coef),
              heightValueCoef = 0.8 * chartHeight / maxMark;

            interval = {
              bottomNullMark: chartHeight - (chartHeight * 0.15),
              bottomDate: chartHeight - (chartHeight * 0.05),
              leftCircle: (chartWidth * 0.08),
              leftMarkLines: (chartWidth * 0.06),
              leftMarkValue: (((maxMark.toString()).length * 6) + 5),
              betweenCircle: (chartWidth * 0.031),
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

            chartContext.fillText(maxMark, interval.leftMarkValue, interval.bottomNullMark - (interval.betweenMarkLines * 4) + 3);
            chartContext.fillText((maxMark / 2), interval.leftMarkValue, interval.bottomNullMark - (interval.betweenMarkLines * 2) + 3);
            chartContext.fillText('0', interval.leftMarkValue, interval.bottomNullMark + 3);

            chartContext.fillText('-', interval.leftMarkLines, interval.bottomNullMark + 3 - (interval.betweenMarkLines * 4));
            chartContext.fillText('-', interval.leftMarkLines, interval.bottomNullMark + 3 - (interval.betweenMarkLines * 3));
            chartContext.fillText('-', interval.leftMarkLines, interval.bottomNullMark + 3 - (interval.betweenMarkLines * 2));
            chartContext.fillText('-', interval.leftMarkLines, interval.bottomNullMark + 3 - (interval.betweenMarkLines));
            chartContext.fillText('-', interval.leftMarkLines, interval.bottomNullMark + 3);

            var countDays = 1;
            graphPoints = [];

            for (var i = 0; i < chartData.length; i++) {

              if ((countDays - 2) % 9 === 0) {

                var markDay = $filter('date')(chartData[i].date, 'd MMM');

                chartContext.fillStyle = "#7c8999";
                chartContext.textAlign = "center";
                chartContext.fillText(markDay, interval.leftCircle, interval.bottomDate);
              }

              graphPoints.push({
                x: interval.leftCircle,
                y1: (interval.bottomNullMark - (heightValueCoef * chartData[i].total)),
                y2: (interval.bottomNullMark - (heightValueCoef * chartData[i].receivedOnDay)),
                value1: chartData[i].total,
                value2: chartData[i].receivedOnDay,
                date: chartData[i].date
              });

              interval.leftCircle += interval.betweenCircle;
              countDays++
            }


            drawLines(true, '#E5432D', 'y1');
            drawLines(false, '#E5432D', 'y1');

            drawLines(true, '#36A0E6', 'y2');
            drawLines(false, '#36A0E6', 'y2');

            drawCircles();
          }

          function drawCircles() {

            for (var i = 0; i < graphPoints.length; i++) {

              var point = graphPoints[i];

              drowOutWiteCircle(point.x, point.y1);
              drowOutWiteCircle(point.x, point.y2);

              drowColorCircle(point.x, point.y1, '#E5432D');
              drowColorCircle(point.x, point.y2, '#36A0E6');

              if (!(tooltipIndex.index === i)) {
                drowWhiteCircle(point.x, point.y1);
                drowWhiteCircle(point.x, point.y2)
              } else {
                tooltipIndex.numberLine === 2 ? drowWhiteCircle(point.x, point.y1) : drowWhiteCircle(point.x, point.y2);
              }
            }
          }

          function drawLines(drawGradient, color, graphIndex) {

            chartContext.beginPath();

            if (drawGradient) {
              chartContext.moveTo(graphPoints[0].x, interval.bottomNullMark);
            } else {
              chartContext.moveTo(graphPoints[0].x, graphPoints[0][graphIndex]);
            }

            for (var i = 0; i < graphPoints.length; i++) {
              var point = graphPoints[i];

              chartContext.lineTo(point.x, point[graphIndex]);
            }

            if (drawGradient) {

              var gradientColor = color === '#E5432D' ? '#FADBD7' : '#75BEEE';

              chartContext.lineTo(point.x, interval.bottomNullMark);

              var grd = chartContext.createLinearGradient(0, 0, 0, interval.bottomNullMark / 1.5);
              grd.addColorStop(0, gradientColor);
              grd.addColorStop(1, backgroundColour);

              chartContext.fillStyle = grd;
              chartContext.fill();
            }

            chartContext.strokeStyle = drawGradient ? backgroundColour : color;
            chartContext.stroke();
            chartContext.closePath();
          }

          chart.on('mousemove', function (e) {
            handleMouseMove(e, graphPoints);
          });

          function handleMouseMove(e, positionCircle) {

            var canvasOffset = chart.offset(),
              offsetX = canvasOffset.left + document.body.scrollLeft,
              offsetY = canvasOffset.top - document.body.scrollTop,
              mouseX = parseInt(e.clientX - offsetX),
              mouseY = parseInt(e.clientY - offsetY),
              redrawGraph = false;

            for (var i = 0; i < positionCircle.length; i++) {

              var circle = graphPoints[i],
                mouseOnCircle = isMouseOnCircle(mouseX, mouseY, circle);

              if (!mouseOnCircle.onCircle && (tooltipIndex.index === i)) {
                redrawGraph = true;
                tooltipIndex.index = undefined;
                tooltip.hide();
                continue;
              }

              if (mouseOnCircle.onCircle && !(tooltipIndex.index === i)) {
                redrawGraph = true;
                tooltipIndex.index = i;
                showTooltip(circle, mouseOnCircle.numberValue);
              }
            }

            if (redrawGraph) {
              drawRecurringChart();
            }

          }

          function isMouseOnCircle(mouseX, mouseY, positionCircle) {
            var dot = positionCircle;
            var dx = mouseX - dot.x;
            var dy1 = mouseY - dot.y1;
            var dy2 = mouseY - dot.y2;

            var circleInfo = {
              onCircle: (dx * dx + dy1 * dy1 < 50) || (dx * dx + dy2 * dy2 < 50),
              numberValue: (dx * dx + dy1 * dy1 < 50) ? 'value1' : 'value2'
            };

            if (circleInfo.onCircle) {
              tooltipIndex.numberLine = (dx * dx + dy1 * dy1 < 50) ? 1 : 2;
            }

            return circleInfo;
          }

          function showTooltip(circle, numberValue) {

            var currentDay = $filter('date')(circle.date, 'EEE, d MMM yyyy'),
              currentValue = $filter('currency')(circle[numberValue], '$', 2);

            tooltipContext.clearRect(0, 0, tooltipContext.canvas.width, tooltipContext.canvas.height);

            tooltipContext.fillStyle = "#141E2A";
            tooltipContext.fillRect(0, 0, 112, 68);
            tooltipContext.textAlign = "left";

            tooltipContext.fillStyle = backgroundColour;
            tooltipContext.font = "14px myriad-pro";
            tooltipContext.fillText(currentValue, 20, 30);

            tooltipContext.fillStyle = '#94a4b8';
            tooltipContext.font = "11px myriad-pro";
            tooltipContext.fillText(currentDay.toUpperCase(), 20, 48);

            tooltip.css({
              top: ((numberValue === 'value1' ? circle.y1 : circle.y2) + 20) + 'px',
              left: (circle.x - 26) + 'px'
            });

            tooltip.show();
          }

          function getMaxValue(chartData) {

            var maxValue = 0,
              currentValue = 0;

            for (var i = 0; i < chartData.length; i++) {
              currentValue = chartData[i].total;

              if (maxValue < currentValue) {
                maxValue = currentValue;
              }
            }

            return maxValue;
          }

          function drowOutWiteCircle(x, y) {
            chartContext.beginPath();
            chartContext.fillStyle = backgroundColour;
            chartContext.arc(x, y, 7, 0, Math.PI * 2);
            chartContext.fill();
            chartContext.closePath();
          }

          function drowColorCircle(x, y, color) {
            chartContext.beginPath();
            chartContext.fillStyle = color;
            chartContext.arc(x, y, 5, 0, Math.PI * 2);
            chartContext.fill();
            chartContext.closePath();
          }

          function drowWhiteCircle(x, y) {
            chartContext.beginPath();
            chartContext.fillStyle = backgroundColour;
            chartContext.arc(x, y, 2, 0, Math.PI * 2);
            chartContext.fill();
            chartContext.closePath();
          }
        }
      }
    }]);
})();
