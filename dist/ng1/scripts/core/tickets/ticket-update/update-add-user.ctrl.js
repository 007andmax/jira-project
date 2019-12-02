'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.updateAddUserCtrl',
      ['$scope', 'UsersService', 'CompaniesService', 'Utils', '$timeout',
        function ($scope, UsersService, CompaniesService, Utils, $timeout) {

          $scope.currentAddUserTab = 'TEAM_MEMBER';
          $scope.searchFilter = {};
          $scope.agents = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
          if ($scope.ticketDetails) {
            $scope.clients = UsersService.getAllByCompanyId($scope.ticketDetails.company.id);
          } else if($scope.editMode) {

            $scope.clients = UsersService.getAllByCompanyId($scope.returnCompanyId);
          }

          $scope.$watchCollection(function () {
            return $scope.clients.map(function (user) {
              return user.id;
            });
          }, function () {
            $scope.isNeedReset = true;
            $timeout(function () {
              $scope.isNeedReset = false;
            });
          });

          $scope.$watch('ticketSharedUsersList.length', function (value) {
            $scope.selectUpdateSharedUser = {};

            $scope.ticketSharedUsersList.forEach(function (item) {
              if (item.user)
                $scope.selectUpdateSharedUser[item.user.id] = true;
            })
          });

          $scope.openAddUserTab = function (mode) {

            $scope.searchFilter = {};

            switch (mode) {

              case 'TEAM_MEMBER':
                $scope.currentAddUserTab = 'TEAM_MEMBER';
                return;

              case 'CLIENT_USER':
                $scope.currentAddUserTab = 'CLIENT_USER';
                return;
            }
          };

          $scope.filterUpdateUser = function (item) {

            if ($scope.searchFilter.user && $scope.searchFilter.user.length > 0) {
              var searchFild = item.firstName + ' ' + item.lastName + ' ' + (item.primaryEmail && item.primaryEmail.length > 0) ? item.primaryEmail : '';
              return (searchFild.toLowerCase()).indexOf($scope.searchFilter.user.toLowerCase()) !== -1;
            }

            return true;
          };


          $scope.addUserToUpdate = function (user) {

            if ($scope.selectUpdateSharedUser[user.id]) {

              $scope.ticketSharedUsersList.push({ user: user, notify: true });

            } else {

              for (var i = 0; i < $scope.ticketSharedUsersList.length; i++) {
                if ($scope.ticketSharedUsersList[i].user && $scope.ticketSharedUsersList[i].user.id === user.id) {
                  $scope.ticketSharedUsersList.splice(i, 1);
                }
              }

            }
          };


        }]);
  }()
);
