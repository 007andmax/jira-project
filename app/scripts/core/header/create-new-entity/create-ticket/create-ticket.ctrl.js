'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createTicketCtrl',
    ['$scope', 'TicketsService', 'FilesService', 'CompaniesService', 'UsersService', 'DevicesService', '$rootScope',
      'quicktech.common.services.UserNotificationService', 'ServicesService', '$timeout', '$state',
      'quicktech.common.services.TicketsPermissionsService', 'quicktech.common.services.UserConfirmationsService',
      'Utils',
      function ($scope, TicketsService, FilesService, CompaniesService, UsersService, DevicesService, $rootScope,
                UserNotificationService, ServicesService, $timeout, $state, TicketsPermissionsService, UserConfirmationsService,
        Utils) {

        var agentsByCompany = [];

        $scope.allowedTypes = [
          "image/jpg",
          "image/jpeg",
          "image/bmp",
          "image/gif",
          "image/png",
          "application/vnd.oasis.opendocument.text",
          "application/vnd.oasis.opendocument.spreadsheet",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/msword",
          "application/msxls",
          "application/rtf",
          "application/x-rtf",
          "text/csv"
        ];

        $scope.unassignedCompany = CompaniesService.getUnassignedCompany();
        $scope.TicketsPermissionsService = TicketsPermissionsService;
        $scope.fileInfo = { quantityErrorFiles: 0 };

        var savedState = $scope.getLastSavedState('ticketFromDraft'),
          savedItem;

        if (savedState.item) {                                                                       //ticket from draft
          savedItem = savedState.item;
          savedItem.draftId = savedState.item.id;
          savedItem.id = undefined;

          for (var i = 0; i < savedItem.attachments.length; i++) {
            var attachment = savedItem.attachments[i];
            attachment.file.progress = 100;
            savedItem.attachments[i] = attachment.file;
          }
          $scope.ticketAttachments = savedItem.attachments;
          $scope.ticketSharedUsersList = [];
          $scope.selectUpdateSharedUser = {};
          savedItem.priorityLevel = 'MEDIUM';
          $scope.ticket = savedItem;

          var existingUser = UsersService.getClientUsers().find(function (user) {
            return user.primaryEmail === savedState.item.source;
          });

          if (existingUser && !existingUser.company.default) {
            setResolvedCompany(existingUser.company.id, existingUser);
          } else {
            $timeout(function () {
              $rootScope.$broadcast('createNewEntity', 'company', savedItem);
            });
          }

        } else {                                                                               //ticket from saved state
          savedState = $scope.getLastSavedState('ticket');
          savedItem = savedState.item;
          if (savedState.type === 'ticket' && savedItem) {
            $scope.ticketAttachments = savedItem.attachments;
            $scope.ticketSharedUsersList = savedItem.ticketSharedUsersList;
            $scope.selectUpdateSharedUser = savedItem.selectUpdateSharedUser;
            $scope.fileInfo = savedItem.fileInfo;

            savedItem.attachments = undefined;
            savedItem.ticketSharedUsersList = undefined;
            savedItem.selectUpdateSharedUser = undefined;
            $scope.ticket = angular.copy(savedItem);
          } else {                                                                                          //new ticket
            $scope.ticket = { priorityLevel: 'MEDIUM' };
            $scope.ticketAttachments = [];
            $scope.ticketSharedUsersList = [];
            $scope.selectUpdateSharedUser = {};
          }
        }

        $scope.ticketPriorityValue = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High'
        };

        $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.clientCompanies = CompaniesService.getClientCompanies();

        $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);

        DevicesService.getDevicesCount($scope, function (agents) {
          agentsByCompany = agents;

          var agentsList = [];
          for (var companyId in agents) {
            if (companyId !== 'staticCopy') {
              agentsList = agentsList.concat(agents[companyId].map(function (agent) {
                agent.companyId = companyId;

                if ($scope.resolvedCompanyId === companyId && $scope.resolvedDeviceId === agent.id) {
                  $timeout(function () {
                    $scope.ticketAgent = agent;
                  })
                }

                return agent;
              }));
            }
          }
          $scope.agentsList = angular.copy(agentsList);
        });

        if ($scope.resolvedCompanyId) {
          setResolvedCompany($scope.resolvedCompanyId);
        }

        if ($scope.resolvedCreatedUserId) {
          $timeout(function () {
            var createdUser = UsersService.getOneById($scope.resolvedCreatedUserId);
            if (!createdUser.isDefault) {
              $scope.ticketCreatedUser = createdUser;
            }
          });
        }

        if ($scope.sessionId) {

          $timeout(function () {
            $scope.ticket.ticketAssignTo = $scope.currentUser;
          });

          $scope.ticket.remoteSessionId = $scope.sessionId;
          $scope.ticket.serviceExpenses = [{}];

          var quantity = parseFloat($scope.sessionTime);
          $scope.ticket.serviceExpenses[0].quantity = quantity ? quantity.toFixed() : undefined;
          $scope.isShowService = true;
          $scope.maxServiceDate = new Date();

          ServicesService.getAllByCompany($scope, $scope.resolvedCompanyId, function (resp) {
            $scope.ticket.serviceExpenses[0].item = resp.find(function (service) {
                return service.name.toLowerCase() === 'remote service';
              }) || resp[0];
          });

          $scope.removeService = function (index) {
            $scope.ticket.serviceExpenses.splice(index, 1);
          };

          $scope.isShowingServiceErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid && (form[fieldName].$dirty || $scope.triedToAddService);
          };

          $scope.addService = function (form) {

            if (form.$valid) {
              $scope.ticket.serviceExpenses.push({ item: {} });
              $scope.triedToAddService = false;

            } else {
              $scope.triedToAddService = true;
              $timeout(function () {
                $scope.triedToAddService = false;
              }, 3000);
            }
          };
        }

        TicketsService.getActualNumber($scope, function (number) {
          if (!$scope.savingInProcess && !$scope.openingInProcess) {
            $scope.ticketNumber = number;
          }
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.triedToSaveTicket || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.$watch('ticketCompany', function (val) {
          $scope.filteredAgentList = $scope.agentsList;
          if (val && typeof val === 'object') {
            $scope.ticketCompanyChoosen = true;

            if ($scope.ticket.createdUser) {
              var ticketUserId = $scope.ticket.createdUser.id,
                ticketCompanyId = $scope.ticket.createdUser.companyId;
              if (ticketUserId && ticketCompanyId !== val.id) {
                delete $scope.ticketCreatedUser;
              }
            }

            if (agentsByCompany) {
              $scope.filteredAgentList = agentsByCompany[val.id];
            }
            $scope.clients = UsersService.getAllByCompanyId(val.id);

            resetSharedUsers(val);
            $scope.serviceList = ServicesService.getAllByCompany($scope, val.id);
            $scope.ticketForm.ticketCompany.$setValidity('invalidName', true);
          } else if (val) {
            $scope.ticketAgent = '';
            var selectedCompany;
            if ($scope.ticketCreatedUser && typeof $scope.ticketCreatedUser === 'object' && $scope.ticketCreatedUser.company.name === val) {
              selectedCompany = $scope.ticketCreatedUser.company;
            } else {
              for (var i = 0, len = $scope.clientCompanies.length; i < len; i++) {
                var company = $scope.clientCompanies[i];
                if (company.name === val) {
                  selectedCompany = company;
                  break;
                }
              }
            }

            if (!selectedCompany) {
              return $scope.ticketForm.ticketCompany.$setValidity('invalidName', false);
            } else {
              $scope.ticketCompany = selectedCompany;
              resetSharedUsers(selectedCompany);
            }
          } else {
            if ($scope.ticket.serviceExpenses && $scope.ticket.serviceExpenses.length) {
              $scope.ticket.serviceExpenses[0].item = undefined;
              $scope.ticket.serviceExpenses.splice(1);
            }

            $scope.ticketForm.ticketCompany.$setValidity('invalidName', true);
            $scope.clients = UsersService.getClientUsers();

            $scope.ticketAgent = '';
          }
        });

        $scope.$watch('ticketCreatedUser', function (val, prevValue) {
          if (val === prevValue) {
            return;
          }

          if (val && (typeof val === 'object') && val.id) {
            $scope.ticketCompany = CompaniesService.getOneById($scope.ticketCreatedUser.company.id);

            if ($scope.ticket.createdUser && $scope.ticket.createdUser.id) {
              $scope.selectUpdateSharedUser[$scope.ticket.createdUser.id] = false;
            }

            $scope.ticket.createdUser = {
              firstName: $scope.ticketCreatedUser.firstName,
              id: $scope.ticketCreatedUser.id,
              primaryEmail: $scope.ticketCreatedUser.primaryEmail,
              companyId: $scope.ticketCompany.id
            };

            $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.filter(function (share) {
              return share.user.id !== $scope.ticketCreatedUser.id;
            });

            $scope.ticketSharedUsersList.push({
              user: $scope.ticketCreatedUser,
              notify: false
            });

            $scope.selectUpdateSharedUser[$scope.ticketCreatedUser.id] = true;
            $scope.ticketForm.ticketCreatedUser.$setValidity('invalidUser', true);

          } else if (val) {

            var selectedUser = null;

            for (var i = 0, len = $scope.clients.length; i < len; i++) {
              var user = $scope.clients[i];
              if (user.primaryEmail === val) {
                selectedUser = user;
                break;
              }
            }

            if (!selectedUser) {
              $scope.ticketForm.ticketCreatedUser.$setValidity('invalidUser', false);

              if ($scope.ticket.createdUser && $scope.ticket.createdUser.id) {
                $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.filter(function (share) {
                  return share.user.id !== $scope.ticket.createdUser.id;
                });
                $scope.selectUpdateSharedUser[$scope.ticket.createdUser.id] = false;
              }
            } else {
              $scope.ticketCreatedUser = selectedUser;
              $scope.ticketForm.ticketCreatedUser.$setValidity('invalidUser', true);
            }

          } else {
            if ($scope.ticket.createdUser && $scope.ticket.createdUser.id) {
              $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.filter(function (share) {
                return share.user.id !== $scope.ticket.createdUser.id;
              });
              $scope.selectUpdateSharedUser[$scope.ticket.createdUser.id] = false;
            }
            $scope.ticket.createdUser = undefined;
            $scope.ticketForm.ticketCreatedUser.$setValidity('invalidUser', true);
          }

        });

        $scope.$watch('ticketAgent', function (val) {
          if (val && typeof val === 'object') {
            $scope.ticket.linkedAgentId = val.id;
            $scope.ticketCompany = CompaniesService.getOneById(val.companyId);
          } else if (val) {
            var filteredAgents = $scope.agentsList.filter(function (agent) {
              return agent.hostName === val || agent.ip === val;
            });

            if (filteredAgents.length === 1) {
              $scope.ticketAgent = filteredAgents.pop();
            } else {
              $scope.ticket.linkedAgentId = '';
            }
          } else {
            $scope.ticket.linkedAgentId = '';
          }
        });

        $scope.addAttachmentFiles = function (file) {
          $scope.ticketAttachments.push(file);

          if (file.size < 4194304) {

            file.xhr = FilesService.create(file,
              function (progress) {
                $scope.fileLoadOrError = true;
                file.progress = 100 * (progress.loaded / progress.total);
                $scope.$apply();
              }, function (finish) {

                $scope.fileLoadOrError = false;

                if (finish.code === 400 || finish.code === 500) {

                  $scope.fileLoadOrError = true;

                  $scope.fileInfo[file.name] = {
                    error: true,
                    message: finish.message.split(';')[0]
                  };

                  $scope.fileInfo.quantityErrorFiles++;
                  $scope.ticketForm.$setValidity('errorFile', false);
                } else {
                  $scope.ticketForm.$setValidity('errorFile', true);
                }

                file.xhr = null;
                file.id = finish.id;
                $scope.$apply();
              }, function (error) {});
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

        $scope.removeAttachment = function (index, isErrorFile) {
          if (isErrorFile) {

            $scope.fileInfo.quantityErrorFiles--;

            if ($scope.fileInfo.quantityErrorFiles === 0) {
              $scope.ticketForm.$setValidity('errorFile', true);
              $scope.fileLoadOrError = false;
            }
          }

          $scope.ticketAttachments.splice(index, 1);
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
              $scope.fileLoadOrError = true;
              file.progress = 100 * (progress.loaded / progress.total);
              $scope.$apply();
            },
            function (finish) {
              $scope.fileLoadOrError = false;
              file.xhr = null;
              file.id = finish.id;
              $scope.$apply();
            }, function (error) {
            });
        };

        $scope.saveTicket = function (form, isOpenAfterCreation) {

          if (form.$valid || $scope.isTicketFormValid(form)) {
            $scope.savingInProcess = !isOpenAfterCreation;
            $scope.openingInProcess = isOpenAfterCreation;

            $scope.ticket.attachFileIds = [];

            for (var i = 0; i < $scope.ticketAttachments.length; i++) {
              $scope.ticket.attachFileIds.push($scope.ticketAttachments[i].id);
            }

            if ($scope.ticket.serviceExpenses) {
              for (var j = 0; j < $scope.ticket.serviceExpenses.length; j++) {

                var serviceExpense = $scope.ticket.serviceExpenses[j];
                var item = serviceExpense.item;

                serviceExpense.quantity = serviceExpense.quantity / 60;

                if (!(item && item.versionedId && item.versionedId.id)) {
                  $scope.ticket.serviceExpenses.splice(j, 1)
                }
              }
            }

            if ($scope.ticket.ticketAssignTo && $scope.ticket.ticketAssignTo.id) {
              $scope.ticket.assignedUser = $scope.ticket.ticketAssignTo.id;
            }

            var ticketNumber = $scope.ticketNumber;

            if ($scope.ticket.notifyTicketAssignedUser) {
              $scope.ticket.shares = [{ user: { id: $scope.ticket.ticketAssignTo.id } }];
            } else {
              $scope.ticket.shares = [];
            }

            for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {

              var ticketSharedUser = $scope.ticketSharedUsersList[i];

              if (!ticketSharedUser.notify) {
                continue;
              }

              $scope.ticket.shares.push({
                user: { id: ticketSharedUser.user.id }
              });
            }

            $scope.ticket.note = $scope.ticket.note || '';

            TicketsService.createTicket($scope.ticket, function (resp) {
              $scope.savingInProcess = false;
              $scope.openingInProcess = false;
              $scope.closeWindow();

              if (resp.code >= 400) {
                var message = resp.validationResults && resp.validationResults.remoteSessionId ? resp.validationResults.remoteSessionId : resp.message;
                alert(message)
              } else {
                UserNotificationService.show('New Ticket “' + ticketNumber + '” has been created', true);
                if (isOpenAfterCreation) {
                  $state.go('tickets.details', { listType: 'all', ticketId: resp.id, remoteParams: null });
                } else if ($scope.ticket.draftId) {
                  $state.go('drafts');
                }
              }
            });

          } else {
            $scope.triedToSaveTicket = true;
          }
        };

        $scope.validateLink = function () {
          $scope.validLink = {
            required: !$scope.ticketEditorLink,
            pattern: !$scope.ticketEditorLink.match($scope.linkPattern)
          };
        };

        $scope.styleProgressBar = function (progress) {
          return {
            width: progress + '%'
          };
        };

        $scope.validationMessage = function (form) {

          if (!$scope.triedToSaveTicket) {
            return
          }

          var errors = Object.keys(form.$error),
            primaryError;

          for (var i = 0, len = errors.length; i < len; i++) {
            var error = errors[i];
            if (error === 'invalidName' || error === 'invalidUser') {
              primaryError = error;
              break;
            }
          }

          if (form.ticketSubject.$error.maxlength) {
            return 'Subject is too large.';
          } else if (form.note.$error.maxlength) {
            return 'Note is too large.';
          } else if (primaryError === 'invalidName') {
            return 'Invalid company name.';
          } else if (primaryError === 'invalidUser') {
            return 'Invalid user name.';
          } else if (!primaryError && errors.indexOf('required') > -1) {
            return 'Required fields can\'t be left empty.';
          }
        };

        $scope.filterUserFullName = function (value) {

          function searchInUsers(item) {
            if (item.deletedAt) {
              return false;
            }

            if (value && value.length > 0 && (value !== '[$empty$]')) {
              var userEmail = (item.primaryEmail && item.primaryEmail.length > 0) ? ' ' + item.primaryEmail.toLowerCase() : '';
              var fullSearchFild = $scope.getUserName(item).toLowerCase() + userEmail;

              return fullSearchFild.indexOf(value.toLowerCase()) !== -1;
            }

            return true;

          }

          return searchInUsers;
        };

        $scope.filterAgents = function (value) {
          return function (item) {
            if (!value || value === '[$empty$]') {
              return true;
            } else if (!item.agentId) {
              return false;
            }

            if (item.hostName) {
              return item.hostName.toLowerCase().indexOf(value.toLowerCase()) !== -1 || item.ip.indexOf(value) !== -1;
            } else {
              return item.ip.indexOf(value) !== -1;
            }
          }
        };

        $scope.isTicketFormValid = function (form) {
          return form.$error.required && form.$error.required.length === 1 && form.$error.required[0].$name === 'addServiceForm';
        };

        $scope.$watch('ticketAttachments.length', function () {

          var totalAttachSize = 0;

          for (var i = 0; i < $scope.ticketAttachments.length; i++) {
            totalAttachSize += $scope.ticketAttachments[i].size;
          }

          if (totalAttachSize > (15 * 1024 * 1024)) {
            $scope.errorFileMessage = 'Attachments must be less than 15 Megabyte';
          } else {
            $scope.errorFileMessage = false;
          }

        });

        $scope.$watch('ticket.ticketAssignTo.id', function (newId, oldId) {

          Utils.removeFromArrayByCondition($scope.ticketSharedUsersList, function (item) {
            return item.user && item.user.id === oldId;
          });

          if ($scope.ticket.ticketAssignTo) {
            $scope.ticketSharedUsersList.push({
              user: $scope.ticket.ticketAssignTo,
              notify: true
            });
          }
        });

        $scope.clearTicketCompany = function () {
          $scope.ticketCompany = undefined;
          if ($scope.ticketCreatedUser && $scope.ticketCreatedUser.id) {
            $scope.ticketCreatedUser = undefined;
          }
          $scope.ticketCompanyChoosen = false;
        };

        $scope.getUserById = function (userId) {
          return UsersService.getOneById(userId);
        };

        $scope.toggleAllShared = function (isNotifyAll) {
          var sharesWithoutSubscription = [];
          for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {
            var share = $scope.ticketSharedUsersList[i];
            if (!isNotifyAll) {
              share.notify = isNotifyAll;
            } else {
              if ((share.user.subscription && share.user.subscription.ticket) || share.user.accountType === 'TECH') {
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
          if (!share.notify && share.user.accountType !== 'TECH' && (!share.user.subscription || !share.user.subscription.ticket)) {
            UserConfirmationsService
              .show($scope.getUserName(share.user) + ' has disabled ticket updates subscription. Do you still want to notify this user?', 'Yes')
              .then(function () {
                share.notify = true;
              });
            event && event.stopPropagation();
          }
        };

        $scope.isAlreadyInShares = function (user) {
          return $scope.ticketSharedUsersList.find(function (share) {
            return !share.user || share.user.id === user.id;
          });
        };

        $scope.$on('createNewEntity', archiveTicketState);
        $scope.$on('createNewWindowClosing', createNewWindowClosing);

        function createNewWindowClosing() {
          var ticket = $scope.ticket;
          var subject = ticket.subject && ticket.subject.trim();
          var note = ticket.note && ticket.note.trim().replace(/<.+?>/gm, '');
          var isTicketChanged = subject || note || $scope.ticketAttachments.length;
          if (isTicketChanged) {
            $scope.savedState.types.unshift('ticket');
            $scope.savedState.items.unshift($scope.ticket);
          }
        }

        function archiveTicketState(event, type, userFromDraft) {
          $scope.ticket.attachments = $scope.ticketAttachments.map(function (file) {
            return {
              id: file.id,
              name: file.name,
              size: file.size,
              type: file.type,
              progress: file.progress
            };
          });
          $scope.ticket.fileInfo = angular.copy($scope.fileInfo);
          $scope.ticket.ticketSharedUsersList = angular.copy($scope.ticketSharedUsersList);
          $scope.ticket.selectUpdateSharedUser = angular.copy($scope.selectUpdateSharedUser);
          $scope.savedState.types.unshift('ticket');
          $scope.savedState.items.unshift($scope.ticket);

          if ($scope.ticket.draftId) {
            $scope.savedState.types.unshift('company');
            $scope.savedState.items.unshift(userFromDraft);
          }

          $scope.setOpenedTab(type);
        }

        function resetSharedUsers(company) {
          //remove users from other companies
          for (var i = 0; i < $scope.ticketSharedUsersList.length; i++) {
            var shares = $scope.ticketSharedUsersList[i];

            if (UsersService.getOneById(shares.user.id).accountType === 'TECH') {
              continue;
            }

            if (!shares.user.company || shares.user.company.id !== company.id) {
              $scope.ticketSharedUsersList.splice(i, 1);
              $scope.selectUpdateSharedUser[shares.user.id] = false;
              i--;
            }
          }

          // add to shared all users subscribed on ticket updates or Ticket Manager
          if (company) {
            var clients = UsersService.getAllByCompanyId(company.id);

            for(var i = 0; i < clients.length; i++){
              var user = clients[i];

              if(user.subscription && user.subscription.ticketManager && !user.deletedAt)
                addUserToResult(user);
              $scope.selectUpdateSharedUser[user.id] = true;
            }
          }

          function addUserToResult(user) {

            var duplicate = $scope.ticketSharedUsersList.find(function (item) {
              return item.user && item.user.id === user.id;
            });

            if (duplicate)
              return;

            $scope.ticketSharedUsersList.push({user: user, notify: false});
          }
        }

        function setResolvedCompany(resolvedCompanyId, ticketCreatedUser) {
          $timeout(function () {
            var company = CompaniesService.getOneById(resolvedCompanyId);
            if (!company.isDefault) {
              if (ticketCreatedUser) {
                $scope.ticketCreatedUser = ticketCreatedUser;
              } else {
                $scope.ticketCreatedUser = UsersService.getAllByCompanyId(company.id).find(function (user) {
                  return user.isContact;
                });
              }
            }
          });
        }

      }]);

}());
