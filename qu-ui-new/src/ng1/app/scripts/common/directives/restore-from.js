'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('restoreFrom', [
    '$document', function ($document) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
          $document.on('click', restore);

          scope.$on('$destroy', function () {
            $document.off('click', restore)
          });

          function restore(e) {
            var parent = angular.element(e.target).parents('.restore-disable-area');

            if (parent.length === 0 && !ctrl.$viewValue) {
              var value = attrs['restoreFrom'];

              if (parseInt(value)) {
                ctrl.$setViewValue(parseInt(value));
                element.val(value);
              } else {
                ctrl.$setViewValue(value);
                element.val(value);
              }
            }
          }
        }
      }
    }
  ]);
})();
