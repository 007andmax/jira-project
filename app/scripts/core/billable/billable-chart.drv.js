'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("billableChart",
    ['$filter', function ($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: "<div><canvas class='chart' linear-graph style='background: white'/>" +
        "<canvas tooltip-message width='90px' height='55px' style='position: absolute; border-radius: 2px;'></canvas></div>",
        scope: {},
        link: function ($scope, element, attrs, ctrl) {

          var tooltip = element.find('[tooltip-message]'),
            tooltipContext = tooltip[0].getContext("2d"),
            chart = element.find('[linear-graph]'),
            chartContext = chart[0].getContext("2d"),
            backgroundColour = chart.css('background-color'),
            graphPoints = [];

          tooltip.hide();

          $scope.$watch(function () {
            return ctrl.$viewValue;
          }, drawBillableChart, true);

          window.onresize = function () {
            drawBillableChart(true)
          };

          function drawBillableChart(generateCircles) {

            var chartData = ctrl.$viewValue;

            chartContext.clearRect(0, 0, chart.width(), chart.height());

            chartContext.canvas.width = chartContext.canvas.clientWidth;
            chartContext.canvas.height = chartContext.canvas.clientHeight;

            if (chartData.length === 0) {
              return;
            }

            var chartWidth = chart.width(),
              chartHeight = chart.height(),
              maxValue = getMaxValue(chartData),
              markDate = [],
              coef = Math.pow(10, ((maxValue.toFixed(0)).length - 1)),
              maxMark = (Math.ceil(maxValue / coef)) * coef,
              midleMark = maxMark / 2,
              bottomMark = 0,
              markCoef = 0.8,
              heightCoefValue = ((chartHeight * markCoef) / maxMark),
              paddingRightNumber = ('' + maxMark).length * 5 + 10,
              paddingRightLineMark = Math.min(chartWidth * 0.06, 60);

            if (generateCircles) {

              var distanceToNextValue = Math.min(chartWidth * 0.072, 80),
                distanseBetweenValue = (chartContext.canvas.clientWidth - distanceToNextValue) / chartData.length;

              graphPoints = [];

              for (var i = 0; i < chartData.length; i++) {

                graphPoints.push({
                  x: distanceToNextValue,
                  y: (markCoef * chartHeight - (heightCoefValue * chartData[i].sum) + 10),
                  value: chartData[i].sum,
                  date: chartData[i].date
                });

                distanceToNextValue += distanseBetweenValue;
              }
            }

            chartContext.font = "12px myriad-pro";
            chartContext.textAlign = "right";
            chartContext.fillStyle = "#7c8999";

            chartContext.fillText(maxMark, paddingRightNumber, 13);
            chartContext.fillText(midleMark, paddingRightNumber, (13 + chartHeight * (markCoef / 2)));
            chartContext.fillText(bottomMark, paddingRightNumber, (13 + chartHeight * markCoef));

            chartContext.fillStyle = "#2d8ae5";

            chartContext.fillText('-', paddingRightLineMark, 10);
            chartContext.fillText('-', paddingRightLineMark, (10 + chartHeight * (markCoef / 4)));
            chartContext.fillText('-', paddingRightLineMark, (10 + chartHeight * (markCoef / 2)));
            chartContext.fillText('-', paddingRightLineMark, (10 + chartHeight * (markCoef / 2)) + (chartHeight * (markCoef / 4)));
            chartContext.fillText('-', paddingRightLineMark, (10 + chartHeight * markCoef));

            drawLines(true);
            drawLines();
            drawCircles();
            drawDates();

            chart.off('mousemove');
            chart.on('mousemove', function (e) {
              handleMouseMove(e, graphPoints);
            });

            function drawLines(drawGradient) {

              chartContext.beginPath();

              if (drawGradient) {
                chartContext.moveTo(graphPoints[0].x, markCoef * chartHeight);
              } else {
                chartContext.moveTo(graphPoints[0].x, graphPoints[0].y);
              }

              for (var i = 0; i < graphPoints.length; i++) {

                var point = graphPoints[i];

                chartContext.lineTo(point.x, point.y);

                if ((i - 2) % 9 === 0) {
                  markDate.push({
                    value: $filter('date')(chartData[i].date, 'd MMM'),
                    positionX: (point.x - 20)
                  });
                }

              }

              if (drawGradient) {

                chartContext.lineTo(point.x, markCoef * chartHeight);

                var grd = chartContext.createLinearGradient(0, 0, 0, markCoef * chartHeight / 1.5);
                grd.addColorStop(0, "#cbe1f7");
                grd.addColorStop(1, backgroundColour);

                chartContext.fillStyle = grd;
                chartContext.fill();
              }

              chartContext.strokeStyle = drawGradient ? backgroundColour : "#2d8ae5";
              chartContext.stroke();

              chartContext.closePath();
            }

            function drawCircles() {

              for (var i = 0; i < graphPoints.length; i++) {
                var point = graphPoints[i];

                drowOutWiteCircle(point.x, point.y);
                drowBlueCircle(point.x, point.y);

                if (!point.isTooltipShown) {
                  drowWhiteCircle(point.x, point.y)
                }
              }
            }

            function drawDates() {
              for (var i = 0; i < markDate.length; i++) {
                chartContext.fillStyle = "#7c8999";
                chartContext.fillText(markDate[i].value, markDate[i].positionX, chartHeight * 0.94);
              }
            }
          }

          function handleMouseMove(e, positionCircle) {

            var canvasOffset = chart.offset(),
              offsetX = canvasOffset.left + document.body.scrollLeft,
              offsetY = canvasOffset.top - document.body.scrollTop,
              mouseX = parseInt(e.clientX - offsetX),
              mouseY = parseInt(e.clientY - offsetY),
              redrawGraph = false;

            for (var i = 0; i < positionCircle.length; i++) {

              var circle = positionCircle[i],
                mouseOnCircle = isMouseOnCircle(mouseX, mouseY, circle);

              if (!mouseOnCircle && circle.isTooltipShown) {
                redrawGraph = true;
                circle.isTooltipShown = false;
                tooltip.hide();
                continue;
              }

              if (mouseOnCircle && !circle.isTooltipShown) {
                redrawGraph = true;
                circle.isTooltipShown = true;
                showTooltip(circle);
              }

            }

            if (redrawGraph) {
              drawBillableChart(false);
            }
          }

          function isMouseOnCircle(mouseX, mouseY, positionCircle) {
            var dot = positionCircle;
            var dx = mouseX - dot.x;
            var dy = mouseY - dot.y;

            return (dx * dx + dy * dy < 50);
          }

          function showTooltip(circle) {

            var currentValue = circle.value + ' USD',
              currentDay = $filter('date')(circle.date, 'EEE, d MMM yyyy');

            tooltipContext.clearRect(0, 0, tooltipContext.canvas.width, tooltipContext.canvas.height);

            tooltipContext.fillStyle = "#141E2A";
            tooltipContext.fillRect(0, 0, 90, 55);
            tooltipContext.textAlign = "center";

            tooltipContext.fillStyle = backgroundColour;
            tooltipContext.fillText(currentValue, 45, 20);

            tooltipContext.fillStyle = '#616F7F';
            tooltipContext.fillText(currentDay, 45, 40);

            tooltip.css({
              top: (circle.y + 40) + 'px',
              left: (circle.x) + 'px'
            });

            tooltip.show();
          }

          function getMaxValue(chartData) {

            var maxValue = 0;

            for (var i = 0; i < chartData.length; i++) {
              if (i === 0 || maxValue < chartData[i].sum) {
                maxValue = chartData[i].sum;
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

          function drowBlueCircle(x, y) {
            chartContext.beginPath();
            chartContext.fillStyle = '#027CE7';
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
