'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("customDisabled",
    function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          scope.$watch(function () {
            return attrs.customDisabled;
          }, function (value) {

            var boolValue = !!scope.$eval(value);

            element.attr('ng-disabled', boolValue);
            element.attr('disabled', boolValue);

            if (boolValue) {
              element.addClass("disabled")
            } else {
              element.removeClass("disabled")
            }

          });

        }
      }
    });
})();
