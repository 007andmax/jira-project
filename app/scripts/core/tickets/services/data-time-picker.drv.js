'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('chooseDataDropdown',
    function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {},
        link: function (scope, element, attrs, ctrl) {

          element.datetimepicker({
            keepOpen: true,
            format: 'DD MMM YYYY'
          });

          element.bind('dp.change', function (e) {
            ctrl.$setViewValue(e.date._d)
          });

        }
      }
    });
})();
