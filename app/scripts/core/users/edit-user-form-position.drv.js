'use strict';

(function () {

  angular.module("quicktech.core.users").directive('editUserFormPosition',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element) {

          if (!scope.editUser.id) {
            $('html, body').animate({scrollTop: element.offset().top}, 500);
          }

          formToCenter();

          function formToCenter() {

            var wrapperWidth = element.width(),
              reqMargin = parseInt((wrapperWidth - 562 ) / 2),
              createUserContainer = element.find('.create-user-container');

            createUserContainer.css("margin-left", reqMargin);

          }

          $(window).resize(function () {
            formToCenter()
          });

        }
      }
    }]);
})();
