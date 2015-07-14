'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("ticketPriority", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: true,
      link: function ($scope, element, attrs, ngModelCtrl) {
        if (!$scope.ticketPriority) {
          ngModelCtrl.$setViewValue([]);
        }


      },
      controller: function ($scope) {

        $scope.ticketPriorityValue = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High'
        };
      }
    }
  });
})();
