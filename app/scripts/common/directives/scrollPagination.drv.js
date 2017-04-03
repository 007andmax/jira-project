'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('scrollPagination', function ($window) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {

        var w = $window;
        angular.element(w).bind('scroll', function (e) {
          scope.$apply(function () {
            var scrollTop = $(e.target).scrollTop(),
              isNeedToLoadMoreTickets = ($('[scroll-pagination]').height() - $window.innerHeight) <= scrollTop + 200;
            if (isNeedToLoadMoreTickets) {
              console.log("Pagination......");
              scope.displayLimit = scope.displayLimit + 20;
              console.log("limit: ", scope.displayLimit);
            }
          });
        });

      }
    }
    });
})();
