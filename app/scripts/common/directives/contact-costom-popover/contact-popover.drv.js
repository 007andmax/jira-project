'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("contactPopover",
    ['$compile', '$templateCache', '$timeout', '$rootScope',
      function ($compile, $templateCache, $timeout, $rootScope) {
        return {
          restrict: 'A',
          scope: {
            contactName: "=contactName",
            contactNumber: "=contactNumber",
            contactEmail: "=contactEmail",
            contactDesignation: "=contactDesignation",
            sendEmailInPopover: "=sendEmailInPopover"
          },
          link: function (scope, element) {

            var contactName = scope.contactName,
              contactEmail = scope.contactEmail,
              contactDesignation = scope.contactDesignation;

            for (var i = 0; i < scope.contactNumber.length; i++) {
              if (scope.contactNumber[i].typeNumber === 'MOBILE') {
                var contactMobileNumber = scope.contactNumber[i].number;
              }
            }

            var popoverHtml =
              "   <a href='javascript:void(0)' class='pull-right icn-email' tooltip='send email' tooltip-placement='top'></a>" +
              "   <h3>" + contactName + "</h3>" +
              "   <div class='label label-white label-ticket-number'>" + contactDesignation + "</div>" +
              "   <div class='user-email'>" +
              "     <span class='icon icn-at-the-rate pull-left' ></span>" + contactEmail +
              "   </div>" +
              "   <div class='user-no'>" +
              "     <span class='icon icn-iphone pull-left'></span>" + contactMobileNumber +
              "   </div>";

            $rootScope.insidePopover = false;

            $(element).popover({
              content: popoverHtml,
              placement: 'left',
              container: 'body',
              html: true,
              animation: false
            });

            $(element).on('shown.bs.popover', function () {

              var bodyPopover = $('.popover');

              bodyPopover.addClass('popover-userinfo');
              bodyPopover.css('padding-top', '0px');
              bodyPopover.css('left', '1248px');

              $('.popover .arrow').css('display', 'none');
              $('.popover .icn-email').on('click', scope.sendEmailInPopover);

            });

            $(element).bind('mouseenter', function () {
              $timeout(function () {
                if (!$rootScope.insidePopover) {
                  $(element).popover('show');
                  scope.attachEvents(element);
                }
              }, 50);
            });

            $(element).bind('mouseleave', function () {
              $timeout(function () {
                if (!$rootScope.insidePopover)
                  $(element).popover('hide');
              }, 50);
            });

            scope.attachEvents = function (element) {

              var popovaeBody = $('.popover');

              popovaeBody.on('mouseenter', function () {
                $rootScope.insidePopover = true;
              });
              popovaeBody.on('mouseleave', function () {
                $rootScope.insidePopover = false;
                $(element).popover('hide');
              });
            };

          }
        };

      }]);
})();
