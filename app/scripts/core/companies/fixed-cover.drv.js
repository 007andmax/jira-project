'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("fixedCover",
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, element) {

          fixedCover();

          function fixedCover() {

            var companyInfo = element.find('.company-info');

            var coverHeight = element.height();
            var infoHeight = companyInfo.height();

            var reqMargin = parseInt((coverHeight - infoHeight) / 2);

            companyInfo.css({'top': reqMargin - 3, 'transform': 'none'});
          }

          window.onresize = fixedCover;

        }
      }
    }]);

})();
