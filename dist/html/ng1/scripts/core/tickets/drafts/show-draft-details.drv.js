'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('showDraftDetails',
    ['$timeout', '$stateParams', 'localStorageService',
      function ($timeout, $stateParams, localStorageService) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var body = $('body');

            controlDraftList(null, true);

            element.hide();
            body.addClass('opened-ticket');

            scope.$on('draftDetailsLoad', function () {
              controlDraftList(null, true);
              element.show();
            });

            scope.$on('toggleDraftsList', function () {
              if (scope.draftListOpened) {
                body.removeClass("opened-ticket-list").addClass("opened-ticket");
              } else {
                body.addClass("opened-ticket-list opened-ticket");
              }
              scope.draftListOpened = !scope.draftListOpened;
              localStorageService.set('ticket-list-view', scope.draftListOpened ? 'opened' : 'closed')
            });

            scope.$on('$destroy', function () {
              body.removeClass('opened-ticket');
              body.addClass('opened-ticket-list');
              $(window).off('resize', controlDraftList);
            });

            $(window).on('resize', controlDraftList);

            function controlDraftList(e, isCheckView) {
              if (!$stateParams.draftId) {
                return;
              }

              var windowWidth = window.innerWidth;

              if (windowWidth > 1315 && (!isCheckView || localStorageService.get('ticket-list-view') === 'opened')) {
                scope.draftListOpened = true;
                body.addClass("opened-ticket-list opened-ticket");
              } else {
                scope.draftListOpened = false;
                body.removeClass("opened-ticket-list").addClass("opened-ticket");
              }
            }

          }
        };
      }]);

})();

