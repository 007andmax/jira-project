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
            console.log("triggerFunc");
            if(modelCtrl.testVar) {
              modelCtrl.testVar = false;
              return;
            }

            var prev = modelCtrl.$modelValue || '';
            if (prev) {
              console.log("prev",prev);
              modelCtrl.$setViewValue('');
              // $timeout(function() {
              //   modelCtrl.$setViewValue(prev);
              // });
            } else {
              console.log("modelCtrl",modelCtrl);
              modelCtrl.$setViewValue(' ');
              setTimeout(function() {
                modelCtrl.$setViewValue(prev);
              });
            }
          }

          // this parser run before typeahead's parser
          modelCtrl.$parsers.unshift(function (inputValue) {
         //   if (!onInit) return;
            console.log("unshift");
            var value = (inputValue ? inputValue : secretEmptyKey); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
            modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
            return value;
          });

          // this parser run after typeahead's parser
          modelCtrl.$parsers.push(function (inputValue) {
         //   if (!onInit) return;
            console.log("push");
            return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
          });

          scope.stateComparator = function (state, viewValue) {
         //   if (!onInit) return;
            console.log("stateComparator");
            var secretEmptyKey = '[$empty$]';
            return viewValue === secretEmptyKey || ('' + state).toLowerCase().indexOf(('' + viewValue).toLowerCase()) > -1;
          };

        }
      }
    }]);
})();
