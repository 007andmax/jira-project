'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive("contactPopover",
    ['$timeout', '$rootScope',
      function ($timeout, $rootScope) {
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
              contactDesignation = scope.contactDesignation,
              phoneTemplateHtml = "";

            for (var i = 0; i < scope.contactNumber.length; i++) {

              if(scope.contactNumber[i].typeNumber === 'MOBILE'){
                phoneTemplateHtml += "<div class='user-no'><span class='icon icn-iphone pull-left'></span> " + scope.contactNumber[i].number + "</div>";

              } else if (scope.contactNumber[i].typeNumber === 'FAX') {
                phoneTemplateHtml += "<div class='user-no'>" +
                  "<span class='icon icn-fax-machine pull-left' style='margin-top: 2px;margin-right: 10px'></span> " + scope.contactNumber[i].number +
                  "</div>";

              } else {
                phoneTemplateHtml += "<div class='user-no'>" +
                  "<span class='icon icn-telephone pull-left' style='margin-top: 2px;margin-right: 10px'></span> " + scope.contactNumber[i].number +
                  "</div>";

              }
            }

            var popoverHtml =
              "   <a href='javascript:void(0)' class='pull-right icn-email'></a>" +
              "   <div class='tooltip fade top in' role='tooltip' style='top: -15px; left: 220px;'>" +
              "     <div class='tooltip-arrow' style='left: 50%;'></div><div class='tooltip-inner'>send email</div>" +
              "   </div>" +
              "   <h3>" + contactName + "</h3>" +
              "   <div class='label label-white label-ticket-number'>" + contactDesignation + "</div>" +
              "   <div class='user-email'>" +
              "     <span class='icon icn-at-the-rate pull-left' ></span>" + contactEmail +
              "   </div>" + phoneTemplateHtml;

            $rootScope.insidePopover = false;

            element.popover({
              content: popoverHtml,
              placement: 'left',
              container: 'body',
              html: true,
              animation: false
            });

            element.on('shown.bs.popover', function () {

              var bodyPopover = $('.popover'),
                tooltip = $('.popover .tooltip'),
                icnEmail = $('.popover .icn-email'),
                arrow = $('.popover .arrow');

              tooltip.hide();

              bodyPopover.addClass('popover-userinfo');
              bodyPopover.css('padding-top', '0px');
              bodyPopover.css('left', '1248px');

              arrow.css('display', 'none');
              icnEmail.on('click', scope.sendEmailInPopover);

              icnEmail.on('mouseenter', function () {
                tooltip.show()
              });
              icnEmail.on('mouseleave', function () {
                tooltip.hide()
              })

            });

            element.bind('mouseenter', function () {
              $timeout(function () {
                if (!$rootScope.insidePopover) {
                  element.popover('show');
                  scope.attachEvents(element);
                }
              }, 50);
            });

            element.bind('mouseleave', function () {
              $timeout(function () {
                if (!$rootScope.insidePopover)
                  element.popover('hide');
              }, 50);
            });

            scope.attachEvents = function (element) {

              var popovaeBody = $('.popover');

              popovaeBody.on('mouseenter', function () {
                $rootScope.insidePopover = true;
              });
              popovaeBody.on('mouseleave', function () {
                $rootScope.insidePopover = false;
                element.popover('hide');
              });
            };

          }
        };

      }]);
})();
