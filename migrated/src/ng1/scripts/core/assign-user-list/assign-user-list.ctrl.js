'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.assign-user-list.userListCtrl',
    ['$scope', '$rootScope', 'TicketsService', function ($scope, $rootScope, TicketsService) {

      $scope.getUserAvatarUrl = $rootScope.getUserAvatarUrl;
      $scope.search = "";
      var user = $rootScope.usersToNotify || $scope.usersCurrentCompany;
      
     
      $scope.users_list = JSON.parse(JSON.stringify(user));
      $scope.users_list.forEach(function (element) {
        element.selected = ($scope.assignedUser && $scope.assignedUser.id == element.id) ? true : false;
      });
      $scope.users = JSON.parse(JSON.stringify($scope.users_list));
      
      $scope.$watch(function () {
        return $scope.assignedUser;
      }, function (val) {
        if (val) {
       
          $scope.users.forEach(function (element) {
            element.selected = (val.id == element.id) ? true : false;
          });
          
        }
      });

      $scope.$watch(function () {
        return $scope.ticketDetails.multiAssignedUsers;
      }, function (val) {
        if (val && val.length) {
        
          $scope.users.forEach(function (element) {
            element.selected = false;
          });
          $scope.users.forEach(function (element) {
            var index = val.findIndex((item) => item.id === element.id);
            element.selected = (index > -1) ? true : false;
          });
        }
        

      });
     
      $scope.onSearch = function () {
      
        $scope.users = $scope.users_list.filter(item => (item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase()).includes($scope.search.toLowerCase()));
 
      }
      $scope.selectUser = function (i) {
        var count_selected = $scope.users.filter(user => user.selected);
        if ($scope.users[i].selected && count_selected.length === 1) return;
        $scope.users[i].selected = !$scope.users[i].selected;
        var count_selected_new = $scope.users.filter(user => user.selected);
        TicketsService.updateAssignUsersTicket(count_selected_new, $scope.ticketDetails.id, function (data) {
        
        })
        $scope.$apply();
      }
      $scope.getUserName = function (user) {
        return user.firstName + ' ' + user.lastName;
      }
    }]);



}());
