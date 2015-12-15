'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("ticketsDonoughtChart",
    ['$filter', 'CompaniesService', function ($filter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: "<div class='chart-area'>" +
        "<canvas class='chart' tickets-donought-graph style='width: 146px; height: 146px; background: #fffaf2'/>" +
        "<canvas tooltip-message style='position: absolute; border-radius: 4px; background-color: #151E29; width: 70px; height: 70px;'></canvas></div>",
        scope: {},
        link: function ($scope, element, attrs, ctrl) {

          var label = {
            text: 'TICKETS'
          };

          var chart = element.find('[tickets-donought-graph]'),
            chartContext = chart[0].getContext("2d"),
            tipCanvas = element.find('[tooltip-message]'),
            tipContext = tipCanvas[0].getContext("2d"),
            chartX = chart.width() / 2,
            chartY = chart.height() / 2,
            radius = 65,
            backgroundColor = chart.css('background-color');

          $scope.$watch(function () {
            return ctrl.$viewValue;
          }, function () {
            drawGraph()
          }, true);

          $(window).resize(function () {
            drawGraph();
          });

          function drawGraph(highlightColor) {

            if (ctrl.$viewValue === undefined || ctrl.$viewValue.length === 0) {
              return;
            }

            var inputData = ctrl.$viewValue;
            label.num = 0;

            for (var i = 0; i < inputData.length; i++) {
              label.num += inputData[i].value
            }

            chartContext.canvas.width = chartContext.canvas.clientWidth;
            chartContext.canvas.height = chartContext.canvas.clientHeight;

            tipContext.canvas.width = tipContext.canvas.clientWidth;
            tipContext.canvas.height = tipContext.canvas.clientHeight;


            tipCanvas.hide();

            chartContext.clearRect(0, 0, chart.width(), chart.height());
            tipContext.clearRect(0, 0, tipCanvas.width(), tipCanvas.height());

            var endPoints = [],
              nonZeroCirclesCount = 0,
              totalSum = 0,
              start = 0,
              end;

            for (var i = 0; i < inputData.length; i++) {

              var value = inputData[i].value;
              totalSum += value;

              if (value) nonZeroCirclesCount++
            }

            for (var i = 0; i < inputData.length; i++) {

              chartContext.strokeStyle = inputData[i].color;
              chartContext.lineWidth = 6;
              chartContext.shadowBlur = 0;

              if (i > 0) {
                start = end;
              }

              end = start + (inputData[i].value / totalSum * 2 * Math.PI);

              chartContext.beginPath();
              chartContext.arc(chartX, chartY, radius, start, end);
              chartContext.stroke();
              chartContext.closePath();

              if (highlightColor && inputData[i].color.toLowerCase() === highlightColor.toLowerCase()) {

                var offsetStart = 0,
                  offsetEnd = 0;

                if (nonZeroCirclesCount > 1) {
                  offsetStart = 0.018;
                  offsetEnd = 0.02;
                }

                chartContext.beginPath();
                chartContext.shadowBlur = 10;
                chartContext.shadowColor = inputData[i].color;
                chartContext.arc(chartX, chartY, radius, start + offsetStart * Math.PI, end - offsetEnd * Math.PI);
                chartContext.stroke();
                chartContext.closePath();

                tipContext.fillStyle = "#94A4B8";
                tipContext.font = "12px Arial";
                tipContext.textAlign = "center";
                tipContext.fillText(inputData[i].label, 35, 28);


                tipContext.fillStyle = backgroundColor;
                tipContext.font = "14px  Arial";
                tipContext.textAlign = "center";
                tipContext.fillText(inputData[i].value, 35, 50);

                var segmentCenterAngle = end - (end - start) / 2,
                  tipPoint = getPoint(chartX, chartY, radius, segmentCenterAngle),
                  canvasPosition = chart.position(),
                  tipPositionTop = tipPoint[1] + canvasPosition.top,
                  tipPositionLeft = tipPoint[0] + canvasPosition.left;

                if (segmentCenterAngle < Math.PI / 2) {
                  tipPositionTop += 5;
                  tipPositionLeft += 5;
                } else if (segmentCenterAngle < Math.PI) {
                  tipPositionTop += 5;
                  tipPositionLeft -= tipCanvas.width() + 5;
                } else if (segmentCenterAngle < Math.PI * 1.5) {
                  tipPositionTop -= tipCanvas.height() + 5;
                  tipPositionLeft -= tipCanvas.width() + 5;
                } else if (segmentCenterAngle < Math.PI * 2) {
                  tipPositionTop -= tipCanvas.height() + 5;
                  tipPositionLeft += 5;
                }

                tipCanvas.show();
                tipCanvas.css({
                  top: tipPositionTop + 'px',
                  left: tipPositionLeft + 'px'
                });


              }

              var endPoint = getPoint(chartX, chartY, radius, end - 8 / radius / 4 * Math.PI);

              endPoints.push({
                x: endPoint[0],
                y: endPoint[1],
                start: end,
                end: end + Math.PI
              });

              chartContext.shadowBlur = 0;

              chartContext.fillStyle = "#1f2a37";
              chartContext.font = "26px myriad-pro";
              chartContext.textAlign = "center";
              chartContext.fillText(label.num, chartX, chartY);

              chartContext.fillStyle = "#8585AD";
              chartContext.font = "11px myriad-pro";
              chartContext.fillText(label.text, chartX, chartY + 15);
            }

            chartContext.strokeStyle = backgroundColor;
            chartContext.lineWidth = 4;
            chartContext.shadowBlur = 0;

            if (nonZeroCirclesCount > 1) {
              for (var i = 0; i < endPoints.length; i++) {

                var endPoint = endPoints[i];

                chartContext.beginPath();
                chartContext.arc(endPoint.x, endPoint.y, 7, endPoint.start, endPoint.end);
                chartContext.stroke();
                chartContext.closePath();
              }
            }
          }

          function getPoint(c1, c2, radius, angle) {
            return [c1 + Math.cos(angle) * radius, c2 + Math.sin(angle) * radius];
          }

          function rgbToHex(r, g, b) {
            if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
            return ((r << 16) | (g << 8) | b).toString(16);
          }

          function findElementPosition(obj) {
            var curleft = 0,
              curtop = 0;
            if (obj.offsetParent) {
              do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
              } while (obj = obj.offsetParent);
              return {
                x: curleft,
                y: curtop
              };
            }
            return undefined;
          }

          chart.mousemove(function (e) {

            var pos = findElementPosition(this);
            var x = e.pageX - pos.x;
            var y = e.pageY - pos.y;
            var p = chartContext.getImageData(x, y, 1, 1).data;
            var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

            drawGraph(hex);
          });

        }
      }
    }]);
})();
