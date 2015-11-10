'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("addressesControl",
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {

          scope.showAddress = function (index, waitForAngular) {

            var showAddressIndex = index;

            if (index < 0) {
              index = 0;
              showAddressIndex = 1;
            }

            scope.currentAddressIndex = index;

            if (waitForAngular) {
              $timeout(function () {
                showAddress(showAddressIndex);
              }, 0);

              return;
            }

            showAddress(showAddressIndex);

          };

          function showAddress(index) {

            element.find('[address-item]').hide();
            element.find('[address-item]:eq(' + index + ')').show();
          }

          scope.animateAndRemoveLocation = function (index) {
            scope.showAddress(index - 1, function () {
              scope.removeLocation(index)
            })
          };

        }
      }
    }]);
})();
