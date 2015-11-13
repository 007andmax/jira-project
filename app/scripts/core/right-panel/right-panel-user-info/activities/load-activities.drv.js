'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive("loadActivities",
    ['RightPanelService', '$timeout',
      function (RightPanelService, $timeout) {
        return {
          restrict: 'A',

          link: function (scope) {

            var params = {keyword: ''},
              loadingMoreActivities,
              scrollListenerInitialize,
              scrollPane = $(".nano"),
              loadSearchActivities = false;

            scope.searchActivity = '';

            scope.activities = RightPanelService.getActivities(scope, params, function () {
              initScrollListener();

              $timeout(function(){
                scrollPane.nanoScroller();
              }, 0);
            });

            scope.$watch('searchActivity', function () {

              if (scope.searchActivity.length > 2) {
                loadSearchActivities = true;
              }

              if (scope.searchActivity.length > 2 || scope.searchActivity.length === 0) {

                if (!loadSearchActivities) {
                  return;
                }

                params.keyword = scope.searchActivity;
                scope.activities = RightPanelService.getActivities(scope, params, function () {
                  $timeout(function(){
                    scrollPane.nanoScroller();
                  }, 0);

                  if (scope.searchActivity.length === 0) {
                    loadSearchActivities = false;
                  }
                });
              }
            });

            function initScrollListener() {

              if (scrollListenerInitialize) {
                return;
              }

              scrollListenerInitialize = true;

              scrollPane.bind("scrollend", function () {

                if (loadingMoreActivities) {
                  return;
                }

                loadingMoreActivities = true;

                RightPanelService.loadMoreActivities(scope, function (moreActivities) {

                  loadingMoreActivities = false;

                  $timeout(function(){
                    scrollPane.nanoScroller();
                  }, 0);

                  if (moreActivities.length === 0) {
                    $timeout(function(){
                      scrollPane.off("scrollend");
                    }, 10);
                  }
                });

              });

              scope.$on('$destroy', function () {
                scrollPane.off("scrollend");
              });

            }
          }
        };

      }]);
})();
