'use strict';

(function () {

  angular.module("quicktech.core.services").directive('moveServicesScroll',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          element.jScrollPane({
            autoReinitialise: true,
            showArrows: true
          });
        }
      }
    }]);
})();
