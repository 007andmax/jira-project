'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive('customPopoverMenu',
    ['$timeout', '$templateRequest', '$compile', 'UsersService', 'SubscriptionsService',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.PermissionsService',
      'quicktech.common.services.UserNotificationService',
      function ($timeout, $templateRequest, $compile, UsersService, SubscriptionsService, UserConfirmationsService,
                PermissionsService, UserNotificationService) {
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
                placement: 'left',
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



                element.popover('show');

                $(document).on('click', hideThisPopover);

                return false;
              });

            });

            scope.isLastUserWithInvoiceSubscription = function (targetUser) {
              var users = UsersService.getAllByCompanyId(targetUser.company.id);

              for (var id in users) {
                var user = users[id];
                if (user.id === targetUser.id) {
                  continue;
                }

                if (user.subscription && user.subscription.invoice) {
                  return false;
                }
              }
              return true;
            };

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

              if (scope.selectedUsers && Object.keys(scope.selectedUsers).length !== 0) {

                var usersIds = [];

                for (var userId in scope.selectedUsers) {
                  if (scope.selectedUsers[userId]) {
                    usersIds.push(userId)
                  }
                }
                for (var i = 0; i < usersIds.length; i++) {
                  var user = UsersService.getOneById(usersIds[i]);
                  confirmMesage += user.firstName + ' ' + user.lastName;
                  confirmMesage += (i < usersIds.length - 1) ? ', ' : '?';
                }
                UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                  try {
                    UsersService.archiveUser(usersIds, function () {
                      UserNotificationService.show('Selected users were successfully archived');
                      for (var i = 0; i < usersIds.length; i++) {
                        var id = usersIds[i];
                        delete scope.selectedUsers[id];
                      }
                    });
                  } catch(err) {
                    confirmButton = 'Ok';
                    UserConfirmationsService.show(err, confirmButton, true);
                  }
                });
                hideThisPopover();
                return;
              }
              confirmMesage += scope.user.firstName + ' ' + scope.user.lastName  + '?';
              UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                try {
                  UsersService.archiveUser(scope.user.id, function () {
                    UserNotificationService.show('User was successfully archived');
                  });
                } catch(err) {
                  confirmButton = 'Ok';
                  UserConfirmationsService.show(err, confirmButton, true);
                }
              });
              hideThisPopover();
            };

            scope.subscribeUser = function (userId, nameSubscription) {
              if (scope.disabledUpdateCheckbox || (nameSubscription === 'invoice' && scope.isLastUserWithInvoiceSubscription(scope.user))) {
                return;
              }

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
