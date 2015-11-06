'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("changeCurrentAddress",
    function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {

          scope.changeAddressIndex = function (index) {

            if(scope.currentAddressIndex === index){
              return;
            }

            scope.currentAddressIndex = index;

            element.find('[address-conteiner]').fadeOut(200, function () {
              element.find('[address-conteiner=' + index +']').fadeIn(200)
            });

          };

        }
      }
    });
})();
