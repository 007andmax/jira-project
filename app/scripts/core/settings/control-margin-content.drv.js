'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("controlMarginContent",
    ['CompaniesService', function (CompaniesService) {
      return {
        restrict: 'A',
        link: function (scope, element) {

          scope.currentCompany = CompaniesService.getCurrentCompany();

          setMarginLeft();

          $(window).resize(setMarginLeft);

          function setMarginLeft() {
            var wrapper_width = $(".content-wrapper").width(),
              req_margin = parseInt((wrapper_width - 740) / 2);

            element.css("margin-left", req_margin);

            if (scope.currentCompany.status === 'SIGN_UP') {
              initBackdrop()
            }

          }

          function initBackdrop() {

            scope.isLeftPanelClosed = window.innerWidth < 1390;
            scope.isRightPanelClosed = window.innerWidth < 1316;

          }

          scope.$on('$destroy', function () {
            $(window).off('resize');
          });
        }
      }
    }]);
})();
