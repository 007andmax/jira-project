'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('upDownKey', [
    'UsersService', function (UsersService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

          var scrollElement = element.find('.scroll-pane'),
            usersCount;

          scope.currentAssignUser = -1;

          element.on("keyup", function (event) {

            var assignUsers = element.find('[assign-user]');

            if (usersCount !== assignUsers.length) {
              scope.currentAssignUser = -1;
            }

            usersCount = assignUsers.length;

            if (event.which === 40) { // when down
              changeCurrentAssignUser(assignUsers, scope.currentAssignUser + 1);
            } else if (event.which === 38) { // when up
              changeCurrentAssignUser(assignUsers, scope.currentAssignUser - 1);
            } else if (event.which === 13) {

              var userId = $(assignUsers[scope.currentAssignUser]).attr('assign-user'),
                user = UsersService.getOneById(userId);

              if (!user) {
                throw "There is no user with id - " + userId + " !!!!";
              }

              ctrl.$setViewValue(user);
            }

            function changeCurrentAssignUser(assignUsers, index) {

              if (index >= assignUsers.length) {
                index = 0;
              } else if (index < 0) {
                index = assignUsers.length - 1;
              }

              scope.$apply("currentAssignUser = " + index);

              var elementPosition = assignUsers.height() * index;

              scrollElement.nanoScroller({ scrollTop: elementPosition });

            }

          });

        }
      };
    }]);

})();
