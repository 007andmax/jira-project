'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsCtrl',
      ['$scope', 'TicketsService', '$stateParams', 'UsersService', 'CompaniesService', 'Downloader', '$state', 'ProductsService', '$sce', '$timeout',
        function ($scope, TicketsService, $stateParams, UsersService, CompaniesService, Downloader, $state, ProductsService, $sce, $timeout) {

          $scope.ticketTags = {};
          $scope.allUpdatesLoaded = false;
          $scope.currentOpenTab = 'NOTE';
          $scope.selectUpdateSharedUser = {};
          $scope.updateSharedUsersList = [];
          $scope.productCategories = ProductsService.getCategories($scope);

          $scope.ticketDetails = TicketsService.getOne($stateParams.ticketId, $scope, true, function (details) {

            var unreadUpdatesId = [];

            if (details.message !== undefined && details.code === 400) {
              $state.go('tickets', {listType: $stateParams.listType});
              return;
            }

            $scope.user = UsersService.getOneById($scope.ticketDetails.createdUser.id);
            $scope.company = CompaniesService.getOneById($scope.ticketDetails.company.id);

            if ($scope.ticketDetails.assignPerformer && $scope.ticketDetails.assignPerformer.id) {
              $scope.assignPerformer = UsersService.getOneById($scope.ticketDetails.assignPerformer.id);
            }

            if ($scope.ticketDetails.assignedUser && $scope.ticketDetails.assignedUser.id) {
              $scope.assignedUser = UsersService.getOneById($scope.ticketDetails.assignedUser.id);
            }

            $scope.$broadcast('ticketDetailsLoad');

            for(var i = 0; i < $scope.ticketDetails.updates.length; i++){

              if($scope.ticketDetails.updates[i].unread){
                if(unreadUpdatesId.length === 0){
                  $scope.firstUnreadUpdateId = $scope.ticketDetails.updates[i].id;
                }

                unreadUpdatesId.push($scope.ticketDetails.updates[i].id);
              }
            }

            if(unreadUpdatesId.length > 0){
              $timeout(function(){
                TicketsService.markUpdateAsRead($scope.ticketDetails.id, unreadUpdatesId)
              }, 1500);

            }

          });

          $scope.setTicketTags = function () {
            for (var j = 0; j < $scope.ticketDetails.tags.length; j++) {
              $scope.ticketTags[$scope.ticketDetails.tags[j].id] = true;
            }
          };

          $scope.setTicketUpdate = function (value) {
            $scope.ticketUpdate = value;
          };

          $scope.updateAndCloseTicket = function () {
            TicketsService.changeStatus($scope.ticketDetails.id, 'COMPLETED', function () {
              $state.go('tickets', {listType: $stateParams.listType});
            });
          };

          $scope.collapseTicket = function () {
            $state.go('tickets', {listType: $stateParams.listType});
          };

          $scope.claimTicket = function () {
            TicketsService.assignTo($scope.ticketDetails.id, $scope.currentUser.id, function () {
              $state.go('tickets', {listType: 'user'}).then(function () {
                $state.go('tickets.details', {ticketId: $scope.ticketDetails.id});
              });
            })
          };

          $scope.openSetting = function () {
            $scope.isOpenSettings = true;
          };

          $scope.changeTicketPriority = function (priority) {
            TicketsService.changePriority($scope.ticketDetails.id, priority);
          };

          $scope.changeTicketStatus = function (status) {
            TicketsService.changeStatus($scope.ticketDetails.id, status);
          };

          $scope.moveIntoSpam = function () {
            TicketsService.changeSpamFlag($scope.ticketDetails.id, true, function () {
              $state.go('tickets', {listType: $stateParams.listType});
            });
          };

          $scope.moveToTrash = function (movedWay) {
            TicketsService.changeTrashFlag($scope.ticketDetails.id, movedWay, function () {
              $state.go('tickets', {listType: $stateParams.listType});
            });
          };

          $scope.downloadAllAttachments = function () {
            Downloader.downloadTicketAttachments($scope.ticketDetails.id);
          };

          $scope.downloadAttachment = function (attachmentId) {
            Downloader.downloadFile(attachmentId)
          };

          $scope.loadMoreUpdates = function () {
            TicketsService.loadRemainingTicketUpdates($scope.ticketDetails, function () {
              $scope.allUpdatesLoaded = true;
            })
          };

          $scope.openFullSharedUsers = function () {
            $scope.isFullSharedUserShow = true;
          };

          $scope.closeFullSharedUsers = function () {
            $scope.isFullSharedUserShow = false;
          };

          $scope.openedTab = function (tabName) {
            $scope.currentOpenTab = tabName;
          };

          $scope.postTicketUpdate = function () {
            console.log('post update ticket' + $scope.ticketDetails.id);
          };

          $scope.getUserType = function (accountType) {

            switch (accountType) {

              case 'TECH':
                return 'Team Member';

              case 'CLIENT':
                return 'Client';

              case 'VENDOR':
                return 'Vendor';
            }
          };

          $scope.getSharedTitle = function (shared) {

            if (shared.user && shared.user.id) {
              var user = $scope.getUserById(shared.user.id);

              return user.accountType === 'TECH' ? 'Team Member' : 'Client User'

            } else {

              return 'Vendor'
            }
          };

          $scope.getTicketNote = function () {
            return $sce.trustAsHtml($scope.ticketDetails.note);
          };

          $scope.deleteUpdateSharedUser = function (sharedUser) {

            for (var i = 0; i < $scope.updateSharedUsersList.length; i++) {

              if (sharedUser.user && $scope.updateSharedUsersList[i].user) {

                if (sharedUser.user.id === $scope.updateSharedUsersList[i].user.id) {
                  $scope.updateSharedUsersList.splice(i, 1);
                }

              } else if (sharedUser.contact && $scope.updateSharedUsersList[i].contact) {

                if (sharedUser.contact.id === $scope.updateSharedUsersList[i].contact.id) {
                  $scope.updateSharedUsersList.splice(i, 1);
                }

              }
            }
          };

          $scope.saveTicketUpdate = function () {

            var currentOpenTab = $scope.currentOpenTab,
              ticketUpdateToSend = {
                type: currentOpenTab,
                shares: [],
                ticket: {id: $scope.ticketDetails.id}
              };

            if ($scope.ticketUpdate.products) {

              ticketUpdateToSend.products = $scope.ticketUpdate.products;

            } else if ($scope.ticketUpdate.services) {

              ticketUpdateToSend.services = $scope.ticketUpdate.services;

              for (var i = 0; i < ticketUpdateToSend.services.length; i++) {
                ticketUpdateToSend.services[i].quantity = $scope.ticketUpdate.services[i].quantity / 60;
              }

            } else if ($scope.ticketUpdate.note !== undefined) {

              ticketUpdateToSend.note = $scope.ticketUpdate.note;
              ticketUpdateToSend.attachments = [];

              for (var i = 0; i < $scope.ticketUpdate.attachments.length; i++) {
                ticketUpdateToSend.attachments.push({file: {id: $scope.ticketUpdate.attachments[i].id}})
              }

            }

            for (var i = 0; i < $scope.updateSharedUsersList.length; i++) {

              if ($scope.updateSharedUsersList[i].user) {

                ticketUpdateToSend.shares.push({user: {id: $scope.updateSharedUsersList[i].user.id}})

              } else if ($scope.updateSharedUsersList[i].contact) {

                ticketUpdateToSend.shares.push({contact: {id: $scope.updateSharedUsersList[i].contact.id}})
              }
            }

            if($scope.ticketUpdate.notifyTicketCreator){
              ticketUpdateToSend.notifyTicketCreator = $scope.ticketUpdate.notifyTicketCreator;
            }

            TicketsService.createTicketUpdate(ticketUpdateToSend, false, function () {

              $scope.$broadcast('setCreateUpdateFormToDefault');
              $scope.selectUpdateSharedUser = {};
              $scope.updateSharedUsersList = [];

            });
          };

          $scope.setEditExpenseId = function (id) {
            $scope.editExpenseId = id;
          };

          $scope.deleteForever = function () {
            TicketsService.deleteForever($scope.ticketDetails.id, function(){
              $state.go('tickets', {listType: $stateParams.listType});
            });
          };

        }]);
  }()
);

