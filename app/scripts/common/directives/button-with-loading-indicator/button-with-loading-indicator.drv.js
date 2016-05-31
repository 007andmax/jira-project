'use strict';

(function () {
  angular
    .module('quicktech.common.directives')
    .directive('buttonWithLoadingIndicator',
      ['$timeout', buttonWithLoadingIndicator]);

  function buttonWithLoadingIndicator($timeout) {
    return {
      restrict: 'E',
      templateUrl: '/html/scripts/common/directives/button-with-loading-indicator/button-with-loading-indicator.tpl.html',
      replace: true,
      scope: {
        loading: '=',
        label: '@?',
        icnClasses: '@?'
      },
      link: function (scope, element, attrs) {

        var initializing = true;
        scope.$watch('loading', function (loading) {
          if (initializing) {
            initializing = false;
            scope.animationFinished = true;
          } else {
            if (loading) {
              scope.loaded = false;
              scope.animationFinished = false;
            } else {
              scope.loaded = true;
              $timeout(function () {
                scope.animationFinished = true;
              }, 1000);
            }
          }
        });

      }
    }
  }
})();
