'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("arrayMinlength", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModelCtrl) {
        var minlength = attrs.arrayMinlength * 1;
        ngModelCtrl.$setValidity('arrayminlength', (ngModelCtrl.$viewValue.length >= minlength));

        $scope.$watch(function(){
          return ngModelCtrl.$viewValue.length;
        },function (length) {
          ngModelCtrl.$setValidity('arrayminlength', length >= minlength);
        });
      }
    }
  });
})();
