'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("loadingIndicator", function () {
    return {
      restrict: 'EA',
      templateUrl: '/html/scripts/common/directives/loading-indicator/loading-indicator.tpl.html',
      scope: {
        loadingTrigger: '='
      },
      link: function ($scope, $element) {
        $element.css({
          width: '100%',
          height: '70px',
          display: 'block',
          top: 'calc(50% - 45px)',
          position: 'absolute'
        });

        $scope.$on('loadingFinished', function () {
          $scope.loadingTrigger = false;
        });
      }
    }
  });
})();
