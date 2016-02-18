'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("deactivateButton",
    ['UsersService', 'quicktech.common.services.UserConfirmationsService',
      function (UsersService, UserConfirmationsService) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            element.click(function () {
              var confirmMesage = 'Do you want to deactivate account?',
                confirmButton = 'Yes';

              UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                UsersService.deleteOrArchiveUser(scope.currentUser.id, false);
              });

            })

          }
        }
      }]);
})();
