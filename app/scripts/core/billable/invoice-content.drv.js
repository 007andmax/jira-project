'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("invoiceContent",
    ['$timeout', '$http', '$compile', '$templateCache',
      function ($timeout, $http, $compile, $templateCache) {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, element, attrs, ngModelCtrl) {

            var invoiceTemplate,
              invoiceModalWindow = $('.modal-open .modal');

            scope.currentTime = +(new Date());

            scope.$watch(function () {

              var invoiceDto = ngModelCtrl.$viewValue;

              if (invoiceDto && invoiceDto.company && invoiceDto.company.id) {
                return invoiceDto.company.id;
              }

            }, function () {

              if (ngModelCtrl.$viewValue) {
                element.animate({ right: "15px" });

                scope.currentInvoice = ngModelCtrl.$viewValue;

                if (scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].contactId) {

                  var currentBillToId = scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].contactId;

                  for (var i = 0; i < scope.currentInvoice.billTo.length; i++) {
                    if (currentBillToId === scope.currentInvoice.billTo[i].id) {
                      scope.currentBillTo = scope.currentInvoice.billTo[i];
                    }
                  }
                } else {

                  for (var i = 0; i < scope.currentInvoice.billTo.length; i++) {
                    if (scope.currentInvoice.billTo[i].isPrimary) {
                      scope.currentBillTo = scope.currentInvoice.billTo[i];
                      scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].contactId = scope.currentBillTo.id;
                    }
                  }

                }

                if (scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].addressId) {

                  var currentAddressId = scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].addressId;

                  for (var i = 0; i < scope.currentInvoice.shipTo.length; i++) {
                    if (currentAddressId === scope.currentInvoice.shipTo[i].id) {
                      scope.currentShipTo = scope.currentInvoice.shipTo[i];
                      break;
                    }
                  }

                } else {
                  for (var i = 0; i < scope.currentInvoice.shipTo.length; i++) {
                    if (scope.currentInvoice.shipTo[i].isPrimary) {
                      scope.currentShipTo = scope.currentInvoice.shipTo[i];
                      scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].addressId = scope.currentShipTo.id;
                    }
                  }
                }
              }

              $http.get('/html/scripts/core/billable/invoice-modal.tpl.html', { cache: $templateCache })
                .then(function (response) {

                  invoiceTemplate = angular.copy(response);

                  compileInvoice();

                });

            });

            function initNanoScroller(compileElement) {
              var nanoElement = $('.nano', compileElement),
                dropdownElement = $('.dropdown', compileElement);

              nanoElement.nanoScroller();

              dropdownElement.on('shown.bs.dropdown', function () {
                nanoElement.nanoScroller();
              });
            }

            function splitPage() {

              invoiceModalWindow.scrollTop(0);

              var pages = [''];
              var occupiedHeight = 0;
              var pageHeight = 1020;
              var currentPage = 0;

              element.find('div.invoice-page > div').each(function () {

                var sectionHeight = $(this).outerHeight();

                if ((sectionHeight + occupiedHeight) > (pageHeight - 50)) {
                  currentPage++;
                  pages.push('');
                  occupiedHeight = 0;
                } else {
                  occupiedHeight += sectionHeight;
                }

                pages[currentPage] += $(this)[0].outerHTML;
              });

              var invContainer = element.find('[parent-invoice-page]');

              invContainer.html('<div class="invoice-page inner-wrapper clearfix">' + pages.join('</div><div class="invoice-page inner-wrapper clearfix">') + '</div>');

              initScrollListner(pages.length);
              invoiceModalWindow.trigger("scroll")
              element.animate({ opacity: 1 });

            }

            function initScrollListner(pagesLength) {

              var timeout = null;
              var page = 0;

              invoiceModalWindow.on('scroll', function () {

                var windowHeight = $(window).height();

                var scrollTop = $(window).scrollTop() + (windowHeight / 2);
                var invoiceTop = element.find('div.invoice-page > div').offset().top;

                var newPage = parseInt((scrollTop - invoiceTop) / (1120 * scope.zoomRange)) + 1;

                newPage = newPage > pagesLength ? pagesLength : newPage;

                $('.paging').css("opacity", "1");
                timeout && clearTimeout(timeout);
                timeout = setTimeout(function () {
                  $('.paging').css("opacity", "0")
                }, 2000);

                if (page != newPage) {
                  $('.tooltip-inner').html(newPage + ' of ' + pagesLength);
                  page = newPage;
                }

              });

            }

            function initDropdown() {

              element.find('[data-billTo-id]').click(function () {
                var contact = JSON.parse(this.getAttribute("data-billTo-id"));
                scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].contactId = contact.id;
                scope.currentBillTo = contact;

                compileInvoice();

              });

              element.find('[data-shipTo-id]').click(function () {
                var address = JSON.parse(this.getAttribute("data-shipTo-id"));
                scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].addressId = address.id;
                scope.currentShipTo = address;

                compileInvoice();

              });

            }

            function compileInvoice() {
              ($compile(invoiceTemplate.data)(scope, function (compileElement, scope) {
                $timeout(function () {

                  element.html(compileElement);

                  splitPage();
                  initNanoScroller(compileElement);
                  initDropdown()

                })
              }));
            }

          }
        }
      }]);
})();
