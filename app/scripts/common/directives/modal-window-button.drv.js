'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('modalWindowButton',
    ['$modal', function ($modal) {

      return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {

          if (!attrs.modalWindowButton) {
            throw 'template url is required';
          }

          var wind = $(window),
            windowScrollTop;

          element.on('click', function () {
            windowScrollTop = wind.scrollTop();

            var modalInstance = $modal.open({
              animation: false,
              backdrop: 'static',
              templateUrl: attrs.modalWindowButton,
              controller: attrs.mwController,
              scope: scope
            });

            modalInstance.result.then(fixScroll, fixScroll);
          });

          function fixScroll() {
            setTimeout(function () {
              wind.scrollTop(windowScrollTop)
            }, 0);
          }
        }
      }
    }]);

})();
