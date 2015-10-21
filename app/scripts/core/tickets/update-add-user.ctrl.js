'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.updateAddUserCtrl',
      ['$scope', 'UsersService', 'CompaniesService', 'ContactsService',
        function ($scope, UsersService, CompaniesService, ContactsService) {

          $scope.currentAddUserTab = 'TEAM_MEMBER';
          $scope.searchFilter = {};
          $scope.agents = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
          $scope.clients = UsersService.getAllByCompanyId($scope.ticketDetails.company.id);
          $scope.vendorsContacts = ContactsService.getSubscribedContactsOnTicket();

          $scope.openAddUserTab = function (mode) {

            $scope.searchFilter = {};

            switch (mode) {

              case 'TEAM_MEMBER':
                $scope.currentAddUserTab = 'TEAM_MEMBER';
                return;

              case 'VENDOS':
                $scope.currentAddUserTab = 'VENDOS';
                return;

              case 'CLIENT_USER':
                $scope.currentAddUserTab = 'CLIENT_USER';
                return;
            }
          };

          $scope.filterUpdateUser = function (item) {

            if(item.id === $scope.currentUser.id || item.id === $scope.ticketDetails.assignedUser.id){
              return false;
            }

            if ($scope.searchFilter.user && $scope.searchFilter.user.length > 0) {
              return ((item.firstName + ' ' + item.lastName + ' ' + item.primaryEmail).toLowerCase()).indexOf($scope.searchFilter.user.toLowerCase()) !== -1;
            }

            return true;
          };


          $scope.addUserToUpdate = function (user) {

            if ($scope.selectUpdateSharedUser[user.id]) {

              $scope.updateSharedUsersList.push({user: user});

            } else {

              for (var i = 0; i < $scope.updateSharedUsersList.length; i++) {
                if ($scope.updateSharedUsersList[i].user && $scope.updateSharedUsersList[i].user.id === user.id) {
                  $scope.updateSharedUsersList.splice(i, 1);
                }
              }

            }
          };

          $scope.addContactToUpdate = function (contact) {

            if ($scope.selectUpdateSharedUser[contact.id]) {

              $scope.updateSharedUsersList.push({contact: contact});

            } else {

              for (var i = 0; i < $scope.updateSharedUsersList.length; i++) {
                if ($scope.updateSharedUsersList[i].contact && $scope.updateSharedUsersList[i].contact.id === contact.id) {
                  $scope.updateSharedUsersList.splice(i, 1);
                }
              }

            }
          };



        }]);
  }()
);
