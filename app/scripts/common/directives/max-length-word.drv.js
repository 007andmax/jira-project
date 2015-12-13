'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("maxLengthWord",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {},
        link: function (scope, element, attrs, ngModelCtrl) {

          validate();

          scope.$watch(function () {
            return ngModelCtrl.$viewValue;
          }, validate);

          function validate() {

            if (!ngModelCtrl.$viewValue || ngModelCtrl.$viewValue.length < 1) {
              return;
            }

            var wordArray = ngModelCtrl.$viewValue.split(' '),
              mostLargeWord = largest(wordArray),
              isValid = mostLargeWord.length < +attrs.maxLengthWord;

            ngModelCtrl.$setValidity('maxLengthWord', isValid);

            function largest(arr) {

              var sortArray = arr.sort(function (a, b) {
                return b.length - a.length
              });

              return sortArray[0];
            }

          }
        }
      }
    }]);
})();
