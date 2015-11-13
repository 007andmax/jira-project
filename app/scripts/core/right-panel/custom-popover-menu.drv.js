'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive('customPopoverMenu',
    ['$timeout', 'UsersService', 'SubscriptionsService',
      function ($timeout, UsersService, SubscriptionsService) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {

            scope.popoverIsOpen = false;

            element.bind("contextmenu", function (e) {
              var mouseOnPopover = false;

              e.preventDefault();

              scope.$apply('popoverIsOpen = true');

              var customPopover = $('.popover');

              $('.popover-content').css('padding', 0);
              customPopover.css({'padding': 0, 'margin-top': '-32px'});

              customPopover.bind('mouseleave', function () {
                scope.$apply('popoverIsOpen = false')
              });

              element.bind('mouseleave', function () {

                $timeout(function () {

                  if ($(".popover:hover").length === 0) {
                    scope.$apply('popoverIsOpen = false');
                  }
                  element.off('mouseleave')
                }, 50)

              });
            });

            scope.sendEmail = function () {
              if(Object.keys(scope.selectedUsers).length !== 0){

                var usersIds = [];

                for(var userId in scope.selectedUsers){
                  if(scope.selectedUsers[userId]){
                    usersIds.push(userId)
                  }
                }
                console.log('send email users ' + usersIds);

                return;
              }
              console.log('send email ' + scope.user.id);
            };

            scope.startChat = function () {
              console.log('start chat ' + scope.user.id)
            };

            scope.changeUserRole = function (userRole) {
              UsersService.changeUserRole(scope.user.id, userRole);
            };

            scope.archiveContact = function () {
              if(Object.keys(scope.selectedUsers).length !== 0){

                var usersIds = [];

                for(var userId in scope.selectedUsers){
                  if(scope.selectedUsers[userId]){
                    usersIds.push(userId)
                  }
                }
                console.log('archive users ' + usersIds);

                return;
              }
              console.log('archive ' + scope.user.id);
            };

            scope.subscribeUser = function (userId, nameSubscription) {

              var subscription = scope.user.subscription;

              if (subscription) {
                subscription = subscription.staticCopy()
              } else {
                subscription = {
                  user: {id: userId}
                }
              }

              subscription[nameSubscription] = !subscription[nameSubscription];

              SubscriptionsService.saveUserSubscription(subscription);
            };

          }
        }
      }]);
})();
