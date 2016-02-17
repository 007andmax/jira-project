'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("deactivateButton",
    ['UsersService', function (UsersService) {
      return {
        restrict: 'A',
        link: function (scope, element) {

          element.click(function(){
            UsersService.deleteOrArchiveUser(scope.currentUser.id, false);
          })

        }
      }
    }]);
})();
