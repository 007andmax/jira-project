'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("invoiceModalWindow",
    ['$timeout', 'BillableService', function ($timeout, BillableService) {
      return {
        restrict: 'A',
        link: function (scope, element) {

          var zoomSlider = element.find('.zoom-slider'),
            companyDropdown = element.find('.company-dropdown'),
            iframeElement = element.find('[iframe-window]'),
            icnZoomPlus = element.find('.icn-zoom-plus'),
            icnZoomMinus = element.find('.icn-zoom-minus'),
            interval,
            contactIdInput,
            addressIdInput;

          scope.zoomRange = 1;

          $('html').css('overflow-y', 'hidden');
          centering();

          function centering() {

            var wrapperWidth = window.innerWidth,
              zoomMargin = parseInt((wrapperWidth - 300) / 2);

            zoomSlider.css("margin-left", zoomMargin);
            companyDropdown.css("width", zoomMargin);
          }

          icnZoomPlus.click(function(){
            if(scope.zoomRange < 2){
              scope.zoomRange += 0.1;
            }
          });

          icnZoomMinus.click(function(){
            if(scope.zoomRange > 0.5){
              scope.zoomRange -= 0.1;
            }
          });

          $(window).resize(function () {
            centering()
          });

          for (var i = 0; i < scope.invoiceLocks.length; i++) {
            processInvoice(scope.invoiceLocks[i].lockId);
            scope.lockInfo[scope.invoiceLocks[i].lockId] = {
              contactId: '',
              addressId: ''
            }
          }

          function processInvoice(lockId){
            BillableService.getExistTimeByLockId(lockId, function (resp) {

              clearInterval(interval);

              scope.invoiceTimer = resp.time;
              scope.showTimer = true;

              interval = setInterval(function(){

                if(scope.invoiceTimer <= 0){
                  $scope.showLock.expired = true;
                }

                scope.invoiceTimer -= 1000;
                scope.$apply();
              }, 1000);

            });
          }

          iframeElement.on('load', function(){
            element.height(iframeElement[0].contentWindow.document.body.scrollHeight);

            $timeout(function(){

              contactIdInput = $('.billed > #contact-id', iframeElement.contents());
              addressIdInput = $('.shipto > #address-id', iframeElement.contents());

              var contactsInDropdown = $('[data-contact-id]', iframeElement.contents());
              var addressesInDropdown = $('[data-address-id]', iframeElement.contents());

              scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].contactId = contactIdInput.val();
              scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].addressId = addressIdInput.val();

              contactsInDropdown.click(function(){
                scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].contactId = this.getAttribute("data-contact-id");
              });

              addressesInDropdown.click(function(){
                scope.lockInfo[scope.invoiceLocks[scope.showInvoiceLockIndex].lockId].addressId = this.getAttribute("data-address-id");
              });

            });

          });

          scope.$on('$destroy', function() {
            $('html').css('overflow-y', 'scroll');
            clearInterval(interval);
          });

        }
      }
    }]);
})();
