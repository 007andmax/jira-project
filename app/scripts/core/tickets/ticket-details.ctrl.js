'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsCtrl',
      ['$scope', 'TicketsService', '$stateParams', 'UsersService', 'CompaniesService', 'Downloader', '$rootScope',
        '$state', 'ProductsService', '$sce', '$timeout', 'quicktech.common.services.UserConfirmationsService',
        'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService',
        'quicktech.common.services.TicketsPermissionsService', 'DevicesService',
        'quicktech.common.services.RemoteAccessService', 'ServicesService', 'quicktech.common.services.ticketMobileSettings', 'TagsService',
        function ($scope, TicketsService, $stateParams, UsersService, CompaniesService, Downloader, $rootScope, $state,
                  ProductsService, $sce, $timeout, UserConfirmationsService, UserNotificationService, SharedStateService,
                  TicketsPermissionsService, DevicesService, RemoteAccessService, ServicesService, ticketMobileSettings, TagsService) {

          var rightPanelSharedState = SharedStateService.getSharedState('rightPanel'),
              ticketsSharedState = SharedStateService.getSharedState('ticketsHeader');
          rightPanelSharedState.companyId = '';

          var ticketMobileSettings = ticketMobileSettings;


          $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
          $scope.TicketsPermissionsService = TicketsPermissionsService;
          $scope.allUpdatesLoaded = false;
          $scope.selectUpdateSharedUser = {};
          $scope.ticketSharedUsersList = [];
          $scope.disabledWhenLoadAttachment = false;
          $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);

          $scope.tagColors = TagsService.getColors();
          var today = new Date();
          $scope.date = today;
          $scope.hour = today.getHours();
          $scope.minute = Math.floor(today.getMinutes() / 5) * 5;

          $timeout(function() {
            ticketMobileSettings.data = $scope;
          }, 3000);


          $scope.getTicketStatus = function(ticket, arg) {
            var status;
            if(ticket.assignedUserId === null) {
              status = 'unassigned';
            } else if(ticket.status === 'COMPLETED') {
              status = 'completed';
            } else if(ticket.status === 'IN_PROGRESS') {
              status = 'inProgress';
            } else if(ticket.status === 'ON_HOLD') {
              status = 'onHold';
            }
            return status;
          };




          // console.log($scope.usersCurrentCompany, "SCOPESCOPESCOPE");


          $rootScope.toggleUpdateWindow = function(state) {
            $rootScope.isMobileUpdateShown = state;

            $rootScope.isTicketEditOpened = state;

            if (!state) {
              $scope.editExpense = null;
            } else {
              $scope.editExpense = $scope.editExpense || false;
            }
          }

          $rootScope.closeTicket = function() {
            window.location.href = window.location.href.split('/').slice(0, -1).join('/');
          }

          $rootScope.isTicketOpened = true;

          $scope.$on('$destroy', function() {
            $rootScope.isTicketOpened = false;
          })

          $scope.agents = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id).filter(function(user) {
            return !user.deletedAt;
          });




          $scope.usersToWatch = $scope.agents.slice();

          $scope.editForms = {};

          $scope.setEditForm = function(form, name) {
            $scope.editForms[name] = form;
          }


          var params = $state.params.remoteParams;
          var isFromRemote = params && (params.deviceId || params.companyId || params.connectionDuration);
          if (isFromRemote) {

            $scope.ticketUpdate = { services: [{}] };
            $scope.ticketUpdate.services[0].quantity = params.connectionDuration ? params.connectionDuration.toFixed() : undefined;

            if (params.deviceId) {
              $scope.linkAgent($stateParams.ticketId, params.deviceId);
            }

            $scope.currentOpenTab = 'SERVICE';
          }

          UserNotificationService.show('Loading...');
          if($state.includes('tickets') && !$state.includes('companyProfile')) {
            $scope.ticketDetails = { id: $stateParams.ticketId };
          } else if($state.includes('companyProfile')) {
            $scope.ticketDetails = { id: ticketsSharedState.openTicketId };
          }
          //$scope.ticketDetails = { id: $stateParams.ticketId };

          $scope.$watch('ticketDetails', function(val) {
          })
          TicketsService.getOne($scope.ticketDetails, $scope, function (details) {

            $scope.ticketDetails = details;

            if (isFromRemote) {
              ServicesService.getAllByCompany($scope, details.company.id, function (resp) {
                $scope.ticketUpdate.services[0].item = resp.find(function (service) {
                    return service.name.toLowerCase() === 'remote service';
                  }) || resp[0];
              });
            }

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

            $scope.isEmail = $scope.ticketDetails.ticketSource === 'FROM_EMAIL';

            // console.log(CompaniesService.getAllCompanies())

            // $scope.companyScope = [
            //   "52dfe577-a8ac-4eb7-8a9f-0fed029c6ce1",
            //   "c7cccdb1-e8bd-41d3-9b83-c8d188266ed8",
            //   "36d5bfd5-b856-42be-aa20-b3babd17a8f5",
            //   "fdadb2df-ed3d-4e28-b41e-741617b7ffa6",
            //   "844061ac-7570-433c-9dcb-3663ebf0725e"
            // ]

            if ($scope.isEmail) {
              setUserCompanies();
            }

            $scope.toggleNoteUpdate = function(ticketUpdate) {
              if (window.innerWidth <= 414) {
                $scope.editExpense = {
                  note: ticketUpdate
                }

                $scope.toggleUpdateWindow(true)
              } else {
                if (ticketUpdate.id !== $scope.isNoteUpdating) {
                  $scope.prevNote = ticketUpdate.note;
                  $scope.isNoteUpdating = ticketUpdate.id;
                }
              }



            }

            $scope.deleteExpence = function (ticketUpdate, productExpense, serviceExpence) {
              var type;
              if (!productExpense.length) {
                type = "SERVICE"
              } else {
                type = "PRODUCT"
              }

              // deleteTicketExpense(ticketId, updateId, products, services, callback)







              switch (type) {



                case 'SERVICE':
                  var confirmMesage = 'Are you sure you want to remove a service?',
                    userPopUpMessage,
                    confirmButton = 'Delete';

                  UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                    TicketsService.deleteTicketExpense($scope.ticketDetails.id, ticketUpdate.id, productExpense, serviceExpence, function(resp) {

                      productExpense.forEach(function(id) {
                        ticketUpdate.products = ticketUpdate.products.filter(function(product) {
                          return product.id !== id;
                        })
                      });

                      serviceExpence.forEach(function(id) {
                        ticketUpdate.services = ticketUpdate.services.filter(function(service) {
                          return service.id !== id;
                        })
                      })
                    })
                  });
                  return;

                case 'PRODUCT':
                  var confirmMesage = 'Are you sure you want to remove a product?',
                    userPopUpMessage,
                    confirmButton = 'Delete'
                  UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                    TicketsService.deleteTicketExpense($scope.ticketDetails.id, ticketUpdate.id, productExpense, serviceExpence, function(resp) {

                      productExpense.forEach(function(id) {
                        ticketUpdate.products = ticketUpdate.products.filter(function(product) {
                          return product.id !== id;
                        })
                      });

                      serviceExpence.forEach(function(id) {
                        ticketUpdate.services = ticketUpdate.services.filter(function(service) {
                          return service.id !== id;
                        })
                      })
                    })
                  });
                  return;
              }
            };

            $scope.cancelNoteUpdate = function(ticketUpdate) {
              $scope.isNoteUpdating = false;

              ticketUpdate.note = $scope.prevNote;
            }

            $scope.updateNoteRequest = function(updateId, note, callback) {
              TicketsService.updateNote($scope.ticketDetails.id, updateId, note, function(resp) {
                console.log('note updated', resp);
                $scope.isNoteUpdating = false;
                if (callback) callback()
              })
            };

