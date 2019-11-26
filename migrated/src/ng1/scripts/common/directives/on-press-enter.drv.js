'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('onPressEnter',
    ['$timeout', '$parse', function ($timeout, $parse) {
      return {
        restrict: 'A',
        scope: {
          func: '<onPressEnterFn'
        },
        link: function (scope, element, attr) {
          element[0].addEventListener('keypress', function(evt) {
            if (evt.keyCode === 13) {
            
            }
          
          })
        }
      };
    }]);
})();
