'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("invoiceModalWindow",
    ['$timeout', 'BillableService', function ($timeout, BillableService) {
      return {
        restrict: 'A',
        link: function (scope, element) {

          var zoomSlider = element.find('.zoom-slider'),
            companyDropdown = element.find('.company-dropdown'),
            icnZoomPlus = element.find('.icn-zoom-plus'),
            icnZoomMinus = element.find('.icn-zoom-minus'),
            interval;

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
            if(scope.zoomRange < 3){
              scope.zoomRange += 0.1;
            }
          });

          icnZoomMinus.click(function(){
            if(scope.zoomRange > 1){
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

                  for(var i = 0; i < scope.invoiceLocks.length; i++){
                    scope.invoiceLocks[i].expired = true;
                  }

                }

                scope.invoiceTimer -= 1000;
                scope.$apply();
              }, 1000);

            });
          }

          scope.$on('$destroy', function() {
            $('html').css('overflow-y', 'scroll');
            clearInterval(interval);
          });

        }
      }
    }]);
})();
