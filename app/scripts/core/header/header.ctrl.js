'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.headerCtrl',
    ['$scope', '$state',
      function ($scope, $state) {

        $scope.getTemplateNameByState = function () {
          if ($state.includes("Tickets")) {
            return 'tickets';
          } else if ($state.includes("users")) {
            return 'users';
          }
        }

      }]);

}());
