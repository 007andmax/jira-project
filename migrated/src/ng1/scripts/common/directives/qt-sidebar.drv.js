'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtSidebar',
    ['$rootScope', '$document', '$state', function ($rootScope, $document, $state) {
      return {
        restrict: 'A',
        link: function ($scope, $element) {
          var $win = $(window);

          initLeftPanel();

          $win.on('resize', initLeftPanel);

          $scope.$on('$destroy', function () {
            $document.off('click', closeLeftPanelOnSmallScreen);
            $win.off('resize', initLeftPanel);
          });

          function initLeftPanel(e) {
            var windowWidth = window.outerWidth;
            if (!$state.is('settings') && $state.current.url.indexOf('reports') === -1 && $state.current.url.indexOf('report') === -1) {
              $rootScope.isLeftPanelHidden = windowWidth <= 1024;
              console.log(" $rootScope.isLeftPanelHidden", $rootScope.isLeftPanelHidden);
              if ($rootScope.isLeftPanelHidden) {
                $scope.$broadcast('leftPanelClosedFromQTSidebar');
              }
              $document.off('click', closeLeftPanelOnSmallScreen);
              $document.on('click', closeLeftPanelOnSmallScreen);
              if ($rootScope.isLeftPanelHidden === false && window.innerWidth < 1280) {
                setTimeout(function(){
                  document.getElementById('toggle-left-panel').click();
                }, 0)
              } else {
                if (e) {
                  $scope.$apply();
                }
              }

            }
          }

          function closeLeftPanelOnSmallScreen(e) {
            var isClickOutside = !angular.element(e.target).closest($element[0]).length;
            if (window.outerWidth <= 1024 && isClickOutside) {
              //$rootScope.isLeftPanelHidden = true;
              $scope.$broadcast('leftPanelClosedFromQTSidebar');
              $scope.$apply();
            }
          }
        }
      }
    }]);
})();
