'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtTypeaheadAsyncShowOnFocus',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
          var secretEmptyKey = '[$empty$]';
          var onInit = false;
          element.bind('click', triggerFunc);

          function triggerFunc() {
            onInit = true;
            if (modelCtrl.testVar) {
              modelCtrl.testVar = false;
              return;
            }

            var prev = modelCtrl.$modelValue || '';
            if (prev) {
              modelCtrl.$setViewValue('');
            } else {
              modelCtrl.$setViewValue(' ');
              setTimeout(function () {
                modelCtrl.$setViewValue(prev);
              });
            }
          }

          // this parser run before typeahead's parser
          modelCtrl.$parsers.unshift(function (inputValue) {
            if (!onInit && attrs.name === "glNumber") return;
            var value = (inputValue ? inputValue : secretEmptyKey); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
            modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
            return value;
          });

          // this parser run after typeahead's parser
          modelCtrl.$parsers.push(function (inputValue) {
            if (!onInit && attrs.name === "glNumber") return;
            return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
          });

          scope.stateComparator = function (state, viewValue) {
            //   if (!onInit) return;
            var secretEmptyKey = '[$empty$]';
            return viewValue === secretEmptyKey || ('' + state).toLowerCase().indexOf(('' + viewValue).toLowerCase()) > -1;
          };

        }
      }
    }]);
})();