// <<<<<<< HEAD
            // $scope.deleteExpence = function(ticketUpdate, productExpense, serviceExpence) {
            //   // console.log($scope.ticketDetails.id, ticketUpdate, serviceExpence, productExpense)
            //
            //   // deleteTicketExpense(ticketId, updateId, products, services, callback)
            //   TicketsService.deleteTicketExpense($scope.ticketDetails.id, ticketUpdate.id, productExpense, serviceExpence, function(resp) {
            //
            //     // console.log('I SHOULD DELETEEEEEE')
            //     productExpense.forEach(function(id) {
            //       ticketUpdate.products = ticketUpdate.products.filter(function(product) {
            //         return product.id !== id;
            //       })
            //     });
            //
            //     serviceExpence.forEach(function(id) {
            //       ticketUpdate.services = ticketUpdate.services.filter(function(service) {
            //         return service.id !== id;
            //       })
            //     })
            //   })
            // }
// =======
//
// >>>>>>> mobile-version

            function setUserCompanies() {
              // $scope.userCompanies = $scope.ticketDetails.userCompanies
              //   .filter(function(id) {
              //     return id !== $scope.company.id;
              //   })
              //   .map(function(id) {
              //     var cmpData = CompanyService.getOnyById(id);
              //
              //     return {
              //       id: id,
              //       name: cmpData
              //     }
              //   })

              if (!$scope.ticketDetails.userCompanies) {
                var ticket = TicketsService.getTicketFromStorage($scope.ticketDetails.id);
                $scope.ticketDetails.userCompanies = ticket.userCompanies;
              }
              $scope.userCompanies = $scope.ticketDetails.userCompanies.map(function(id) {
                  var cmpData = CompaniesService.getOneById(id);

                  if (!cmpData) return {};

                  return {
                    id: id,
                    name: cmpData.name
                  }
                }).filter(function(el) {
                  return el.name;
                })

            }

            $scope.$watch("ticketDetails.attachments.length", function() {
              $scope.reducedAttachmentsTypes = $scope.ticketDetails.attachments.reduce(function(acc, el) {
                var type = el.file.name.match($scope.attachmentTypePattern)[0] || $scope.attachmentType[el.file.contentType]
                console.log(type, el, 'el')
                if (!~acc.indexOf(type)) {
                  acc.push(type);
                }

                return acc;
              }, []);
            })


            $scope.$watch('attachmentsToDelete', function(val) {
              if (val) {
                $rootScope.attachmentsToDelete = null;

                $scope.ticketDetails.attachments = $scope.ticketDetails.attachments.filter(function(el) {
                  return !~val.findIndex(function(attachment) {
                    return attachment.id === el.id;
                  });
                })
              }
            })




            $scope.setUserCompany = function(id) {
              var ticket = $scope.ticketDetails;

              var editedTicket = {
                id: ticket.id,
                subject: ticket.subject,
                note: ticket.note,
                companyId: id
              };

              var oldCompanyId = $scope.ticketDetails.company.id || $scope.ticketDetails.companyId;
              rightPanelSharedState.companyId = id;
              CompaniesService.getCompanyData($scope, id, companyDataRequestCallback);

              TicketsService.save(editedTicket, function(resp) {
                $rootScope.changeTicketCompany = {
                  id: ticket.id,
                  companyId: id,
                  oldCompanyId: oldCompanyId
                }
              })

              // $scope.saveEditedTicket = function (form) {
              //   if (form.$valid) {
              //     $scope.disabledSaveButton = true;
              //     $scope.tryToSaveTicket = false;
              //     $scope.editedTicket.note = $scope.editedTicket.note || '';
              //     TicketsService.save($scope.editedTicket, function () {
              //       $scope.editingTicket = false;
              //     })
              //   } else {
              //     $scope.tryToSaveTicket = true;
              //   }
              // };
            }

            $scope.currentOpenTab = $scope.currentOpenTab || 'NOTE';

            $scope.user = UsersService.getOneById($scope.ticketDetails.createdUser.id);
            CompaniesService.getCompanyData($scope, $scope.ticketDetails.company.id, companyDataRequestCallback);


            function companyDataRequestCallback(resp) {
              $scope.company = resp;
              $scope.company.isDefault = $scope.ticketDetails.company.isDefault;
              $scope.companyAddress = resp.addresses[0] || {};

              if ($scope.isEmail) {
                setUserCompanies();
                $scope.userCompanies = $scope.userCompanies.filter(function(cmp) {
                  return cmp.id !== resp.id;
                })
              }

              if ($scope.companyAddress.phoneNumbers && $scope.companyAddress.phoneNumbers.length) {
                $scope.companyPhoneNumber = $scope.companyAddress.phoneNumbers[0].number;
              }
            }

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

            DevicesService.getAgentsByCompany($scope, $scope.ticketDetails.company.id, function (resp) {
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
            console.log($scope.ticketUpdate, '$scope.ticketUpdate');
          };

          $scope.setMobileForm = function(form) {
            // console.log('SETMOBILE FORM', form)
            $scope.mobileUpdateForm = form;
          }

          $scope.$watch('ticketUpdate.products[1]', function(val) {
          })

          $scope.updateAndCloseTicket = function (form) {
// <<<<<<< HEAD
            // var saveFailed = $scope.saveTicketUpdate(form, true, closeTicket, null, null, true);
            // if (hasUnsavedUpdate($scope.ticketUpdate)) {
            //
            //   if (!saveFailed) {
            //     var unwatch = $scope.$watch('isSavingUpdate', function (value) {
            //       if (value === false) {
            //         closeTicket();
            //         unwatch();
            //       }
            //     });
            //   }
            // } else {
            //   closeTicket()
            // }

            if (!form) form = $scope.mobileUpdateForm;
            var saveFailed = $scope.saveTicketUpdate({$valid: true}, true, closeTicket, null, null, true);
// =======


            // if (hasUnsavedUpdate($scope.ticketUpdate)) {
            //
            //   if (!saveFailed) {
            //     var unwatch = $scope.$watch('isSavingUpdate', function (value) {
            //       if (value === false) {
            //         closeTicket();
            //         unwatch();
            //       }
            //     });
            //   }
            // } else {
            //   closeTicket()
            // }
// >>>>>>> mobile-version
          };

          $scope.$watch('ticketDetails.agent', function (value) {
            if (value && $scope.agentList) {
              $scope.ticketAgent = $scope.agentList.find(function (agent) {
                return agent.id === value.deviceId;
              });
            } else {
              $scope.ticketAgent = null;
            }
          });

          $scope.remoteAccess = function (connectionType) {
            DevicesService.createRemoteSession($scope.ticketAgent.id, $scope.company.id, connectionType, function (resp) {
              RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
            }, $scope.ticketDetails.id);
          };

          $scope.toggleTicketsList = function () {
            $scope.$broadcast('toggleTicketsList');
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

          $scope.markAsOpen = function () {
            TicketsService.changeStatus($scope.ticketDetails.id, 'IN_PROGRESS', function (resp) {

              if (resp.code == 403) {

                var user = UsersService.getOneById(resp.message);
                alert($scope.getUserName(user) + ' locked this ticket to create invoice!');
                return;
              }

              UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as open', true);
              $scope.uncheckTicket($scope.ticketDetails.id);

              $scope.$apply()
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

          $scope.toggleFullSharedUsers = function () {
            if ($scope.isFullSharedUserShow || $scope.shares.length) {
              $scope.isFullSharedUserShow = !$scope.isFullSharedUserShow;
            }
          };

          $scope.openedTab = function (tabName) {
            if ($scope.currentOpenTab === tabName) {
              return;
            }

            var ticketUpdate = $scope.ticketUpdate;
            if (ticketUpdate.note
              || (ticketUpdate.attachments && ticketUpdate.attachments.length)
              || (ticketUpdate.products && ticketUpdate.products.length > 1)
              || (ticketUpdate.services && ticketUpdate.services.length > 1)
            ) {
              var message = 'Do you want to leave this tab? All entered information will be lost';
              UserConfirmationsService.show(message, 'OK').then(function () {
                $scope.currentOpenTab = tabName;
              });
            } else {
              $scope.currentOpenTab = tabName;
            }
          };

          $scope.isCurrentTab = function(tab) {
            return $scope.currentOpenTab === tab;
          }

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

          $scope.haveAttachments = function() {
            return $scope.ticketUpdate && $scope.ticketUpdate.attachments && $scope.ticketUpdate.attachments.length > 0;
          }

          $scope.haveNote = function() {
            return $scope.ticketUpdate && $scope.ticketUpdate.note;
          }

          $scope.setModel = function(model) {
            $scope.productExpenseModel = model;
          }

          $scope.getFormatedTime = function(time) {
            var date = new Date(time);
            var currentTime = {
              hour: date.getHours() >= 13 ? date.getHours() - 13 : date.getHours(),
              minute: date.getMinutes(),
              time: date.getHours() >= 12 ? 'pm' : 'am'
            };
            console.log(date, currentTime, '123251235');
            return currentTime.hour + ':' + currentTime.minute + ' ' + currentTime.time
          };




          $scope.getTriedToSaveUpdate = function () {
            return $scope.triedToSaveUpdate;
          };

          $scope.setTriedToSaveUpdate = function (value) {
            $scope.triedToSaveUpdate = value;
          };

          $scope.saveUpdateProduct = function (form, item, callback) {
            // console.log(item, "IIIIII")
            if (form.$valid) {
              var product = item.item;
              var editVersionedId = product.versionedId;

              $scope.disabledSave = true;

              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: item.ticketUpdateId,
                productExpense: {

                  id: item.id,
                  item: {
                    sale: product.sale,
                    versionedId: { id: editVersionedId.id, version: editVersionedId.version },
                    cost: product.cost
                  },
                  serialNumber: item.serialNumber,
                  quantity: item.quantity,
                  date: item.date,
                  discountAmount: item.discountAmount,
                  discountType: 'PERCENT'
                }
              }, function () {
                UserNotificationService.show('The ticket update containing a product has been modified', true);
                if (callback) callback();
                $scope.setEditExpenseId();


              })
            } else {
              $scope.triedToSaveProduct = true;
            }

          };

          $scope.saveUpdateService = function (form, item, callback) {

            if (form.$valid) {
              var editVersionedId;
              if (typeof item.item.name === 'object') {
                editVersionedId = item.item.name.versionedId;
              } else {
                editVersionedId = item.item.versionedId;
              }


              // console.log(item, "ITEM")

              $scope.disabledSave = true;

              var serviceDate = new Date(item.date);

              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: item.ticketUpdateId,
                serviceExpense: {

                  id: item.id,
                  item: { versionedId: { id: editVersionedId.id, version: editVersionedId.version } },
                  description: item.description,
                  quantity: item.quantity / 60,
                  date: new Date(serviceDate.getFullYear(), serviceDate.getMonth(), serviceDate.getDate()),
                  discountAmount: item.discountAmount,
                  discountType: "PERCENT"

                }
              }, function () {
                UserNotificationService.show('The ticket update containing a service has been modified', true);

                $scope.setEditExpenseId();
                if (callback) callback()

              })
            } else {
              $scope.triedToSaveService = true;
            }
          };

          $scope.saveTicketUpdate = function (form, disableRestoringDefaults, callback, isExpenseEdit, value, close) {
            if (isExpenseEdit) {
              if (isExpenseEdit.note) {
                var note = isExpenseEdit.note;

                $scope.updateNoteRequest(note.id, note.note, callback);
              } else if (isExpenseEdit.product) {
                $scope.saveUpdateProduct($scope.editForms.editProductForm, isExpenseEdit.product, callback);
              } else if (isExpenseEdit.service) {

                $scope.saveUpdateService($scope.editForms.editServiceForm, isExpenseEdit.service, callback);
              }
              return;
            }



            if ($scope.ticketUpdate && $scope.ticketUpdate.services) {
              $scope.ticketUpdate.services = $scope.ticketUpdate.services.map(function(el) {
                if (el.item && typeof el.item.name === 'object') {
                  el.item = el.item.name;
                }
                return el;
              })
            }




            var isEmptyProductValid = (Object.keys($scope.productExpenseModel || {}).length === 3 || Object.keys($scope.productExpenseModel || {}).length === 4 && $scope.productExpenseModel.quantity === '') && Object.keys($scope.productExpenseModel.item || {}).length === 0 && $scope.currentOpenTab === 'PRODUCT' && close;

            if (isEmptyProductValid || form.$valid) {
              $scope.isSavingUpdate = true;
              $scope.triedToSaveUpdate = false;

              var currentOpenTab = $scope.currentOpenTab,
                ticketUpdateToSend = {
                  type: currentOpenTab,
                  shares: [],
                  ticket: { id: $scope.ticketDetails.id }
                };

              if ($scope.ticketUpdate && $scope.ticketUpdate.products && !isEmptyProductValid) {

                for(var i=0; i<$scope.ticketUpdate.products.length; i++) {
                  $scope.ticketUpdate.products[i].discountType = 'PERCENT';
                }

                ticketUpdateToSend.products = $scope.ticketUpdate.products;

              } else if ($scope.ticketUpdate && $scope.ticketUpdate.services) {


                for(var i=0; i<$scope.ticketUpdate.services.length; i++) {
                  $scope.ticketUpdate.services[i].discountType = 'PERCENT';
                }

                ticketUpdateToSend.services = angular.copy($scope.ticketUpdate.services);

                for (var i = 0; i < ticketUpdateToSend.services.length; i++) {
                  var date = new Date(ticketUpdateToSend.services[i].date);
                  if ($rootScope.currentUser.serviceExpenseDurationPresentation === 'TIME_PICKER') {
                    var startDate = new Date();
                    var endDate = new Date();
                    startDate.setHours($rootScope.saveStartDate.hour);
                    startDate.setMinutes($rootScope.saveStartDate.minute);
                    endDate.setHours($rootScope.saveEndDate.hour);
                    endDate.setMinutes($rootScope.saveEndDate.minute);
                    if (
                      ($rootScope.saveStartDate.time === 'PM' && $rootScope.saveEndDate.time === 'AM') ||
                      ($rootScope.saveStartDate.time === 'AM' && $rootScope.saveEndDate.time === 'AM' && $rootScope.saveStartDate.hour > $rootScope.saveEndDate.hour) ||
                      ($rootScope.saveStartDate.time === 'PM' && $rootScope.saveEndDate.time === 'PM' && $rootScope.saveStartDate.hour > $rootScope.saveEndDate.hour)
                    ) {
                      endDate.setDate(endDate.getDate() + 1);
                    }
                    console.log($rootScope.saveStartDate, $rootScope.saveEndDate, '1251235');
                    getQuantity($rootScope.saveStartDate, $rootScope.saveEndDate);
                    ticketUpdateToSend.services[i].quantity = getQuantity($rootScope.saveStartDate, $rootScope.saveEndDate);
                    ticketUpdateToSend.services[i].durationStart = startDate.getTime();
                    ticketUpdateToSend.services[i].durationEnd = endDate.getTime();
                  } else {
                    ticketUpdateToSend.services[i].quantity = $scope.ticketUpdate.services[i].quantity / 60;
                  }

                  ticketUpdateToSend.services[i].date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                }

              } else if ($scope.haveAttachments() || $scope.haveNote()) {

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

                ticketUpdateToSend.shares.push({
                  user: { id: ticketSharedUser.user.id }
                });
              }

              TicketsService.createTicketUpdate(ticketUpdateToSend, close || false, function () {

                $scope.isSavingUpdate = false;

                if (callback) callback()

                if (!disableRestoringDefaults) {
                  switch (ticketUpdateToSend.type) {

                    case 'NOTE':
                      $scope.ticketUpdate.note = '';
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
            } else if (!$scope.ticketUpdate.selectedDiscount) {
              $scope.triedToSaveUpdate = true;
              return true;
            }

            if ($scope.ticketUpdate && $scope.ticketUpdate.selectedDiscount && $scope.currentOpenTab === 'PRODUCT') {
              $scope.isSavingUpdate = true;
              $scope.triedToSaveUpdate = false;
              TicketsService.updateDiscount($scope.ticketDetails.id, $scope.ticketUpdate.selectedDiscount.id, function () {
                $scope.isSavingUpdate = false;
                $scope.ticketUpdate.selectedDiscount = null;
              });
            }
          };

          function getQuantity(start, end) {
            var quantity = 0;
            var startDate = new Date();
            var endDate = new Date();
            startDate.setHours(start.hour);
            startDate.setMinutes(start.minute);
            endDate.setHours(end.hour);
            endDate.setMinutes(end.minute);
            if (
              (start.time === 'PM' && end.time === 'AM') ||
              (start.time === 'AM' && end.time === 'AM' && start.hour > end.hour) ||
              (start.time === 'PM' && end.time === 'PM' && start.hour > end.hour)
            ) {
              endDate.setDate(endDate.getDate() + 1);
              quantity = (endDate.getTime() - startDate.getTime()) / 1000;
            } else {
              quantity = (endDate.getTime() - startDate.getTime()) / 1000;
            }
            return quantity/3600;
          }

          $scope.setEditExpenseId = function (id, item, ticketUpdateId) {

            if (window.innerWidth <= 414) {

              if (item) {

                item.ticketUpdateId = ticketUpdateId
                $scope.toggleUpdateWindow(true)
                if (item.isServiceExpense) {
                  $scope.editExpense = {
                    service: item
                  }
                } else {
                  $scope.editExpense = {
                    product: item
                  }
                }
              } else {
                $scope.toggleUpdateWindow(false)
              }

            } else {
              $scope.editExpenseId = id;

            }
          };


          // ticket notify

          $scope.$on('userToAssignToTicket', function(evt, val) {
            var data = val.data;
            var id = data.id;

            var index = $scope.ticketSharedUsersList.findIndex(function(el) {
              var userId = el.user ? el.user.id : el.id
              return userId === id;
            })

            // console.log(index, 'indez')

            if (index !== -1) {
              $scope.ticketSharedUsersList.splice(index, 1);
            } else {
              $scope.ticketSharedUsersList.push({
                user: data,
                notify: true
              });
            }

            // console.log($scope.ticketSharedUsersList);

            $scope.$apply();
          })



          $scope.$watch('ticketSharedUsersList', function() {
            $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.filter(function(el) {
              return typeof el.user === 'object';
            });

          }, true)

          $scope.$watch('ticketSharedUsersList.length', function(val) {
            if (val > 8) {
              $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.slice(0, 8);
            }

            $rootScope.ticketSharedList = $scope.ticketSharedUsersList.slice();
          })

          // ticket notify end



          // Attachments

          $scope.filterByType = function(arr, type) {
            return arr.filter(function(el) {
              return el.user.accountType === type;
            })
          }

          function setTicketUpdateToDefault() {
            if (window.innerWidth <= 414) return;

            if ($scope.openedTab === 'NOTE') {
              $scope.setTicketUpdate({
               note: '',
               attachments: []
             });
            }

          }

          $scope.addAttachmentFiles = function (file) {
            // console.log(file, 'file to upload')
            $scope.ticketUpdate.attachments.push(file);
            $scope.disabledWhenLoadAttachment = true;

            uploadingAttachmentsCount++;
            if (file.size < 4194304) {
              file.xhr = FilesService.create(file,
                function (progress) {
                  file.progress = 100 * (progress.loaded / progress.total);
                  $scope.$apply();
                },
                function (finish) {

                  if (finish.code === 400 || finish.code === 500) {

                    var message = finish.code === 500 ? 'Maximum upload size of 4 MB' : finish.message;

                    $scope.fileInfo[file.name] = {
                      error: true,
                      message: message,
                      code: finish.code
                    };

                    $scope.fileInfo.quantityErrorFiles++;
                    $scope.updateTicketNote.$setValidity('errorFile', false);
                  }

                  if (--uploadingAttachmentsCount === 0) {
                    $scope.disabledWhenLoadAttachment = false;
                  }

                  file.xhr = null;
                  file.id = finish.id;
                  $scope.$apply();
                }, function (error) {
                });
            } else {
              $scope.fileLoadOrError = true;

              $scope.fileInfo[file.name] = {
                error: true,
                message: 'File must be less then 4 MB'
              };

              $scope.fileInfo.quantityErrorFiles++;
              $scope.ticketForm.$setValidity('errorFile', false);
            }

            $scope.$apply();
          };

          $scope.reloadAttachment = function (file) {
            if ($scope.fileInfo[file.name] && $scope.fileInfo[file.name].error) {
              return;
            }
            if (file.xhr && file.xhr.abort) {
              file.xhr.abort();
            }
            file.xhr = FilesService.create(file,
              function (progress) {
                file.progress = 100 * (progress.loaded / progress.total);
                $scope.$apply();
              },
              function (finish) {
                file.xhr = null;
                file.id = finish.id;
                $scope.$apply();
              }, function (error) {
              });
          };

          $scope.styleProgressBar = function (progress) {
            return {
              width: progress + '%'
            };
          };

          $scope.removeAttachment = function (index, isErrorFile) {
            if (isErrorFile) {

              $scope.fileInfo.quantityErrorFiles--;

              if ($scope.fileInfo.quantityErrorFiles === 0) {
                $scope.updateTicketNote.$setValidity('errorFile', true);
              }
            }

            $scope.ticketUpdate.attachments.splice(index, 1);
          };

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid;
          };

          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault);

          $scope.$watch('ticketUpdate.attachments.length', function (val) {

            if (!val) return;

            var totalAttachSize = 0;

            for (var i = 0; i < $scope.ticketUpdate.attachments.length; i++) {
              totalAttachSize += $scope.ticketUpdate.attachments[i].size;
            }

            if (totalAttachSize > (15 * 1024 * 1024)) {
              $scope.errorAttachSize = 'Attachments must be less than 15 Megabyte';
              $scope.disabledWhenLoadAttachment = true;
            } else {
              $scope.errorAttachSize = false;
              $scope.disabledWhenLoadAttachment = false;
            }

          })

          // ATTACHMENTS ENDING

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
                sharedUser = share.user,
                isAlreadyAdded = $scope.ticketSharedUsersList.findIndex(function (shared) {
                  return shared.user.id === this.id;
                }, sharedUser);

              if (isAlreadyAdded === -1) {
                $scope.ticketSharedUsersList.push({ user: share.user, notify: false });
              }

              if (
                processedShares.indexOf(sharedUser.id) > -1 ||
                sharedUser.id === $scope.ticketDetails.createdUser.id ||
                sharedUser.id === $scope.ticketDetails.assignedUser.id
              ) {
                continue;
              }

              processedShares.push(sharedUser.id);

              $scope.shares.push({
                name: $scope.getUserName($scope.getUserById(share.user.id)),
                title: $scope.getSharedTitle(share),
                avatarUrl: $scope.getUserAvatarUrl($scope.getUserById(share.user.id))
              })
            }

          }, true);

          $scope.filterCurrentUser = function (item) {
            if (!item.user) {
              return true;
            }
            return !(item.user.id === $scope.currentUser.id);
          };

          $scope.formatOffset = function (offset) {
            var minutesOffset = offset / 60000,
              sign = Math.sign(offset) === -1 ? '-' : '+',
              hours = Math.abs(Math.floor(minutesOffset / 60)) || '00',
              minutes = Math.abs(minutesOffset % 60) || '00';

            return '(UTC ' + sign + (hours.toString().length !== 2 ? ('0' + hours) : hours) +
              ':' + (minutes.toString().length !== 2 ? ('0' + minutes) : minutes) + ') ';
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
            var sharesWithoutSubscription = [];
            for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {
              var share = $scope.ticketSharedUsersList[i];
              if (!isNotifyAll) {
                share.notify = isNotifyAll;
              } else {
                if (share.user.accountType !== 'TECH' ? (share.user.subscription && (share.user.subscription.ticket || share.user.subscription.ticketManager)) : share.user.myTicketUpdated) {
                  share.notify = isNotifyAll;
                } else {
                  sharesWithoutSubscription.push(share);
                }
              }
            }

            if (sharesWithoutSubscription.length > 1) {
              UserConfirmationsService
                .show(sharesWithoutSubscription.length + ' users have disabled ticket updates subscription. Do you still want to notify them?', 'Yes')
                .then(function () {
                  for (var i = 0; i < sharesWithoutSubscription.length; i++) {
                    var share = sharesWithoutSubscription[i];
                    share.notify = true;
                  }
                });
            } else if (sharesWithoutSubscription.length) {
              $scope.validateNotifying(sharesWithoutSubscription.pop());
            }
          };

          $scope.validateNotifying = function (share, event) {
            if (!share.notify && (share.user.accountType !== 'TECH' ? (!share.user.subscription || (!share.user.subscription.ticket )) : !share.user.myTicketUpdated)) {
              UserConfirmationsService
                .show($scope.getUserName(share.user) + ' has disabled ticket updates subscription. Do you still want to notify this user?', 'Yes')
                .then(function () {
                  share.notify = true;
                });
              event && event.stopPropagation();
            }
          };

          $scope.isShowingErrors = function (form, field) {
            return form && form[field] && (form[field].$dirty || $scope.tryToSaveTicket) && form[field].$invalid;
          };

          $scope.validateLink = function (link) {
            $scope.validLink = {
              required: !link,
              pattern: !link.match($scope.linkPattern)
            };
          };



          $scope.setEditingTicket = function (value) {
            $scope.editingTicket = value;

            if (value) {
              var ticket = $scope.ticketDetails;
              $scope.editedTicket = {
                id: ticket.id,
                subject: ticket.subject,
                note: ticket.note
              };
              $scope.disabledSaveButton = false;
              $scope.tryToSaveTicket = false;
            }
          };

          $scope.saveEditedTicket = function (form) {
            var note = document.querySelector('#tickets-note');
            var subject = document.querySelector('#tickets-subject');
            if (form.$valid) {
              $scope.disabledSaveButton = true;
              $scope.tryToSaveTicket = false;
              $scope.editedTicket.note = $scope.editedTicket.note || '';
              TicketsService.save($scope.editedTicket, function () {
                $scope.editingTicket = false;
              })
            } else {
              $scope.tryToSaveTicket = true;
            }
          };

          $scope.updateDiscount = function (discount) {
            $scope.ticketUpdate.selectedDiscount = discount;
            if ($scope.ticketDetails.discount && !discount) {
              TicketsService.updateDiscount($scope.ticketDetails.id, '');
            }
          };

          $scope.getDiscountLabel = function (discount) {
            if (!discount) {
              return '';
            }
            return discount.name + ' ' + $scope.getDiscountAmount(discount);
          };

          $scope.$watch('currentUser.permissions', function (permissions) {
            if (permissions && !$scope.PermissionsService.isAllowed('EDIT_TICKETS')) {
              $scope.editingTicket = false;
            }
          });

          $scope.$on('$destroy', function() {
            $rootScope.usersToNotify = null;
          })

          function closeTicket() {
            $scope.ticketClosing = true;

            var recipientsIds = $scope.ticketSharedUsersList.filter(function (shared) {
              return shared.notify;
            }).map(function (shared) {
              return shared.user.id;
            });

            // TicketsService.changeStatus($scope.ticketDetails.id, 'COMPLETED', function () {
            //   UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as closed', true);
            //   $scope.disablePreventingLocationChange = true;
            //   if(!$state.includes('companyProfile')) {
            //     $state.go('tickets');
            //   }
            //   //$state.go('tickets');
            //   $scope.uncheckTicket($scope.ticketDetails.id);
            //   $scope.ticketClosing = false;
            // }, recipientsIds);

            UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as closed', true);
            $scope.disablePreventingLocationChange = true;
            if(!$state.includes('companyProfile')) {
              $state.go('tickets');
            }
            //$state.go('tickets');
            $scope.uncheckTicket($scope.ticketDetails.id);
            $scope.ticketClosing = false;
          }

          function hasUnsavedUpdate(update) {
            return (
              !!update.note
              || update.selectedDiscount
              || (update.products && update.products.length > 1)
              || (update.services && update.services.length > 1)
              || isNotEmpty(update.products)
              || isNotEmpty(update.services)
            );
          }

          function isNotEmpty(object) {
            for (var prop in object) {
              if (object.hasOwnProperty(prop) && prop !== 'itemOrder' && prop !== '$$hashKey' && prop !== 'discountType') {
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

            // add reporter user
            if ($scope.user) {
              addUserToResult($scope.user);
            }

            // ad assigned user
            if ($scope.assignedUser) {
              addUserToResult($scope.assignedUser);
            }

            // add ticket managers
            var usersFromTicketCompany = UsersService.getAllByCompanyId($scope.ticketDetails.company.id);

            for (var i = 0; i < usersFromTicketCompany.length; i++) {
              var user = usersFromTicketCompany[i];

              if (user.subscription && user.subscription.ticketManager) {
                addUserToResult(user);
              }
            }

            $rootScope.usersToNotify = result.slice().map(function(el) { return el.user; });

            return result;

            function addUserToResult(user) {

              var duplicate = result.find(function (item) {
                return item.user && item.user.id === user.id;
              });

              if (duplicate) {
                return;
              }

              result.push({ user: user, notify: false });
            }

          }

          var condition = 'ticketUpdate.note' +
            '|| (ticketUpdate.attachments && ticketUpdate.attachments.length)' +
            '|| (ticketUpdate.products && ticketUpdate.products.length > 1)' +
            '|| (ticketUpdate.services && ticketUpdate.services.length > 1)';

          UserConfirmationsService.preventLocationChange($scope, condition);

        }]);
  }()
);
