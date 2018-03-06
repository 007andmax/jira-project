'use strict';

(function () {
  angular.module("quicktech.core.companies").directive('convertToPdf',
    ['$http', '$timeout', 'Downloader', 'quicktech.common.services.UserNotificationService',
    function ($http, $timeout, Downloader, UserNotificationService) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var disableElement, url = '', selectedHtml;
        disableOpenPdfBtn();

        attrs.$observe('fileName', function (fileName) {
          if (fileName) {
            scope.$on('buildPdf-' + fileName, getPdfIdFromRest);
          }
        });

        scope.openInPdf = function (callback) {
          if (!disableElement.length || (disableElement.hasClass('disabled') || typeof disableElement.attr('disabled') === 'string')) {
            return;
          }
          var newWindow = window.open(url);
          callback && callback(newWindow);
        };

        scope.downloadAsPdf = function (callback) {
          if (!disableElement.length || (disableElement.hasClass('disabled') || typeof disableElement.attr('disabled') === 'string')) {
            return;
          }
          Downloader.downloadByUrl(url, attrs.fileName);
        };

        scope.sendToMail = function (emails, callback) {
          if (emails && emails.length) {
            var dto = {
              content: selectedHtml,
              emails: emails,
              fileName: attrs.fileName,
              orientation: attrs.orientation || 'PORTRAIT'
            };
            $http.post(attrs.emailEndpoint, dto).then(function () {
              UserNotificationService.show('Report was sent successfully.', true);
              callback && callback();
            });
          }
        };

        function disableOpenPdfBtn() {
          disableElement = angular.element(document).find(attrs.disableSelector);
          if (disableElement.length) {
            disableElement.attr('disabled', 'disabled');
            disableElement.addClass('disabled');
          }
        }

        function getPdfIdFromRest() {
          disableOpenPdfBtn();

          var source = element.find(attrs.selector);
          var target = source.clone(),
            unknownLoadingStr = 'Loading...',
            sourceSVGs = source.find('svg'),
            canvas = document.createElement('canvas');

          target.find('.ng-hide').remove();

          if (sourceSVGs && sourceSVGs.length) {
            var svgs = target.find('svg');
            svgs.replaceWith(function (index) {
              var svg = angular.element(sourceSVGs[index]),
                img = document.createElement('img');
              var width = svg.width() + 'px';
              var height = svg.height() + 'px';

              svg.attr('width', width);
              svg.attr('height', height);
              var styles = svg.attr('style');
              svg.attr('style', '');

              canvg(canvas, svg[0].outerHTML);

              svg.attr('width', '100%');
              svg.attr('height', '100%');
              svg.attr('style', styles);

              img.src = canvas.toDataURL();
              img.style.width = width;
              img.style.height = height;
              return img;
            });
          }


          selectedHtml = target.wrap('div').html();
          if (selectedHtml.indexOf(unknownLoadingStr) !== -1) {
            selectedHtml = selectedHtml.slice(unknownLoadingStr.length);
          }

          var dto = {
            fileName: attrs.fileName,
            content: selectedHtml,
            id: attrs.id,
            orientation: attrs.orientation || 'PORTRAIT'
          };
          $http.post(attrs.convertToPdf, dto).then(function (resp) {
            if (resp.data) {
              url = resp.data.url || 'data:application/pdf;base64,' + resp.data;

              disableElement = angular.element(document).find(attrs.disableSelector);
              if (disableElement.length) {
                disableElement.attr('disabled', null);
                disableElement.removeClass('disabled');
              }
            }
          });
        }
      }
    }
  }]);
})();
