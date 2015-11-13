'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelUsersTabCtrl',
    ['$scope',
      function ($scope) {

        $scope.selectedUsers = {};

        $scope.usersFilter = function (item) {

          if ($scope.searchUserKeyword && $scope.searchUserKeyword.length > 0) {
            var fullSearchFild = (item.firstName + ' ' + item.lastName).toLowerCase();
            return fullSearchFild.indexOf($scope.searchUserKeyword.toLowerCase()) !== -1;
          }
          return true;
        };

        $scope.$watch('selectedUsers', function(){
          var count = 0;

          for(var userId in $scope.selectedUsers){
            if($scope.selectedUsers[userId]){
              count++;
              if(count > 1){
                $scope.selectMoreThanOneUser = true;
                return
              }
            }
          }
          $scope.selectMoreThanOneUser = false;
        }, true)

      }]);

}());
