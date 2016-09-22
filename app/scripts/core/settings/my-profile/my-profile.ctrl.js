'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileCtrl',
    ['$scope', '$state', '$stateParams', 'UsersService',
      function ($scope, $state, $stateParams, UsersService) {
        $scope.aboutMe = $scope.currentUser.status;
        $scope.isAddressFocused = false;

        $scope.userProfile = UsersService.getUserProfile(function (a) {
          $scope.userProfile = $scope.userProfile.staticCopy();

          if (!$scope.userProfile.address) {
            $scope.userProfile.address = {
              phoneNumbers: []
            }
          }
          $scope.loadUserProfile = true;
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.saveAboutMe = function (form) {
          if (form.$valid) {

            UsersService.saveForUserProfile($scope.aboutMe, 'status', function () {
              form.$setPristine();
            });

          }
        };

      }]);

}());
