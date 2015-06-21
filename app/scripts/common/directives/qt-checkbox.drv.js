'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtCheckbox',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        //scope: {
        //  stopPropagation: '='
        //},
        link: function (scope, element, attrs, modelCtrl) {

          element.on('click', function (e) {
            modelCtrl.$setViewValue(!modelCtrl.$viewValue);
            scope.$apply();
            //if (scope.stopPropagation) {
            //  e.stopPropagation();
            //}
          });

        }
      }
    }]);
})();
