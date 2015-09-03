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
              description = scope.vendor.description;

            $rootScope.insidePopover = false;
            $(element).popover({
              content: "<div><div class='vendors-popover '> <p><span class='blue bold'>Payment Terms</span> " +
              "<span>Net " + paymentTerms + "</span></p> " +
              "<p><span class='blue bold'>Account No.</span> <span>" + accountNumber + "</span></p> " +
              "<div class='location'><span class='icn url-globe'></span> " +
              "<a href='#'>" + website + "</a></div></div>" + description + "</div>",
              placement: 'bottom',
              html: true
            });
            $(element).bind('mouseenter', function (e) {
              $timeout(function () {
                if (!$rootScope.insidePopover) {
                  $(element).popover('show');
                  scope.attachEvents(element);
                }
              }, 50);
            });
            $(element).bind('mouseleave', function (e) {
              $timeout(function () {
                if (!$rootScope.insidePopover)
                  $(element).popover('hide');
              }, 50);
            });

          }
        };

      }]);
})();
