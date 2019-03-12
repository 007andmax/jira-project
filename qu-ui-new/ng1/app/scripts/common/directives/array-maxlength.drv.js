'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("arrayMaxlength", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, element, attrs, ngModelCtrl) {
        var maxlength = attrs.arrayMaxlength * 1;
        ngModelCtrl.$setValidity('arraymaxlength', (ngModelCtrl.$viewValue.length <= maxlength));

        $scope.$watch(function(){
          return ngModelCtrl.$viewValue.length
        },function (length) {
          ngModelCtrl.$setValidity('arraymaxlength', length <= maxlength);
        });
      }
    }
  });
})();
