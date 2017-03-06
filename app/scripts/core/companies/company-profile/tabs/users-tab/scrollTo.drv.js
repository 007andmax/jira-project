'use strict';

(function () {
  angular.module("quicktech.core.companies").directive('qtScrollTo', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (attrs.qtScrollTo === 'center') {
          element[0].scrollIntoViewIfNeeded(true);
        } else if (attrs.qtScrollTo === 'top') {
          $(document.body).animate({
            scrollTop: element.offset().top - 78 - element.parent().height()
          });
        } else {
          element[0].scrollIntoViewIfNeeded(false);
        }
      }
    }
  });
})();
