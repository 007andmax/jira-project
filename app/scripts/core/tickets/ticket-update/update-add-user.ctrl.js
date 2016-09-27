'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.updateAddUserCtrl',
      ['$scope', 'UsersService', 'CompaniesService', 'ContactsService', 'Utils', '$timeout',
        function ($scope, UsersService, CompaniesService, ContactsService, Utils, $timeout) {

          $scope.currentAddUserTab = 'TEAM_MEMBER';
          $scope.searchFilter = {};
          $scope.agents = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
          if ($scope.ticketDetails) {
            $scope.clients = UsersService.getAllByCompanyId($scope.ticketDetails.company.id);
          }
          $scope.vendorsContacts = ContactsService.getSubscribedContactsOnTicket($scope, function () {

            for (var i = $scope.ticketSharedUsersList.length - 1; i >= 0; i--) {
              var share = $scope.ticketSharedUsersList[i];

              if (share.contact && !Utils.findById($scope.vendorsContacts, share.contact.id)) {
                $scope.ticketSharedUsersList.splice(i, 1);
                delete $scope.selectUpdateSharedUser[share.contact.id];
              }
            }

          });
          //$scope.vendorsContacts = ContactsService.getSubscribedContactsOnTicket();

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
            var isCurrentUser = item.id === $scope.currentUser.id,
              isAssignedUser = false,
              isCreatedUser = false,
              isAlreadyShared = false;

            if ($scope.ticketDetails) {
              var shares = $scope.ticketDetails.shares || [];

              isAssignedUser = $scope.ticketDetails.assignedUser && item.id === $scope.ticketDetails.assignedUser.id;
              isCreatedUser = item.id === $scope.ticketDetails.createdUser.id;
              isAlreadyShared = shares.find(function (shared) {
                return (shared.user ? shared.user.id : shared.contact.id) === item.id;
              });
            } else if ($scope.ticket) {
              var assignedUserId;

              if (!$scope.ticket.ticketAssignTo) {
                if ($scope.ticket.isAssignToMe) {
                  assignedUserId = $scope.currentUser.id;
                }
              } else {
                assignedUserId = $scope.ticket.ticketAssignTo.id;
              }

              isAssignedUser = assignedUserId && item.id === assignedUserId;
              isCreatedUser = isCurrentUser;
            } else {
              isCurrentUser = false;
            }

            if (isCurrentUser || isAssignedUser || isCreatedUser || isAlreadyShared) {
              return false;
            }

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

          $scope.addContactToUpdate = function (contact) {

            if ($scope.selectUpdateSharedUser[contact.id]) {

              $scope.ticketSharedUsersList.push({ contact: contact, notify: true });

            } else {

              for (var i = 0; i < $scope.ticketSharedUsersList.length; i++) {
                if ($scope.ticketSharedUsersList[i].contact && $scope.ticketSharedUsersList[i].contact.id === contact.id) {
                  $scope.ticketSharedUsersList.splice(i, 1);
                }
              }

            }
          };

          $scope.addItemToUpdate = function (item) {
            if (item.accountType) {
              $scope.addUserToUpdate(item);
            } else {
              $scope.addContactToUpdate(item);
            }
          };


        }]);
  }()
);
