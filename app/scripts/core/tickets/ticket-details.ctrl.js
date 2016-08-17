'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsCtrl',
      ['$scope', 'TicketsService', '$stateParams', 'UsersService', 'CompaniesService', 'Downloader', '$rootScope',
        '$state', 'ProductsService', '$sce', '$timeout', 'quicktech.common.services.UserConfirmationsService',
        'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService',
        'quicktech.common.services.TicketsPermissionsService', 'DevicesService',
        'quicktech.common.services.RemoteAccessService', 'ServicesService',
        function ($scope, TicketsService, $stateParams, UsersService, CompaniesService, Downloader, $rootScope, $state,
                  ProductsService, $sce, $timeout, UserConfirmationsService, UserNotificationService, SharedStateService,
                  TicketsPermissionsService, DevicesService, RemoteAccessService, ServicesService) {

          var rightPanelSharedState = SharedStateService.getSharedState('rightPanel');
          rightPanelSharedState.companyId = '';

          $scope.TicketsPermissionsService = TicketsPermissionsService;
          $scope.allUpdatesLoaded = false;
          $scope.selectUpdateSharedUser = {};
          $scope.ticketSharedUsersList = [];
          $scope.disabledWhenLoadAttachment = false;
          $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);

          var params = $state.params.remoteParams;
          if (params && (params.deviceId || params.companyId || params.connectionDuration)) {

            $scope.ticketUpdate = { services: [{}] };
            $scope.ticketUpdate.services[0].quantity = params.connectionDuration ? params.connectionDuration.toFixed() : undefined;

            ServicesService.getAllByCompany($scope, params.companyId, function (resp) {
              $scope.ticketUpdate.services[0].item = resp.find(function (service) {
                  return service.name === 'Remote Service';
                }) || resp[0];
            });

            $scope.linkAgent($stateParams.ticketId, params.deviceId);

            $scope.currentOpenTab = 'SERVICE';
          }

          UserNotificationService.show('Loading...');
          $scope.ticketDetails = { id: $stateParams.ticketId };
          TicketsService.getOne($scope.ticketDetails, $scope, function (details) {

            $scope.ticketDetails = details;

            if (details.message !== undefined && (details.code === 400 || details.code === 403)) {
              $state.go('tickets', { listType: $stateParams.listType });
              return;
            }

            if (CompaniesService.getOneById($scope.ticketDetails.company.id).isDefault) {
              $rootScope.isRightPanelHidden = true;
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

            if ($scope.ticketDetails.updates) {
              for (var i = 0; i < $scope.ticketDetails.updates.length; i++) {

                if ($scope.ticketDetails.updates[i].unread) {
                  if (unreadUpdatesId.length === 0) {
                    $scope.firstUnreadUpdateId = $scope.ticketDetails.updates[i].id;
                  }

                  unreadUpdatesId.push($scope.ticketDetails.updates[i].id);
                }
              }
            }

            if (unreadUpdatesId.length > 0) {
              $timeout(function () {
                TicketsService.markUpdateAsRead($scope.ticketDetails.id, unreadUpdatesId)
              }, 1000);
            }

            DevicesService.getAgentsByCompany($scope, $scope.company.id, function (resp) {
              $scope.agentList = resp;
              if ($scope.ticketDetails.agent && !$scope.ticketAgent) {
                $scope.ticketAgent = resp.find(function (agent) {
                  return agent.id === $scope.ticketDetails.agent.deviceId;
                });
              }
            });


            $timeout(function () {
              $scope.$broadcast('ticketDetailsLoad');
            }, 0)
          });

          $scope.setTicketUpdate = function (value) {
            $scope.ticketUpdate = value;
          };

          $scope.updateAndCloseTicket = function (form) {
            if (hasUnsavedUpdate($scope.ticketUpdate)) {
              var saveFailed = $scope.saveTicketUpdate(form, true);
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

          $scope.$watch('ticketDetails.agent', function (value) {
            if (value && $scope.agentList) {
              $scope.ticketAgent = $scope.agentList.find(function (agent) {
                return agent.id === value.deviceId;
              });
            }
          });

          $scope.remoteAccess = function (connectionType) {
            DevicesService.createRemoteSession($scope.ticketAgent.id, $scope.company.id, connectionType, function (resp) {
              RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
            });
          };

          $scope.collapseTicket = function () {
            $state.go('tickets', { listType: $stateParams.listType });
          };

          $scope.claimTicket = function () {
            TicketsService.assignTo($scope.ticketDetails.id, $scope.currentUser.id);
            $scope.ticketSharedUsersList.push({ user: $scope.currentUser, notify: false });
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
              UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” status has been changed to "' + $scope.userReadable(status) + '"', true);
            });
          };

          $scope.moveIntoSpam = function () {
            var confirmMesage = 'Do you want to ' + ($scope.currentUser.isOwner ? 'mark' : 'report') + ' the ticket as spam?',
              confirmButton = 'Spam';

            UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {

              if ($scope.currentUser.isOwner) {

                TicketsService.markAsSpam($scope.ticketDetails.id, function () {

                  UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as spam', true);
                  $scope.uncheckTicket($scope.ticketDetails.id);
                });
              } else {

                TicketsService.reportAsSpam($scope.ticketDetails.id, function () {

                  UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been reported as spam', true);
                  $scope.uncheckTicket($scope.ticketDetails.id);
                });

              }
            });
          };

          $scope.restoreFromSpam = function () {
            TicketsService.restoreFromSpam($scope.ticketDetails.id, function () {
              $scope.uncheckTicket($scope.ticketDetails.id);
            });
          };

          $scope.moveToTrash = function (movedWay) {
            TicketsService.changeTrashFlag($scope.ticketDetails.id, movedWay, function () {
              if (movedWay) {
                UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been moved to Trash', true);
              }
              $scope.uncheckTicket($scope.ticketDetails.id);
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
            if ($scope.ticketDetails) {
              return $sce.trustAsHtml($scope.ticketDetails.note);
            } else {
              return '';
            }
          };

          $scope.getTriedToSaveUpdate = function () {
            return $scope.triedToSaveUpdate;
          };

          $scope.setTriedToSaveUpdate = function (value) {
            $scope.triedToSaveUpdate = value;
          };

          $scope.saveTicketUpdate = function (form, disableRestoringDefaults) {
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

              for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {

                var ticketSharedUser = $scope.ticketSharedUsersList[i];

                if (!ticketSharedUser.notify) {
                  continue;
                }

                if (ticketSharedUser.user) {

                  ticketUpdateToSend.shares.push({
                    user: { id: ticketSharedUser.user.id }
                  });

                } else if (ticketSharedUser.contact) {

                  ticketUpdateToSend.shares.push({
                    contact: { id: ticketSharedUser.contact.id }
                  })
                }
              }

              TicketsService.createTicketUpdate(ticketUpdateToSend, false, function () {

                $scope.isSavingUpdate = false;

                if (!disableRestoringDefaults) {
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
                }

                function setCreateUpdateFormToDefault() {
                  $scope.selectUpdateSharedUser = {};
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
            $scope.ticketSharedUsersList = getDefaultSharedList();

            for (var i = 0; i < shares.length; i++) {

              var share = shares[i],
                sharedUser = share.user || share.contact,
                isAlreadyAdded = $scope.ticketSharedUsersList.findIndex(function (shared) {
                  return (shared.user ? shared.user.id : shared.contact.id) === this.id;
                }, sharedUser);

              if (isAlreadyAdded === -1) {
                var itemForPush = share.user ? { user: share.user } : { contact: share.contact };
                itemForPush.notify = false;
                $scope.ticketSharedUsersList.push(itemForPush);
              }

              if (processedShares.indexOf(sharedUser.id) > -1) {
                continue;
              }

              processedShares.push(sharedUser.id);

              $scope.shares.push({
                name: share.user ? $scope.getUserName($scope.getUserById(share.user.id)) : $scope.getContactName(share.contact),
                title: $scope.getSharedTitle(share),
                avatarUrl: share.user ? $scope.getUserAvatarUrl($scope.getUserById(share.user.id)) : $scope.getContactAvatarUrl(share.contact)
              })
            }

          }, true);

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
            if (data.id === $scope.ticketDetails.id) {
              $state.go('tickets', { listType: $stateParams.listType });
            }
          });

          $scope.$on('$destroy', function () {
            rightPanelSharedState.companyId = undefined;
            rightPanelSharedState.createUserId = undefined;
          });

          $scope.toggleAllShared = function (isNotifyAll) {
            for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {
              $scope.ticketSharedUsersList[i].notify = isNotifyAll;
            }
          };

          function closeTicket() {
            $scope.ticketClosing = true;

            var recipientsIds = [];
            for (var i = 0; i < $scope.ticketSharedUsersList.length; i++) {
              var shared = $scope.ticketSharedUsersList[i];

              if (shared.notify) {
                recipientsIds.push(shared.user ? shared.user.id : shared.contact.id);
              }
            }

            TicketsService.changeStatus($scope.ticketDetails.id, 'COMPLETED', function () {
              UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as closed', true);
              $scope.uncheckTicket($scope.ticketDetails.id);
            }, recipientsIds);
          }

          function hasUnsavedUpdate(update) {
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

          function getDefaultSharedList() {
            var result = [];

            if ($scope.user) {
              result.push({ user: $scope.user, notify: false });
            }

            if ($scope.assignedUser && $scope.user && $scope.user.id !== $scope.assignedUser.id) {
              result.push({ user: $scope.assignedUser, notify: false });
            }

            return result;
          }

        }]);
  }()
);

