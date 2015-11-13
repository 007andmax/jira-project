'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.workingWithUserCtrl',
    ['$scope', 'UsersService',
      function ($scope, UsersService) {

        $scope.isUser = true;
        $scope.userInfo = UsersService.getOneById($scope.workingWithIdUser) || getOneContactById($scope.workingWithIdUser);

        function getOneContactById(contactId){
          for(var i = 0; i < $scope.vendorContacts.length; i++){
            if(contactId === $scope.vendorContacts[i].id){
              $scope.isUser = false;
              return $scope.vendorContacts[i];
            }
          }
        }

        $scope.sendEmailInPopover = function(userId){
          console.log('send email ' + userId);
        };

      }]);

}());
