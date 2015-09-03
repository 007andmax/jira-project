'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("createInvoice",
    ['BillableService', function (BillableService) {
      return {
        restrict: 'A',
        scope: {
          locks: '=createInvoice',
          showLock: '=',
          invoiceScale: '='
        },
        link: function ($scope, element, attrs) {

          var notificationsBox = element.find('[notifications-box]'),
            modalWindow = $('#create-invoice-modal-window'),
            pageNumberBox = element.find('[page-number-box]'),
            ivoicePrintButton = element.find('[ivoice-print-button]'),
            invoiceContainer = element.find('[invoice-container]'),
            expireNotificationsBox = element.find('[expire-notifications-box]'),
            invoices = {},
            invoiceSizeLimiter = 40,
            showingPagesTimeout,
            changeScaleTimeout,
            expireTimerTimeout;

          expireNotificationsBox.hide();
          $scope.invoiceScale = 50;

          $scope.$watch('showLock.id', showInvoice);

          $scope.$watch('invoiceScale', function (scale) {

            if (!$scope.showLock || !$scope.showLock.id) {
              return;
            }

            if (changeScaleTimeout && scale % 10) {
              clearTimeout(changeScaleTimeout);
            }

            changeScaleTimeout = setTimeout(function () {
              showInvoice($scope.showLock.id);
              changeScaleTimeout = undefined;
            }, 300);
          });

          $scope.$on('$destroy', function () {
            clearTimeout(expireTimerTimeout);
            clearTimeout(changeScaleTimeout);
            clearTimeout(showingPagesTimeout);
            removeIframes();
          });

          for (var i = 0; i < $scope.locks.length; i++) {
            processInvoice($scope.locks[i].id);
          }

          modalWindow.on('scroll', function (e) {
            var position = modalWindow.scrollTop(),
              pageHeight = element.find('.invoice-page-container').height(),
              shownPage = Math.max(1, Math.ceil(position / pageHeight));

            pageNumberBox.text(shownPage + ' of ' + invoices[$scope.showLock.id].pagesCount);
            pageNumberBox.show();

            if (showingPagesTimeout) {
              clearTimeout(showingPagesTimeout);
            }

            showingPagesTimeout = setTimeout(function () {
              pageNumberBox.fadeOut();
              showingPagesTimeout = undefined;
            }, 2000);

          });

          ivoicePrintButton.on('click', function () {
            var body = $('body'),
              iframe = $('<iframe class="print-invoice-iframe">');

            removeIframes();

            ivoicePrintButton.hide();
            notificationsBox.text('Preparing invoice to print');
            notificationsBox.show();

            iframe.attr('src', '/invoice/showInvoiceByLock/' + $scope.showLock.id);
            iframe.attr('name', $scope.showLock.id);

            iframe.on('load', function () {
              window.frames[$scope.showLock.id].print();
              ivoicePrintButton.show();
              notificationsBox.hide();
            });

            body.append(iframe);
          });

          function removeIframes() {
            $('.print-invoice-iframe').remove();
          }

          function processInvoice(lockId) {
            PDFJS.getDocument('/invoice/showInvoiceByLock/' + lockId).then(function (pdf) {

              invoices[lockId] = {
                pagesCount: pdf.numPages,
                loadedPagesCount: 0,
                viewports: [],
                pages: []
              };

              for (var i = 1; i <= pdf.numPages; i++) {
                processPage(lockId, i, pdf);
              }

            });
          }

          function processPage(lockId, pageNumber, pdf) {

            pdf.getPage(pageNumber).then(function (page) {

              var viewport = page.getViewport(0.5);

              invoices[lockId].loadedPagesCount++;
              invoices[lockId].pages[pageNumber - 1] = page;
              invoices[lockId].viewports[pageNumber - 1] = viewport;

              if (invoices[lockId].loadedPagesCount === invoices[lockId].pagesCount && $scope.showLock.id === lockId) {
                showInvoice(lockId);
              }

              if (pageNumber === 1) {

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                var renderContext = {
                  canvasContext: ctx,
                  viewport: viewport
                };

                page.render(renderContext).then(function () {

                  var img_src = canvas.toDataURL();
                  var $img = $("<img style='width: 100%; height: 100%'>").attr("src", img_src);

                  $img.appendTo('#invoice-thumb-' + lockId).click();
                  canvas.remove();
                });

              }
            })
          }

          function showInvoice(lockId) {

            invoiceContainer.empty();

            if (!invoices[lockId]) {
              return;
            }

            if (invoices[lockId].loadedPagesCount === invoices[lockId].pagesCount) {

              notificationsBox.hide();

              BillableService.getExistTimeByLockId(lockId, function (resp) {
                clearTimeout(expireTimerTimeout);
                $scope.showLock.expireTime = Date.now() + resp.time;
                refreshInvoiceTimer();
              });

              var pages = [];

              for (var i = 0; i < invoices[lockId].viewports.length; i++) {
                var viewport = invoices[lockId].viewports[i],
                  page = invoices[lockId].pages[i],
                  div = $('<div class="invoice-page-container">'),
                  canvas = document.createElement('canvas'),
                  ctx = canvas.getContext('2d');

                viewport = viewport.clone({
                  scale: 1 + ($scope.invoiceScale - invoiceSizeLimiter) / 100
                });

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                page.render({
                  canvasContext: ctx,
                  viewport: viewport
                });

                div.append(canvas);

                pages.push(div);
              }

              invoiceContainer.append(pages);

            } else {

              notificationsBox.text('Loading invoice - ' + invoices[lockId].loadedPagesCount + ' of '
                + invoices[lockId].pagesCount + ' pages already loaded');

              notificationsBox.show();
            }
          }

          function refreshInvoiceTimer() {

            var time = $scope.showLock.expireTime - Date.now(),
              message;

            if (time <= 0) {
              $scope.showLock.expired = true;
              message = 'Invoice has been expired and it cannot be saved';
            } else {

              var timeInSeconds = time / 1000,
                minutes = Math.floor(timeInSeconds / 60),
                seconds = Math.round(timeInSeconds - (minutes * 60));

              message = 'Invoice expires in ';

              if (minutes === 1) {
                message += '1 minute ';
              } else if (minutes > 1) {
                message += minutes + ' minutes ';
              }

              if (seconds === 1) {
                message += '1 second';
              } else if (seconds > 1) {
                message += seconds + ' seconds ';
              }

              expireTimerTimeout = setTimeout(function () {
                refreshInvoiceTimer(time - 1000);
              }, 1000);
            }

            expireNotificationsBox.show();
            expireNotificationsBox.text(message);
          }
        }
      }
    }]);
})();
