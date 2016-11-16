'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('draftUploader',
    ['DraftsService', '$document', 'localStorageService', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.SharedStateService', '$stateParams', '$rootScope', '$timeout',
      function (DraftsService, $document, localStorageService, UserNotificationService,
                SharedStateService, $stateParams, $rootScope, $timeout) {

        return {
          restrict: 'A',
          link: function (scope, element) {

            var $win = $(window),
              loadingMore = false;

            scope.loadingOrRendering = false;
            scope.globalSearch = SharedStateService.getSharedState('globalSearch');

            if (!localStorageService.get('ticket-list-view')) {
              localStorageService.set('ticket-list-view', 'opened');
            }

            scope.$watch('openedSource', getDraftsList);

            scope.onFinishRendering = function () {
              if (scope.loadingOrRendering && !loadingMore && scope.openedSource === scope.source.source) {
                $rootScope.$broadcast('toggleDrafts' + scope.openedSource);
              }
              scope.loadingOrRendering = false;
            };

            scope.$on('removeOtherDrafts', function () {
              if (scope.source.source !== scope.openedSource && scope.source.drafts) {
                $rootScope.$broadcast('toggleDrafts' + scope.source.source);
                $timeout(function () {
                  scope.source.drafts = [];
                });
              }
            });

            function getDraftsList(openedSource) {
              if (openedSource && openedSource === scope.source.source) {
                UserNotificationService.show('Loading...');
                $rootScope.$broadcast('removeOtherDrafts');

                scope.loadingOrRendering = true;
                loadingMore = false;
                DraftsService.getDrafts(openedSource, function (uploadedDrafts) {
                  scope.source.drafts = uploadedDrafts;

                  if (!uploadedDrafts.length) {
                    scope.onFinishRendering();
                  }

                  UserNotificationService.hide();
                  initScrollListener();
                  openDraftsList();
                });
              }
            }

            function initScrollListener() {
              $document.on('scroll', scrollHandler);

              scope.$on('$destroy', function () {
                $document.off('scroll', scrollHandler);
              });

              function scrollHandler(e) {
                if (!scope.loadingOrRendering) {
                  var scrollTop = $(e.target).scrollTop(),
                    isNeedToLoadMoreTickets = ($('[drafts-container]').height() - $win.innerHeight()) <= scrollTop + 200;

                  if (isNeedToLoadMoreTickets && !scope.loadingOrRendering &&
                    (!scope.source.drafts || scope.source.drafts.length < scope.openedSourceCount)) {
                    scope.loadingOrRendering = true;
                    loadingMore = true;
                    DraftsService.loadMoreDrafts(scope.openedSource);
                  }
                }
              }
            }

            function openDraftsList() {
              var windowWidth = $(window).width(),
                body = $('body');

              if (!$stateParams.draftId) {
                body.addClass("opened-ticket-list");
              } else if (windowWidth > 1315 && localStorageService.get('ticket-list-view') === 'opened') {
                body.addClass("opened-ticket-list");
                element.addClass('has-scrollbar nano');
              }
            }

          }
        };
      }])
  ;

})
();
