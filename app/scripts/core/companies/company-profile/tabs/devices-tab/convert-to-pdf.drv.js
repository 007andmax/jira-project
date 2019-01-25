'use strict';

(function () {
  angular.module("quicktech.core.companies").directive('convertToPdf',
    ['$http', '$timeout', 'Downloader', 'quicktech.common.services.UserNotificationService', '$rootScope',
    function ($http, $timeout, Downloader, UserNotificationService, $rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var disableElement, selectedHtml;
        disableOpenPdfBtn();
        var savedFileName = '';

        attrs.$observe('fileName', function (fileName) {
          if (fileName) {
            savedFileName = fileName;
            scope.$on('buildPdf-' + fileName, getPdfIdFromRest);
          }
        });

        $rootScope.$watch('reportLineChanged', function(resp) {
          if(resp === true) {
            getPdfIdFromRest();
          }
          $rootScope.reportLineChanged = false;
        });


        scope.openInPdf = function (callback) {
          if (!disableElement.length || (disableElement.hasClass('disabled') || typeof disableElement.attr('disabled') === 'string')) {
            return;
          }
          var newWindow = window.open($rootScope.reportUrl);
          callback && callback(newWindow);
        };

        scope.downloadAsPdf = function (callback) {
          if (!disableElement.length || (disableElement.hasClass('disabled') || typeof disableElement.attr('disabled') === 'string')) {
            return;
          }

          Downloader.downloadByUrl($rootScope.reportUrl + '?isDownload=true', attrs.fileName);
        };

        scope.sendToMail = function (emails, callback) {
          if (!Array.isArray(emails) && typeof emails === 'object') {
            var note = emails.note;
            var emails = emails.emails;
          }

          var isBrokenReport = attrs.fileName.includes('customer-report') || attrs.fileName.includes('commissions-report');
          var emailEndpoint = isBrokenReport ? '/customerReport/email' : attrs.emailEndpoint


          if (emails && emails.length) {
            var dto = {
              content: selectedHtml,
              emails: emails,
              fileName: attrs.fileName,
              orientation: attrs.orientation || 'PORTRAIT'
            };

            if (note) {
              dto.note = note;
            }
            $http.post(emailEndpoint, dto).then(function () {
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

          var source = $(attrs.selector);
          var target = source.clone(),
            unknownLoadingStr = 'Loading...',
            sourceSVGs = source.find('svg'),
            canvas = document.createElement('canvas');

          target.find('.ng-hide').remove();
          target.find('.hide-in-report').remove();

          if (!$rootScope.isPurchaseShown) {
            target.find('.purchase-cost').remove();
          }

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


          //selectedHtml = target.wrap('div').parent().html();
          selectedHtml = target.wrap('div').html();
          if (selectedHtml.indexOf(unknownLoadingStr) !== -1) {
            selectedHtml = selectedHtml.slice(unknownLoadingStr.length);
          }


          var dto = {
            fileName: $rootScope.reportName,
            content: selectedHtml,
            id: attrs.id,
            orientation: attrs.orientation || 'PORTRAIT'
          };
          $http.post(attrs.convertToPdf, dto).then(function (resp) {
            if (resp.data) {
              $rootScope.reportUrl = resp.data.url || 'data:application/pdf;base64,' + resp.data;
              //scope.$apply();

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
