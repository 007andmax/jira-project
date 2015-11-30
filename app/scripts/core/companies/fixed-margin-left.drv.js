'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("fixedMarginLeft",
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, element) {

          var createCompanyContent = element.find('.create-company-content');

          fixedMarginLeft();

          function fixedMarginLeft() {

            var wrapperWidth = element.width(),
              fixedMargin = ((wrapperWidth - 740) / 2);

            createCompanyContent.css("margin-left", fixedMargin + 'px');

          }

          $(window).resize(function () {
            fixedMarginLeft();
          });

        }
      }
    }]);

})();
