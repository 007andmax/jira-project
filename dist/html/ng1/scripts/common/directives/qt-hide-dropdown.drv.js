'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtHideDropdown',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          scope.$on(attrs.qtHideDropdown, function () {
            element.dropdown('toggle');
          });
        }
      }
    }]);
})();
