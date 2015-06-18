'use strict';

(function () {

  angular.module("quicktech.core.users").directive('canvasCrop',
    ['$modal', function ($modal) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var canvas = element.find('canvas'),
            ctx = canvas[0].getContext("2d"),
            cropWidth = 242,
            cropHeight = 242,
            cropX = canvas[0].width / 2 - cropWidth / 2,
            cropY = canvas[0].height / 2 - cropHeight / 2,
            imageWidth = scope.image.width,
            imageHeight = scope.image.height,
            multiplier = Math.min(canvas[0].width / imageWidth, canvas[0].height / imageHeight),
            cropped;

          if (scope.avatar.scale === 50 && !scope.avatar.x && !scope.avatar.y) {
            imageWidth *= multiplier;
            imageHeight *= multiplier;
            scope.avatar.x = canvas[0].width / 2 - imageWidth / 2;
            scope.avatar.y = canvas[0].height / 2 - imageHeight / 2;
          }

          scaleAndRedraw();

          var isDragging = false,
            dragCoordinates = {};

          canvas
            .mousedown(function (e) {
              isDragging = true;
              dragCoordinates.x = e.offsetX;
              dragCoordinates.y = e.offsetY;
            })
            .mousemove(function (e) {
              if (isDragging) {
                scope.avatar.x += e.offsetX - dragCoordinates.x;
                scope.avatar.y += e.offsetY - dragCoordinates.y;

                dragCoordinates.x = e.offsetX;
                dragCoordinates.y = e.offsetY;

                fixBoundsAndRedrawImage();
              }
            })
            .mouseup(function () {
              isDragging = false;
              dragCoordinates = {};
            });

          scope.$watch('avatar.scale', scaleAndRedraw);

          scope.getCroppedDataUrl = function () {
            var canvas = $('<canvas width="' + cropWidth + 'px" height="' + cropHeight + 'px">');
            canvas[0].getContext("2d").putImageData(cropped, 0, 0);
            var dataUrl = canvas[0].toDataURL();

            return dataUrl;
          };

          function scaleAndRedraw() {
            var scalePercents = 1 + (scope.avatar.scale - 50) / 50;

            if (scalePercents < 1) {

              var availableReduceW = (scope.image.width * multiplier) - cropWidth;
              var availableReduceH = (scope.image.height * multiplier) - cropHeight;

              if (availableReduceW < availableReduceH) {
                scalePercents = (scope.image.width * multiplier - (availableReduceW * (1 - scalePercents))) / (scope.image.width * multiplier);
              } else {
                scalePercents = (scope.image.height * multiplier - (availableReduceH * (1 - scalePercents))) / (scope.image.height * multiplier);
              }
            }

            imageWidth = scope.image.width * multiplier * scalePercents;
            imageHeight = scope.image.height * multiplier * scalePercents;

            if (scalePercents < 1) {
              fixBoundsAndRedrawImage()
            } else if (checkBounds()) {
              redrawImage();
            }
          }

          function redrawImage() {
            ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
            ctx.drawImage(scope.image, scope.avatar.x, scope.avatar.y, imageWidth, imageHeight);
            cropped = ctx.getImageData(cropX, cropY, cropWidth, cropHeight);
            ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
            ctx.globalAlpha = 0.6;
            ctx.drawImage(scope.image, scope.avatar.x, scope.avatar.y, imageWidth, imageHeight);
            ctx.globalAlpha = 1;
            ctx.putImageData(cropped, cropX, cropY);

            //draw crop rect
            ctx.beginPath();
            ctx.lineWidth = '1.5';
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.rect(cropX, cropY, cropWidth, cropHeight);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            drawDot(cropX, cropY);
            drawDot(cropX + cropWidth, cropY);
            drawDot(cropX, cropY + cropHeight);
            drawDot(cropX + cropWidth, cropY + cropHeight);
            ctx.fill();
            ctx.closePath();
          }

          function drawDot(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
          }

          function checkBounds() {
            return scope.avatar.x <= cropX
              && scope.avatar.y <= cropY
              && scope.avatar.x + imageWidth >= cropX + cropWidth
              && scope.avatar.y + imageHeight >= cropY + cropHeight;
          }

          function fixBoundsAndRedrawImage() {

            if (scope.avatar.x > cropX) {
              scope.avatar.x = cropX;
            }

            if (scope.avatar.y > cropY) {
              scope.avatar.y = cropY;
            }

            if (scope.avatar.x + imageWidth < cropX + cropWidth) {
              scope.avatar.x = cropX + cropWidth - imageWidth;
            }

            if (scope.avatar.y + imageHeight < cropY + cropHeight) {
              scope.avatar.y = cropY + cropHeight - imageHeight;
            }

            redrawImage();
          }
        }
      }
    }]);

})();
