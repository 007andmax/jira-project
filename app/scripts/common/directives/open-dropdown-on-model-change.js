'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('openDropdownOnModelChange',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          var input = element.find('input'),
            initialized = false;

          scope.$watch(function () {
            return input.val();
          }, function (value) {
            if (value && !scope.preventDropDownOpening) {
              if (initialized && !element.hasClass('open')) {
                element.addClass('open');
              } else {
                initialized = true;
              }
            }
          });
        }
      };
    }]);
})();
