'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('limitLines',
    ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

        }


      }
    }]);
})();
