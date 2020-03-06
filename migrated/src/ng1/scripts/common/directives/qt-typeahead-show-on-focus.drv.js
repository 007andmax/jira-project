'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtTypeaheadShowOnFocus',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

          var secretEmptyKey = '[$empty$]';
          element.on('click', function () {
            $timeout(function () {
              modelCtrl.$setViewValue(modelCtrl.$viewValue + ' ');
              $(element).trigger('input');
              $(element).trigger('change'); // for IE*/
            });
          });

          // this parser run before typeahead's parser
          modelCtrl.$parsers.unshift(function (inputValue) {
            var value = (inputValue ? inputValue : secretEmptyKey); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
            modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
            return value;
          });

          // this parser run after typeahead's parser
          modelCtrl.$parsers.push(function (inputValue) {
            return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
          });

          scope.stateComparator = function (state, viewValue) {
            var secretEmptyKey = '[$empty$]';
            return viewValue === secretEmptyKey || ('' + state).toLowerCase().indexOf(('' + viewValue).toLowerCase()) > -1;
          };

        }
      }
    }]);
})();
