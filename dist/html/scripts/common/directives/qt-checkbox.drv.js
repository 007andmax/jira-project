'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtCheckbox',
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

          element.on('click', function (e) {
            modelCtrl.$setViewValue(!modelCtrl.$viewValue);
            //scope.$apply();
          });

        }
      }
    }]);
})();
