'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("makeDirtyOnBlur", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModelCtrl) {
        element.on('blur', function(){
          ngModelCtrl.$setDirty(true);
        })
      }
    }
  });
})();
