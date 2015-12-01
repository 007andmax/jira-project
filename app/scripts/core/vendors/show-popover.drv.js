'use strict';

(function () {

  angular.module("quicktech.core.vendors").directive("showPopover",
    ['$compile', '$templateCache', '$timeout', '$rootScope',
      function ($compile, $templateCache, $timeout, $rootScope) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {

            var paymentTerms = scope.vendor.paymentTerms,
              accountNumber = scope.vendor.accountNumber,
              website = scope.vendor.website,
              description = scope.vendor.description,
              isFirstShowing = true;

          $rootScope.insidePopover = false;
            $(element).popover({
              content: description,
              title: "<div class='account-info'> " +
              "<div><span>Payment Terms</span>Net " + paymentTerms + "</div> " +
              "<div><span>Account No.</span>" + accountNumber + "</div>" +
              "</div>" +
              "<div class='url'> " +
              "<a href='javascript:void(0)'> " +
              "<i class='icn-sm icn-url'></i> " + website +
              "</a> " +
              "</div>",
              container: 'body',
              placement: 'bottom',
              html: true
            });

            element.on('show.bs.popover', function(){

              $timeout(function(){
                var popover = $('.popover');
                popover.addClass('vendor-popover');

                if(isFirstShowing){
                  var leftPosition = parseInt(popover.css('left'));
                  popover.css({'left': leftPosition + 20 + 'px'});
                  isFirstShowing = false;
                }
              }, 0);
            });

            element.on('hidden.bs.popover', function(){
              var popover = $('.popover');
              popover.removeClass('vendor-popover');
            });

            element.bind('mouseenter', function (e) {
              $timeout(function () {
                if (!$rootScope.insidePopover) {
                  $(element).popover('show');
                  scope.attachEvents(element);
                }
              }, 50);
            });
            element.bind('mouseleave', function (e) {
              $timeout(function () {
                if (!$rootScope.insidePopover)
                  $(element).popover('hide');
              }, 50);
            });

          }
        };

      }]);
})();
