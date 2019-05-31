'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("invoiceModalWindow",
    ['$timeout', 'BillableService', '$location', function ($timeout, BillableService, $location) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          $location.search('modal', 'true');

          var zoomSlider = element.find('.zoom-slider'),
            companyDropdown = element.find('.company-dropdown'),
            icnZoomPlus = element.find('.icn-zoom-plus-invoice'),
            icnZoomMinus = element.find('.icn-zoom-minus-invoice'),
            interval,
            modalWindow = $('.modal-open .modal'),
            modalTransclude = modalWindow.find('[modal-transclude]');

          scope.zoomRange = 1;
          //
          // $('html').css('overflow-y', 'hidden');
          // centering();
          // $('.modal-backdrop.in').css({ background: 'none' });
          //
          // element.find('.nano').nanoScroller();
          //
          // element.find(".dropdown").on('shown.bs.dropdown', function () {
          //   element.find('.nano').nanoScroller();
          // });
          //
          // function centering() {
          //
          //   var wrapperWidth = window.innerWidth,
          //     zoomMargin = parseInt((wrapperWidth - 300) / 2);
          //
          //   zoomSlider.css("margin-left", zoomMargin);
          //   companyDropdown.css("width", zoomMargin);
          // }
          //
          // icnZoomPlus.click(function () {
          //   if (scope.zoomRange < 3) {
          //     scope.zoomRange = +scope.zoomRange + 0.1;
          //   }
          // });
          //
          // icnZoomMinus.click(function () {
          //   if (scope.zoomRange > 1) {
          //     scope.zoomRange = +scope.zoomRange - 0.1;
          //   }
          // });
          //
          // $(window).resize(function () {
          //   centering()
          // });

          if (scope.invoiceLocks) {
            for (var i = 0; i < scope.invoiceLocks.length; i++) {
              processInvoice(scope.invoiceLocks[i].lockId);
              scope.lockInfo[scope.invoiceLocks[i].lockId] = {
                contactId: '',
                addressId: ''
              }
            }
          }

          function processInvoice(lockId) {
            BillableService.getExistTimeByLockId(lockId, function (resp) {

              clearInterval(interval);

              scope.invoiceTimer = resp.time;
              scope.showTimer = true;
              scope.showHeaderButtons = true;
              $timeout(function () {
                scope.showHeader = true;
              }, 1000);

              interval = setInterval(function () {

                if (scope.invoiceTimer <= 0) {

                  for (var i = 0; i < scope.invoiceLocks.length; i++) {
                    scope.invoiceLocks[i].expired = true;
                  }

                }

                scope.invoiceTimer -= 1000;
                scope.$apply();
              }, 1000);

            });
          }

          scope.$on('$destroy', function () {
            $('html').css('overflow-y', 'scroll');
            clearInterval(interval);
            $location.search('modal', null);
          });

          scope.$watch('zoomRange', function () {
            // initHorizontalScroll()
          });

          // $(window).resize(initHorizontalScroll)

          function initHorizontalScroll() {

            var invoiceWindowWidth = element.find('[parent-invoice-page]').width(),
              modalTranscludeWidth = (invoiceWindowWidth * scope.zoomRange) + 60,
              maxModalWithoutScroll = $(window).width() - 15;

            if (maxModalWithoutScroll < modalTranscludeWidth) {

              var scrollLeft = (modalTranscludeWidth - maxModalWithoutScroll) / 2;

              modalWindow.css('overflow-x', 'scroll');
              modalTransclude.width(modalTranscludeWidth);
              modalWindow.scrollLeft(scrollLeft);
            } else {
              modalTransclude.width(maxModalWithoutScroll);
              modalWindow.css('overflow-x', 'hidden');
            }
          }


        }
      }
    }]);
})();
