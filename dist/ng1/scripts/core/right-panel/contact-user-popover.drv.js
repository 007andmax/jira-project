'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive("contactUserPopover",
    ['$timeout', '$rootScope',
      function ($timeout, $rootScope) {
        return {
          restrict: 'A',
          scope: {
            userInfo: "=userInfo",
            sendEmailInPopover: "=sendEmailInPopover",
            customUserPopoverTrigger: "=customUserPopoverTrigger",
            selectedCompanyUsers: "=selectedCompanyUsers"
          },
          link: function (scope, element) {

            if (scope.userInfo === undefined) {
              return;
            }

            scope.$watch('userInfo', renderingPopover, true);

            function renderingPopover() {

              var icnEmail,
                contactName = $rootScope.getUserName(scope.userInfo),
                contactEmail = scope.userInfo.primaryEmail ? scope.userInfo.primaryEmail : scope.userInfo.email,
                contactDesignation = scope.userInfo.designation,
                phoneTemplateHtml = "",
                icnSubscription = '',
                countPriority = -1,
                subsTooltipText,
                userSubscription = scope.userInfo.subscription;

              if (userSubscription && userSubscription.ticket && userSubscription.invoice) {
                icnSubscription = 'badge-invoice-and-ticket-updates badge-updates';
                subsTooltipText = 'subscriber invoice and ticket updates';
              } else if (userSubscription && userSubscription.ticket && !userSubscription.invoice) {
                icnSubscription = 'badge-ticket-updates badge-updates';
                subsTooltipText = 'subscriber ticket updates';
              } else if (userSubscription && !userSubscription.ticket && userSubscription.invoice) {
                icnSubscription = 'badge-invoice-updates badge-updates';
                subsTooltipText = 'subscriber invoice updates';
              }

              for (var i = 0; i < scope.userInfo.phoneNumbers.length; i++) {

                if ((countPriority === -1) || (countPriority < scope.userInfo.phoneNumbers[i].priority)) {

                  countPriority = scope.userInfo.phoneNumbers[i].priority;

                  if (scope.userInfo.phoneNumbers[i].typeNumber === 'MOBILE') {
                    phoneTemplateHtml = '<div class="user-no"> <i class="icon-sm icn-iphone pull-left"></i>' + scope.userInfo.phoneNumbers[i].number + '</div>';

                  } else if (scope.userInfo.phoneNumbers[i].typeNumber === 'FAX') {
                    phoneTemplateHtml = '<div class="user-no"> <i class="icn-sm icn-user-fax pull-left"></i>' + scope.userInfo.phoneNumbers[i].number + '</div>';

                  } else {
                    phoneTemplateHtml = '<div class="user-no"> <i class="icon-sm icn-user-phone pull-left"></i>' + scope.userInfo.phoneNumbers[i].number + '</div>';
                  }
                }

              }

              var user_popover_template = '<div class="popover popover-userinfo" role="tooltip">\
              <div class="clearfix">\
                <div class="btn btn-primary pull-right">\
                \
                  <div class="tooltip fade top in send-email-tooltip" role="tooltip" style="top: -25px;left: -9px;">\
                    <div class="tooltip-arrow"></div><div class="tooltip-inner">email</div>\
                  </div>\
                  \
                <i class="icn-sm icn-email-white"></i></div>\
                \
                <div class="tooltip fade top in subscription-tooltip" role="tooltip" style="top: 5px;">\
                  <div class="tooltip-arrow"></div><div class="tooltip-inner">' + subsTooltipText + '</div>\
                </div>\
                \
                <h3 class="popover-title pull-left"></h3>\
                <i style="margin-left:9px;margin-top:2px;" class="pull-left icn-sm persistent-tooltip ' + icnSubscription + ' " data-placement="top"></i>\
              </div>\
              ' + (contactDesignation ? '<div class="label" style="height:20px">' + contactDesignation + '</div>' : '<div style="height:20px"></div>') +
              '<div class="popover-content"></div>\
            </div>';

              var user_popover_content = '<div class="user-email">' +
                ((contactEmail && contactEmail.length > 0) ? '<i class="icn-sm icn-at pull-left"></i> ' + contactEmail : '') + '</div>' + phoneTemplateHtml;

              initPopover();

              element.bind('mouseenter', function () {
                $timeout(function () {
                  if (!$rootScope.insidePopover) {
                    for (var prop in scope.selectedCompanyUsers) if (scope.selectedCompanyUsers[prop] === true) return;

                    element.popover('show');
                    scope.attachEvents(element);

                    $(document).on('click', hideThisPopover);
                  }
                }, 50);
              });

              element.bind('mouseleave', function () {
                $timeout(function () {
                  if (!$rootScope.insidePopover) {
                    for (var prop in scope.selectedCompanyUsers) if (scope.selectedCompanyUsers[prop] === true) return;

                    $(document).off('click', hideThisPopover);
                    element.popover('hide');
                    //icnEmail.off('click');
                  }
                }, 50);
              });

              scope.attachEvents = function (element) {

                var popovaeBody = $('.popover');

                popovaeBody.on('mouseenter', function () {
                  $rootScope.insidePopover = true;
                });
                popovaeBody.on('mouseleave', function () {
                  $timeout(function () {
                    $rootScope.insidePopover = false;
                    element.popover('hide');
                    //icnEmail.off('click');
                  }, 50);
                });
              };

              scope.$watch('customUserPopoverTrigger', function () {

                if (scope.customUserPopoverTrigger === undefined) {
                  return;
                }

                if (scope.customUserPopoverTrigger) {
                  element.popover('destroy');
                } else {
                  initPopover();
                }
              });

              function initPopover() {

                element.popover('destroy');

                element.popover({
                  content: user_popover_content,
                  template: user_popover_template,
                  title: contactName,
                  html: true,
                  placement: 'left',
                  container: 'body',
                  animation: false
                });

                element.on('shown.bs.popover', function () {

                  var emailTooltip = $('.popover .send-email-tooltip'),
                    subsTooltip = $('.popover .subscription-tooltip'),
                    icnSubs = $('.popover .badge-updates');

                  icnEmail = $('.popover .btn-primary');

                  if (!(scope.userInfo.primaryEmail && scope.userInfo.primaryEmail.length > 0)) {
                    icnEmail.addClass('disabled');
                  }

                  emailTooltip.hide();
                  subsTooltip.hide();

                  icnEmail.on('click', function () {
                    scope.sendEmailInPopover(scope.userInfo.id);
                  });

                  icnEmail.on('mouseenter', function () {
                    emailTooltip.show()
                  });
                  icnEmail.on('mouseleave', function () {
                    emailTooltip.hide()
                  });

                  icnSubs.on('mouseenter', function () {
                    subsTooltip.show()
                  });
                  icnSubs.on('mouseleave', function () {
                    subsTooltip.hide()
                  })

                });

              }

              function hideThisPopover() {
                element.popover('hide');
                $rootScope.insidePopover = false;
              }

            }

          }
        };

      }]);
})();
