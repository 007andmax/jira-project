'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("createInvoice", function () {
    return {
      restrict: 'A',
      scope: {
        locks: '=createInvoice',
        showLockId: '='

      },
      link: function ($scope, element, attrs) {

        var invoices = {};

        $scope.$watch('showLockId', showInvoice);

        for (var i = 0; i < $scope.locks.length; i++) {
          var lockId = $scope.locks[i].id;

          processInvoice(lockId);

        }

        function processInvoice(lockId) {
          PDFJS.getDocument('/invoice/showInvoiceByLock/' + lockId).then(function (pdf) {

            invoices[lockId] = {
              pagesCount: pdf.numPages,
              loadedPagesCount: 0,
              pages: []
            };

            for (var i = 1; i <= pdf.numPages; i++) {
              processPage(lockId, i, pdf);
            }

          });
        }

        function processPage(lockId, pageNumber, pdf) {

          pdf.getPage(pageNumber).then(function (page) {

            invoices[lockId].loadedPagesCount++;
            invoices[lockId].pages[pageNumber - 1] = page;

            if (invoices[lockId].loadedPagesCount === invoices[lockId].pagesCount && $scope.showLockId === lockId) {
              showInvoice(lockId);
            }

            if (pageNumber === 1) {

              var viewport = page.getViewport(0.5);
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
          $scope.shownInvoiceInfo = invoices[lockId];

          if ($scope.shownInvoiceInfo &&
            $scope.shownInvoiceInfo.loadedPagesCount === $scope.shownInvoiceInfo.pagesCount) {

            var pages = [];

            for (var i = 0; i < $scope.shownInvoiceInfo.pages.length; i++) {
              var page = $scope.shownInvoiceInfo.pages[i],
                div = $('<div class="invoice-page-container">'),
                viewport = page.getViewport(1),
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

              canvas.height = viewport.height;
              canvas.width = viewport.width;

              page.render({
                canvasContext: ctx,
                viewport: viewport
              });

              div.appendChild(canvas);

              pages.push(div);
            }

            element.find('[invoice-container]').appendChild(pages);
          }
        }
      }
    }
  });
})();
