'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.globalSearchCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'GlobalSearch',
      function ($scope, SharedStateService, GlobalSearch) {

        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.$watch('searchValue', function (word) {
          if (word) {
            GlobalSearch.search(word, function (resp) {
              console.log(resp);
            });
          }
        });

      }]);

}());
