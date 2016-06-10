'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsCtrl',
      ['$scope', 'TicketsService', '$stateParams', 'UsersService', 'CompaniesService', 'Downloader', '$rootScope',
        '$state', 'ProductsService', '$sce', '$timeout', 'quicktech.common.services.UserConfirmationsService',
        'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService',
        'quicktech.common.services.TicketsPermissionsService',
        function ($scope, TicketsService, $stateParams, UsersService, CompaniesService, Downloader, $rootScope, $state,
                  ProductsService, $sce, $timeout, UserConfirmationsService, UserNotificationService, SharedStateService,
                  TicketsPermissionsService) {

          var rightPanelSharedState = SharedStateService.getSharedState('rightPanel');
          rightPanelSharedState.companyId = '';

          $scope.TicketsPermissionsService = TicketsPermissionsService;
          $scope.allUpdatesLoaded = false;
          $scope.selectUpdateSharedUser = {};
          $scope.updateSharedUsersList = [];
          $scope.disabledWhenLoadAttachment = false;
          $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);

          UserNotificationService.show('Loading...');
          $scope.ticketDetails = TicketsService.getOne($stateParams.ticketId, $stateParams.listType, $scope, true, function (details) {

            $scope.ticketDetails = details;

            if (details.assignedUser && details.assignedUser.id && $stateParams.listType === 'unassigned' && !$scope.ticketClaimed) {
              $state.go('tickets', { listType: 'user' }).then(function () {
                $state.go('tickets.details', { ticketId: $scope.ticketDetails.id });
              });
            }

            if (!$scope.ticketClaimed && details.message !== undefined && (details.code === 400 || details.code === 403)) {
              if ($stateParams.ticketId) {
                $state.go('tickets', { listType: $stateParams.listType, ticketId: $stateParams.ticketId });
              } else {
                $state.go('tickets', { listType: $stateParams.listType });
              }
              return;
            }

            rightPanelSharedState.companyId = $scope.ticketDetails.company.id;
            rightPanelSharedState.createUserId = $scope.ticketDetails.createdUser.id;

            $timeout(function () {
              UserNotificationService.hide();
            }, 1500);

            var unreadUpdatesId = [];

            $scope.currentOpenTab = $scope.currentOpenTab || 'NOTE';

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
            }, 0)
          });

          $scope.setTicketUpdate = function (value) {
            $scope.ticketUpdate = value;
          };

          $scope.updateAndCloseTicket = function (form) {
            if (haveUnsavedUpdate($scope.ticketUpdate)) {
              var saveFailed = $scope.saveTicketUpdate(form);
              if (!saveFailed) {
                var unwatch = $scope.$watch('isSavingUpdate', function (value) {
                  if (value === false) {
                    closeTicket();
                    unwatch();
                  }
                });
              }
            } else {
              closeTicket()
            }
          };

          $scope.collapseTicket = function () {
            $state.go('tickets', { listType: $stateParams.listType });
          };

          $scope.claimTicket = function () {
            TicketsService.assignTo($scope.ticketDetails.id, $scope.currentUser.id, function () {
              $scope.ticketClaimed = true;
            });
          };

          $scope.openSetting = function () {
            $scope.isOpenSettings = true;
          };

          $scope.changeTicketPriority = function (priority) {
            if ($scope.ticketDetails.priorityLevel === priority) {
              UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” priority already set to ' + priority, true);
              return;
            }

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
                  $scope.uncheckTicket($scope.ticketDetails.id);
                  $state.go('tickets', { listType: $stateParams.listType });
                });

              } else {

                TicketsService.markAsSpam($scope.ticketDetails.id, function () {

                  UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as spam', true);
                  $scope.uncheckTicket($scope.ticketDetails.id);
                  $state.go('tickets', { listType: $stateParams.listType });
                });
              }
            });
          };

          $scope.restoreFromSpam = function () {
            TicketsService.restoreFromSpam($scope.ticketDetails.id, function () {
              $scope.uncheckTicket($scope.ticketDetails.id);
              $state.go('tickets', { listType: $stateParams.listType });
            });
          };

          $scope.moveToTrash = function (movedWay) {
            TicketsService.changeTrashFlag($scope.ticketDetails.id, movedWay, function () {
              if (movedWay) {
                UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been moved to Trash', true);
              }
              $scope.uncheckTicket($scope.ticketDetails.id);
              $state.go('tickets', { listType: $stateParams.listType });
            });
          };

          $scope.downloadAllAttachments = function () {
            Downloader.downloadTicketAttachments($scope.ticketDetails.id);
          };

          $scope.downloadAttachment = function (attachmentId, fileName) {
            Downloader.downloadFile(attachmentId, fileName)
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
                  $scope.selectUpdateSharedUser[sharedUser.user.id] = false;

                  if (sharedUser.user.id === $scope.ticketDetails.createdUser.id) {
                    $scope.ticketUpdate.notifyTicketCreator = false;
                  }

                  return;
                }

              } else if (sharedUser.contact && $scope.updateSharedUsersList[i].contact) {

                if (sharedUser.contact.id === $scope.updateSharedUsersList[i].contact.id) {
                  $scope.updateSharedUsersList.splice(i, 1);
                  $scope.selectUpdateSharedUser[sharedUser.contact.id] = false;
                  return;
                }

              }
            }
          };

          $scope.getTriedToSaveUpdate = function () {
            return $scope.triedToSaveUpdate;
          };

          $scope.setTriedToSaveUpdate = function (value) {
            $scope.triedToSaveUpdate = value;
          };

          $scope.saveTicketUpdate = function (form) {
            if (form.$valid) {
              $scope.isSavingUpdate = true;
              $scope.triedToSaveUpdate = false;

              var currentOpenTab = $scope.currentOpenTab,
                ticketUpdateToSend = {
                  type: currentOpenTab,
                  shares: [],
                  ticket: { id: $scope.ticketDetails.id }
                };

              if ($scope.ticketUpdate.products) {

                ticketUpdateToSend.products = $scope.ticketUpdate.products;

              } else if ($scope.ticketUpdate.services) {

                ticketUpdateToSend.services = angular.copy($scope.ticketUpdate.services);

                for (var i = 0; i < ticketUpdateToSend.services.length; i++) {
                  var date = new Date(ticketUpdateToSend.services[i].date);

                  ticketUpdateToSend.services[i].quantity = $scope.ticketUpdate.services[i].quantity / 60;
                  ticketUpdateToSend.services[i].date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                }

              } else if ($scope.ticketUpdate.note !== undefined) {

                ticketUpdateToSend.note = $scope.ticketUpdate.note;
                ticketUpdateToSend.attachments = [];

                for (var i = 0; i < $scope.ticketUpdate.attachments.length; i++) {
                  ticketUpdateToSend.attachments.push({ file: { id: $scope.ticketUpdate.attachments[i].id } })
                }

              }

              for (var i = 0; i < $scope.updateSharedUsersList.length; i++) {

                if ($scope.updateSharedUsersList[i].user) {

                  ticketUpdateToSend.shares.push({
                    user: { id: $scope.updateSharedUsersList[i].user.id },
                    itemOrder: $scope.updateSharedUsersList[i].itemOrder
                  });

                } else if ($scope.updateSharedUsersList[i].contact) {

                  ticketUpdateToSend.shares.push({
                    contact: { id: $scope.updateSharedUsersList[i].contact.id },
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
            } else {
              $scope.triedToSaveUpdate = true;
              return true;
            }
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

                $scope.uncheckTicket($scope.ticketDetails.id);
                $state.go('tickets', { listType: $stateParams.listType });
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

          $scope.getTriedToAddItem = function () {
            return $scope.triedToAddItem;
          };
          $scope.setTriedToAddItem = function (value) {
            $scope.triedToAddItem = value;
          };

          $scope.$on('ticket_is_not_available_anymore', function (event, data) {

            if (!$scope.ticketClaimed && data.ticketId === $scope.ticketDetails.id
              && (!data.ticketType || data.ticketType.toUpperCase() === $stateParams.listType.toUpperCase())) {
              $state.go('tickets', { listType: $stateParams.listType });
            }
          });

          $scope.$on('$destroy', function () {
            rightPanelSharedState.companyId = undefined;
            rightPanelSharedState.createUserId = undefined;
          });

          function closeTicket() {
            $scope.ticketClosing = true;
            TicketsService.changeStatus($scope.ticketDetails.id, 'COMPLETED', function () {
              UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as closed', true);
              $scope.uncheckTicket($scope.ticketDetails.id);
              $state.go('tickets', { listType: $stateParams.listType });
            });
          }

          function haveUnsavedUpdate(update) {
            return (
              !!update.note ||
              (update.products && update.products.length > 1) ||
              (update.services && update.services.length > 1) ||
              isNotEmpty(update.products) ||
              isNotEmpty(update.services)
            );
          }

          function isNotEmpty(object) {
            for (var prop in object) {
              if (object.hasOwnProperty(prop) && prop !== 'itemOrder' && prop !== '$$hashKey') {
                var item = object[prop];

                if (typeof item === 'object') {
                  if (isNotEmpty(item)) {
                    return true;
                  }
                } else if (item) {
                  return true;
                }
              }
            }

            return false;
          }

        }]);
  }()
);

