'use strict';

(function () {
  angular.module("quicktech.core.companies").directive('qtScrollTo', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (attrs.qtScrollTo === 'center') {
          element[0].scrollIntoViewIfNeeded(true);
        } else {
          element[0].scrollIntoViewIfNeeded(false);
        }
      }
    }
  });
})();
