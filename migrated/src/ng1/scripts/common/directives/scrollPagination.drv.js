'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('scrollPagination', ['$window', function ($window) {
    return {
      restrict: "A",
      link: function (scope) {
        angular.element($window).bind('scroll', function (e) {
          var scrollTop = $(e.target).scrollTop(),
            isNeedToLoadMoreTickets = ($('[scroll-pagination]').height() - $window.innerHeight) <= scrollTop + 200;
          if (isNeedToLoadMoreTickets) {
            scope.$apply(function () {
                scope.displayLimit = scope.displayLimit + 20;
            });
          }
        });

      }
    }
    }]);
})();
