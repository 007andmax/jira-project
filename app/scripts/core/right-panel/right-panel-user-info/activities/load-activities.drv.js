'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive("loadActivities",
    ['RightPanelService',
      function (RightPanelService) {
        return {
          restrict: 'A',

          link: function (scope) {

            var params = {keyword: ''},
              loadingMoreActivities,
              scrollListenerInitialize,
              rightPanel = $('#rightPanelElement'),
              scrollPane = rightPanel.data('jsp'),
              $document = $(document),
              loadSearchActivities = false;

            scope.searchActivity = '';

            scope.activities = RightPanelService.getActivities(scope, params, function () {
              initScrollListener();
            });

            scope.$watch('searchActivity', function () {

              if(scope.searchActivity.length > 2){
                loadSearchActivities = true;
              }

              if (scope.searchActivity.length > 2 || scope.searchActivity.length === 0) {

                if(!loadSearchActivities){
                  return;
                }

                params.keyword = scope.searchActivity;
                scope.activities = RightPanelService.getActivities(scope, params, function(){
                  if(scope.searchActivity.length === 0){
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

              $document.on('jsp-scroll-y', function () {

                if (scrollPane.getPercentScrolledY() === 1) {

                  if (loadingMoreActivities) {
                    return;
                  }

                  loadingMoreActivities = true;

                  RightPanelService.loadMoreActivities(scope, function (moreActivities) {
                    loadingMoreActivities = false;

                    if (moreActivities.length === 0) {
                      $document.off('jsp-scroll-y');
                    }
                  })
                }

              });

              scope.$on('$destroy', function () {
                $document.off('jsp-scroll-y');
              });

            }
          }
        };

      }]);
})();
