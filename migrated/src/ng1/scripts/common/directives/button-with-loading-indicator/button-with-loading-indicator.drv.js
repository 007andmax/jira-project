'use strict';

(function () {
  angular
    .module('quicktech.common.directives')
    .directive('buttonWithLoadingIndicator',
      ['$timeout', buttonWithLoadingIndicator]);

  function buttonWithLoadingIndicator($timeout) {
    return {
      restrict: 'E',
      templateUrl: '/ng1/scripts/common/directives/button-with-loading-indicator/button-with-loading-indicator.tpl.html',
      replace: true,
      scope: {
        loading: '=',
        label: '@?',
        icnClasses: '@?'
      },
      link: function (scope, element, attrs) {

        var initializing = true,
          promise;

        scope.$watch('loading', function (loading) {
          if (initializing && !loading) {
            initializing = false;
            scope.animationFinished = true;
          } else {
            initializing = false;
            if (loading) {
              if (promise) {
                $timeout.cancel(promise);
              }

              scope.loaded = false;
              scope.animationFinished = false;
            } else {
              scope.loaded = true;
              promise = $timeout(function () {
                scope.animationFinished = true;
              }, 2000);
            }
          }
        });

      }
    }
  }
})();
