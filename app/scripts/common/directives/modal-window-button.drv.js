'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('modalWindowButton',
    ['$uibModal', function ($uibModal) {

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

            var modalInstance = $uibModal.open({
              animation: true,
              backdrop: 'static',
              windowClass: attrs.modalWindowClass || '',
              templateUrl: attrs.modalWindowButton,
              controller: attrs.mwController,
              scope: scope,
              windowTemplateUrl: attrs.mwWindowTemplateUrl
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
