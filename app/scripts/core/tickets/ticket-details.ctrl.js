'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsCtrl',
      ['$scope', 'TicketsService', '$stateParams', 'UsersService', 'CompaniesService', 'Downloader',
        '$state', 'ProductsService', '$sce', '$timeout', 'quicktech.common.services.UserConfirmationsService',
        'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService',
        function ($scope, TicketsService, $stateParams, UsersService, CompaniesService, Downloader, $state,
                  ProductsService, $sce, $timeout, UserConfirmationsService, UserNotificationService, SharedStateService) {

          var rightPanelSharedState = SharedStateService.getSharedState('rightPanel');
          rightPanelSharedState.companyId = '';

          $scope.allUpdatesLoaded = false;
          $scope.selectUpdateSharedUser = {};
          $scope.updateSharedUsersList = [];
          $scope.disabledWhenLoadAttachment = false;
          $scope.productCategories = ProductsService.getCategories($scope);
          //$scope.autocompleteData = ProductsService.getFullListForAutocomplete();
          $scope.autocompleteData = getFullListForAutocomplete();

          UserNotificationService.show('Loading...');
          $scope.ticketDetails = TicketsService.getOne($stateParams.ticketId, $stateParams.listType, $scope, true, function (details) {

            if (details.message !== undefined && (details.code === 400 || details.code === 403)) {
              $state.go('tickets', {listType: $stateParams.listType});
              return;
            }

            rightPanelSharedState.companyId = $scope.ticketDetails.company.id;
            rightPanelSharedState.createUserId = $scope.ticketDetails.createdUser.id;

            $timeout(function () {
              UserNotificationService.hide();
            }, 1500);

            var unreadUpdatesId = [];

            $scope.currentOpenTab = 'NOTE';

            $scope.user = UsersService.getOneById($scope.ticketDetails.createdUser.id);
            $scope.company = CompaniesService.getOneById($scope.ticketDetails.company.id);

            if ($scope.ticketDetails.assignPerformer && $scope.ticketDetails.assignPerformer.id) {
              $scope.assignPerformer = UsersService.getOneById($scope.ticketDetails.assignPerformer.id);
            }

            if ($scope.ticketDetails.assignedUser && $scope.ticketDetails.assignedUser.id) {
              $scope.assignedUser = UsersService.getOneById($scope.ticketDetails.assignedUser.id);
            }

            for (var i = 0; i < $scope.ticketDetails.updates.length; i++) {

              if ($scope.ticketDetails.updates[i].unread) {
                if (unreadUpdatesId.length === 0) {
                  $scope.firstUnreadUpdateId = $scope.ticketDetails.updates[i].id;
                }

                unreadUpdatesId.push($scope.ticketDetails.updates[i].id);
              }
            }

            if (unreadUpdatesId.length > 0) {
              $timeout(function () {
                TicketsService.markUpdateAsRead($scope.ticketDetails.id, unreadUpdatesId)
              }, 1000);
            }


            $timeout(function () {
              $scope.$broadcast('ticketDetailsLoad');
              $scope.showTicketTags = true;
            }, 0)
          });

          $scope.setTicketTags = function () {

            $scope.ticketTags = {};

            for (var j = 0; j < $scope.ticketDetails.tags.length; j++) {
              $scope.ticketTags[$scope.ticketDetails.tags[j].id] = true;
            }
          };

          $scope.setTicketUpdate = function (value) {
            $scope.ticketUpdate = value;
          };

          $scope.updateAndCloseTicket = function () {
            TicketsService.changeStatus($scope.ticketDetails.id, 'COMPLETED', function () {
              UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as closed', true);
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
            });
          };

          $scope.openSetting = function () {
            $scope.isOpenSettings = true;
          };

          $scope.changeTicketPriority = function (priority) {
            TicketsService.changePriority($scope.ticketDetails.id, priority, function () {
              UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” priority has been changed to ' + priority, true);
            });
          };

          $scope.changeTicketStatus = function (status) {
            TicketsService.changeStatus($scope.ticketDetails.id, status, function () {
              UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” status has been changed to "' + $scope.ticketStatus[status] + '"', true);
            });
          };

          $scope.moveIntoSpam = function () {
            var confirmMesage = 'Do you want to ' + ($scope.currentUser.role === 'USER' ? 'report' : 'mark') + ' the ticket as spam?',
              confirmButton = 'Spam';

            UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {

              if ($scope.currentUser.role === "USER") {

                TicketsService.reportAsSpam($scope.ticketDetails.id, function () {

                  UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been reported as spam', true);
                  $state.go('tickets', {listType: $stateParams.listType});
                });

              } else {

                TicketsService.markAsSpam($scope.ticketDetails.id, function () {

                  UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as spam', true);
                  $state.go('tickets', {listType: $stateParams.listType});
                });
              }
            });
          };

          $scope.restoreFromSpam = function () {
            TicketsService.restoreFromSpam($scope.ticketDetails.id);
          };

          $scope.moveToTrash = function (movedWay) {
            TicketsService.changeTrashFlag($scope.ticketDetails.id, movedWay, function () {
              if (movedWay) {
                UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been moved to Trash', true);
              }
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

              return user.company.id === $scope.currentUser.company.id ? 'Team Member' : 'Client User';

            } else {

              return 'Vendor';
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
                  $scope.selectUpdateSharedUser[sharedUser.user.id ] = false;

                  if (sharedUser.user.id === $scope.ticketDetails.createdUser.id) {
                    $scope.ticketUpdate.notifyTicketCreator = false;
                  }

                  return;
                }

              } else if (sharedUser.contact && $scope.updateSharedUsersList[i].contact) {

                if (sharedUser.contact.id === $scope.updateSharedUsersList[i].contact.id) {
                  $scope.updateSharedUsersList.splice(i, 1);
                  $scope.selectUpdateSharedUser[sharedUser.contact.id ] = false;
                  return;
                }

              }
            }
          };

          $scope.saveTicketUpdate = function () {

            $scope.isSavingUpdate = true;

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
                var date = new Date(ticketUpdateToSend.services[i].date);

                ticketUpdateToSend.services[i].quantity = $scope.ticketUpdate.services[i].quantity / 60;
                ticketUpdateToSend.services[i].date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

                ticketUpdateToSend.shares.push({
                  user: {id: $scope.updateSharedUsersList[i].user.id},
                  itemOrder: $scope.updateSharedUsersList[i].itemOrder
                });

              } else if ($scope.updateSharedUsersList[i].contact) {

                ticketUpdateToSend.shares.push({
                  contact: {id: $scope.updateSharedUsersList[i].contact.id},
                  itemOrder: $scope.updateSharedUsersList[i].itemOrder
                })
              }
            }

            if ($scope.ticketUpdate.notifyTicketCreator) {
              ticketUpdateToSend.notifyTicketCreator = $scope.ticketUpdate.notifyTicketCreator;
            }

            TicketsService.createTicketUpdate(ticketUpdateToSend, false, function () {

              $scope.isSavingUpdate = false;

              switch (ticketUpdateToSend.type) {

                case 'NOTE':

                  UserNotificationService.show('New ticket update containing a note has been posted', true);
                  setCreateUpdateFormToDefault();
                  return;

                case 'SERVICE':
                  if (ticketUpdateToSend.services.length > 1) {
                    UserNotificationService.show('New ticket update containing ' + ticketUpdateToSend.services.length + ' services has been posted', true);
                  } else {
                    UserNotificationService.show('New ticket update containing a service has been posted', true);
                  }
                  setCreateUpdateFormToDefault();
                  return;

                case 'PRODUCT':
                  if ($scope.ticketUpdate.products.length > 1) {
                    UserNotificationService.show('New ticket update containing ' + ticketUpdateToSend.products.length + ' products has been posted', true);
                  } else {
                    UserNotificationService.show('New ticket update containing a product has been posted', true);
                  }
                  setCreateUpdateFormToDefault();
                  return;
              }

              function setCreateUpdateFormToDefault() {
                $scope.selectUpdateSharedUser = {};
                $scope.updateSharedUsersList = [];
                $scope.$broadcast('setCreateUpdateFormToDefault');
              }
            });
          };

          $scope.setEditExpenseId = function (id) {
            $scope.editExpenseId = id;
          };

          $scope.deleteForever = function () {
            var confirmMesage = 'The ticket will become inaccessible. Continue with permanent deletion?',
              confirmButton = 'Delete';

            UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
              TicketsService.deleteForever($scope.ticketDetails.id, function () {

                UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been deleted', true);

                $state.go('tickets', {listType: $stateParams.listType});
              });
            });
          };

          $scope.$watch('ticketDetails.shares', function (shares) {

            $scope.shares = [];

            if (!shares) {
              return;
            }

            var processedShares = [];

            for (var i = 0; i < shares.length; i++) {

              var share = shares[i],
                id = share.user ? share.user.id : share.contact.id;


              if (processedShares.indexOf(id) > -1) {
                continue;
              }

              processedShares.push(id);

              $scope.shares.push({
                name: share.user ? $scope.getUserName($scope.getUserById(share.user.id)) : $scope.getContactName(share.contact),
                title: $scope.getSharedTitle(share),
                avatarUrl: share.user ? $scope.getUserAvatarUrl($scope.getUserById(share.user.id)) : $scope.getContactAvatarUrl(share.contact)
              })
            }

          });

          $scope.addTicketOwnerToUpdate = function () {

            if (!$scope.ticketDetails && !$scope.ticketDetails.createdUser) {
              return;
            }

            var ticketOwner = {
              user: $scope.ticketDetails.createdUser.staticCopy()
            };

            var firstSharedUser = $scope.updateSharedUsersList[0],
              createdUserId = $scope.ticketDetails.createdUser.id

            if ($scope.ticketUpdate.notifyTicketCreator) {

              if (firstSharedUser && firstSharedUser.user.id === createdUserId) {
                return;
              }

              $scope.updateSharedUsersList.unshift(ticketOwner);

            } else {

              if (firstSharedUser && firstSharedUser.user.id !== createdUserId) {
                return;
              }

              $scope.updateSharedUsersList.shift();

            }
          };

          $scope.filterCurrentUser = function (item) {
            if (!item.user) {
              return true;
            }
            return !(item.user.id === $scope.currentUser.id);
          };

          $scope.getLengthSharedUsers = function (sharedUsers) {

            for (var i = 0; i < sharedUsers.length; i++) {
              if (sharedUsers[i].user && sharedUsers[i].user.id === $scope.currentUser.id) {
                return sharedUsers.length - 1;
              }
            }

            return sharedUsers.length;
          };

          $scope.$on('ticket_is_not_available_anymore', function (event, data) {

            if (data.ticketId === $scope.ticketDetails.id
              && (!data.ticketType || data.ticketType.toUpperCase() === $stateParams.listType.toUpperCase()))
              $state.go('tickets', {listType: $stateParams.listType});
          });

          $scope.$on('$destroy', function () {
            rightPanelSharedState.companyId = undefined;
            rightPanelSharedState.createUserId = undefined;
          });

          function getFullListForAutocomplete() {
            return [{
              "id": "f9f808cf-d0c2-4978-846b-168e3c3ea7f2",
              "name": "Other",
              "deletedAt": null,
              "products": [{
                "versionedId": {"id": "195a38b0-b572-4b2e-a22b-2aa1f8ae4351", "version": 0},
                "createdAt": 1449795006286,
                "updatedAt": null,
                "deletedAt": null,
                "code": 3,
                "name": "Scanner",
                "sale": 120
              }, {
                "versionedId": {"id": "dde2bc9e-b521-46ee-80f9-d9992a174d43", "version": 0},
                "createdAt": 1449795006894,
                "updatedAt": null,
                "deletedAt": null,
                "code": 4,
                "name": "keyboard",
                "sale": 45
              }, {
                "versionedId": {"id": "f6307ff3-9427-49f6-9519-bd20253ab240", "version": 0},
                "createdAt": 1449795007374,
                "updatedAt": null,
                "deletedAt": null,
                "code": 5,
                "name": "Xerox",
                "sale": 300
              }]
            }, {
              "id": "e9ff9971-4e7e-43af-881a-e49b10aad247",
              "name": "SSD",
              "deletedAt": null,
              "products": [{
                "versionedId": {"id": "6a89cab0-2368-4229-97fe-0d5365423708", "version": 0},
                "createdAt": 1449795005285,
                "updatedAt": null,
                "deletedAt": null,
                "code": 2,
                "name": "A-Data XPG SX900 256GB 2.5 SATAIII MLC",
                "sale": 120
              }, {
                "versionedId": {"id": "ab305f40-0239-4b73-a951-c95929fe51e5", "version": 0},
                "createdAt": 1449795010363,
                "updatedAt": null,
                "deletedAt": null,
                "code": 10,
                "name": "Crucial MX200 500GB 2.5SATAIII MLC",
                "sale": 250
              }, {
                "versionedId": {"id": "e26cd29c-1fd5-4775-a0b9-ea6364321182", "version": 0},
                "createdAt": 1449795010101,
                "updatedAt": null,
                "deletedAt": null,
                "code": 9,
                "name": "Intel 730 480GB 2.5 SATAIII MLC ",
                "sale": 450
              }]
            }, {
              "id": "5ec1e5b8-9161-428e-a774-0b2d30ac6cf4",
              "name": "Printers",
              "deletedAt": null,
              "products": [{
                "versionedId": {"id": "dec0776a-4ec8-480a-b2c6-a135f0902d2f", "version": 0},
                "createdAt": 1449795004265,
                "updatedAt": null,
                "deletedAt": null,
                "code": 1,
                "name": "Printer",
                "sale": 150
              }]
            }, {
              "id": "84f06a4e-6591-4d18-847d-4d73c538cfaa",
              "name": "Memory Cards",
              "deletedAt": null,
              "products": [{
                "versionedId": {"id": "022baa8b-aed7-4c2b-a539-fe4eb6f73826", "version": 0},
                "createdAt": 1449795009350,
                "updatedAt": null,
                "deletedAt": null,
                "code": 8,
                "name": "Silicon Power Touch 830 32GB",
                "sale": 59
              }, {
                "versionedId": {"id": "4d1b331a-7e2e-4ea9-9d41-b7f53e14b29f", "version": 0},
                "createdAt": 1449795008840,
                "updatedAt": null,
                "deletedAt": null,
                "code": 7,
                "name": "Kingston DataTraveler SE9 16GB",
                "sale": 84
              }, {
                "versionedId": {"id": "dc56fffe-30b1-4337-b002-a5bf6e786969", "version": 0},
                "createdAt": 1449795008293,
                "updatedAt": null,
                "deletedAt": null,
                "code": 6,
                "name": "Transcend JetFlash 330 16GB",
                "sale": 80
              }]
            }]
          }

        }]);
  }()
);

