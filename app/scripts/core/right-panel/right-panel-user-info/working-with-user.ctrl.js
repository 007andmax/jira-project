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

        $scope.getUserRole = function(){
          if(!$scope.userInfo){
            return
          }

          if($scope.isUser){
            var userRole = $scope.userInfo.company.id === $scope.currentUser.company.id ? 'Team Member' : 'Client User';
            return userRole;
          } else {
            return 'Vendors';
          }
        };

        $scope.sendEmailInPopover = function(){
          console.log('send email')
        };

      }]);

}());
