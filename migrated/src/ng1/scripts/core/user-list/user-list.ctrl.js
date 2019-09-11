'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.user-list.userListCtrl',
    ['$scope', '$rootScope', function ($scope, $rootScope) {
      $scope.getUserAvatarUrl = $rootScope.getUserAvatarUrl;
      $scope.users = JSON.parse(JSON.stringify($scope.usersToWatch));
      $scope.users.forEach(function (element) {
        element.selected = ($scope.service && $scope.service.user && $scope.service.user.id == element.id || $scope.product && $scope.product.user && $scope.product.user.id == element.id) ? true : false;
      });
      $scope.selectUser = function (i) {
        $scope.users.forEach(function (element, index) {
          if (index == i && !element.selected) {
            if ($scope.service) {
              $rootScope.$broadcast('onChangeService', { item: element, id: $scope.service.id })
            } else {
              $rootScope.$broadcast('onChangeProduct', { item: element, id: $scope.product.id })
            }
            element.selected = true;
          } else if (index == i && element.selected) {
            if ($scope.service) {
              $rootScope.$broadcast('onChangeService', { item: null, id: $scope.service.id })
            } else {
              $rootScope.$broadcast('onChangeProduct', { item: null, id: $scope.product.id })
            }
            element.selected = false;
          } else {
            element.selected = false;
          }
        });
        $scope.$apply();
      }
      $scope.getUserName = function (user) {
        return user.firstName + ' ' + user.lastName;
      }
    }]);

}());
