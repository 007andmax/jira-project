'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('countNodesInLine',
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

          var selector = attrs.countNodesInLine;

          $(window).on('resize', countNodes);
          //scope.$on('recalc-count-nodes-in-line', countNodes);
          scope.countNodes = countNodes;

          scope.$on('$destroy', function(){
            $(window).on('off', countNodes);
          });

          function countNodes() {
            var count = element.width() / element.find(selector).width();
            ctrl.$setViewValue(count.toFixed());
          }
        }
      }
    }]);
})();
