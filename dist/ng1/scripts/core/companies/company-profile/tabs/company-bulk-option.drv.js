'use strict';

(function () {

  angular.module("quicktech.core.companies").directive('companyBulkOption',
    ['$window', function ($window) {
      return {
        restrict: 'A',
        link: function (scope, element) {

          var isBulkFixed = false;
          var bulkElement = element.find('[bulk-option-content]');

          angular.element($window).on("scroll", scrollListner);

          function scrollListner() {
            var viewableOffset = element.offset().top - $(window).scrollTop();

            if (!isBulkFixed && (viewableOffset < 58)) {
              isBulkFixed = true;
              bulkElement.addClass('fixed-bulk');
              return
            }

            if (isBulkFixed && (viewableOffset > 58)) {
              isBulkFixed = false;
              bulkElement.removeClass('fixed-bulk');
            }

          }

          scope.$on('$destroy', function () {
            angular.element($window).off('scroll', scrollListner);
          });

        }
      }
    }]);
})();
