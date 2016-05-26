'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive('customPopoverMenu',
    ['$timeout', '$templateRequest', '$compile', 'UsersService', 'SubscriptionsService',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.PermissionsService',
      function ($timeout, $templateRequest, $compile, UsersService, SubscriptionsService, UserConfirmationsService, PermissionsService) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {

            var getMenuPosition = function(popover, mouse, direction, scrollDir) {
                var win = $(window)[direction](),
                    scroll = $(window)[scrollDir](),
                    menu = $(popover)[direction](),
                    position = mouse;
                // opening menu would pass the side of the page
                if (mouse + menu > win && menu < mouse)
                    position -= menu;
                return position;
            };
            var hideOtherPopovers = function(){
              element.siblings().popover('hide');
              $(document).off('click', hideThisPopover);
            };

            var hideThisPopover = function(){
              element.popover('hide');
              $(document).off('click', hideThisPopover);
            };

            scope.PermissionsService = PermissionsService;

            $templateRequest(attrs.customPopoverTemplate).then(function(html){
              var template = angular.element(html);

              element.popover({
                trigger: 'manual',
                html: true,
                content: template,
                container: 'body'
              });

              $compile(template)(scope);

              element.bind("contextmenu", function (e) {
                // Return native menu if pressing control
                if (e.ctrlKey) return;

                // Hide already opened
                hideOtherPopovers();

                var customPopover;
                var offset = {left: 0, top: 0};
                // if( typeof(settings.relativeTo) != 'undefined' ) {
                //     offset = $(settings.relativeTo).offset();
                // }

                element.one('inserted.bs.popover', function(){
                  customPopover = $('#'+element.attr('aria-describedby'));
                  customPopover.find('.popover-content').css('padding', 0);
                  customPopover.css({
                    'padding': 0,
                    'margin': 0,
                    // 'margin-top': attrs.customPopoverMenuMarginTop,
                    'width': 190,
                    'visibility': 'hidden'
                  });
                  customPopover.on('click', function(e){
                    e.stopPropagation();
                  })
                });

                element.one('shown.bs.popover', function(){
                  var left = getMenuPosition(customPopover, (e.clientX-offset.left), 'width', 'scrollLeft');
                  var top = getMenuPosition(customPopover, (e.clientY-offset.top), 'height', 'scrollTop');
                  customPopover.css({
                        visibility: 'visible',
                        position: "fixed",
                        left: left,
                        top: top
                    });
                });

                element.popover('show');

                $(document).on('click', hideThisPopover);

                return false;
              });

            });

            scope.sendEmail = function () {
              if (scope.selectedCompanyUsers && Object.keys(scope.selectedCompanyUsers).length !== 0) {

                var usersIds = [];

                for (var userId in scope.selectedCompanyUsers) {
                  if (scope.selectedCompanyUsers[userId]) {
                    usersIds.push(userId)
                  }
                }
                console.log('send email users ' + usersIds);
                hideThisPopover();
                return;
              }
              window.open("mailto:" + scope.user.primaryEmail, '_parent');
              hideThisPopover();
            };

            scope.startChat = function () {
              console.log('start chat ' + scope.user.id);
              hideThisPopover();
            };

            scope.changeUserRole = function (userRole) {
              UsersService.changeUserRole(scope.user.id, userRole);
              hideThisPopover();
            };

            scope.archiveContact = function () {
              var confirmMesage = 'Do you want to archive ',
                confirmButton = 'Yes';

              if (scope.selectedCompanyUsers && Object.keys(scope.selectedCompanyUsers).length !== 0) {

                var usersIds = [];

                for (var userId in scope.selectedCompanyUsers) {
                  if (scope.selectedCompanyUsers[userId]) {
                    usersIds.push(userId)
                  }
                }
                for (var index in scope.companyData.users) {
                  var user = scope.companyData.users[index];
                  confirmMesage += user.firstName + ' ' + user.lastName;
                  confirmMesage += (index < scope.companyData.users.length - 1) ? ', ' : '?';
                }
                UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                  console.log('archive users ' + usersIds);
                });
                hideThisPopover();
                return;
              }
              confirmMesage += scope.user.firstName + ' ' + scope.user.lastName  + '?';
              UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                console.log('archive ' + scope.user.id);
              });
              hideThisPopover();
            };

            scope.subscribeUser = function (userId, nameSubscription) {

              scope.disabledUpdateCheckbox = true;

              var subscription = scope.user.subscription;

              if (subscription) {
                subscription = subscription.staticCopy()
              } else {
                subscription = {
                  user: {id: userId}
                }
              }

              subscription[nameSubscription] = !subscription[nameSubscription];

              SubscriptionsService.saveUserSubscription(subscription, function () {
                scope.disabledUpdateCheckbox = false;
              });
              hideThisPopover();
            };

          }
        }
      }]);
})();
