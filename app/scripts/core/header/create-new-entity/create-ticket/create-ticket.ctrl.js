'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createTicketCtrl',
    ['$scope', 'TicketsService', 'FilesService', 'CompaniesService', 'UsersService', 'DevicesService',
      'quicktech.common.services.UserNotificationService', 'ServicesService', '$timeout', '$state',
      'quicktech.common.services.TicketsPermissionsService',
      function ($scope, TicketsService, FilesService, CompaniesService, UsersService, DevicesService,
                UserNotificationService, ServicesService, $timeout, $state, TicketsPermissionsService) {

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

        var savedState = $scope.getLastSavedState('ticket');
        var savedItem = savedState.item;
        if (savedState.type === 'ticket' && savedItem) {
          $scope.ticketAttachments = angular.copy(savedItem.attachments);
          $scope.ticketSharedUsersList = angular.copy(savedItem.ticketSharedUsersList);
          $scope.selectUpdateSharedUser = angular.copy(savedItem.selectUpdateSharedUser);


          savedItem.attachments = undefined;
          savedItem.ticketSharedUsersList = undefined;
          savedItem.selectUpdateSharedUser = undefined;
          $scope.ticket = angular.copy(savedItem);
        } else {
          $scope.ticket = { priorityLevel: 'MEDIUM' };
          $scope.ticketAttachments = [];
          $scope.ticketSharedUsersList = [];
          $scope.selectUpdateSharedUser = {};
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
          $timeout(function () {
            var company = CompaniesService.getOneById($scope.resolvedCompanyId);
            if (!company.isDefault) {
              $scope.ticketCreatedUser = UsersService.getAllByCompanyId(company.id).find(function (user) {
                return user.isContact;
              });
            }
          });
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
            var techUsers = UsersService.getTechUsers();
            if (techUsers.length > 1) {
              $scope.ticket.ticketAssignTo = $scope.currentUser;
            } else {
              $scope.ticket.isAssignToMe = true;
            }
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
          if (!$scope.savingInProcess) {
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
            $scope.ticketCompanyChoosen = true;
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

        $scope.$watch('ticketCreatedUser', function (val) {

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
            $scope.savingInProcess = true;

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

            if (!$scope.ticket.ticketAssignTo) {
              if ($scope.ticket.isAssignToMe) {
                $scope.ticket.assignedUser = $scope.currentUser.id;
              } else {
                $scope.ticket.assignedUser = undefined;
              }
            } else {
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
              $scope.closeWindow();

              if (resp.code >= 400) {
                var message = resp.validationResults && resp.validationResults.remoteSessionId ? resp.validationResults.remoteSessionId : resp.message;
                alert(message)
              } else {
                UserNotificationService.show('New Ticket “' + ticketNumber + '” has been created', true);
                if (isOpenAfterCreation) {
                  $state.go('tickets.details', { listType: 'all', ticketId: resp.id, remoteParams: null });
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
          for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {
            $scope.ticketSharedUsersList[i].notify = isNotifyAll;
          }
        };

        $scope.isAlreadyInShares = function (user) {
          return $scope.ticketSharedUsersList.find(function (share) {
            return !share.user || share.user.id === user.id;
          });
        };

        $scope.$on('createNewEntity', function (event, type) {
          $scope.ticket.attachments = $scope.ticketAttachments;
          $scope.ticket.ticketSharedUsersList = $scope.ticketSharedUsersList;
          $scope.ticket.selectUpdateSharedUser = $scope.selectUpdateSharedUser;
          $scope.savedState.types.unshift('ticket');
          $scope.savedState.items.unshift($scope.ticket);
          $scope.setOpenedTab(type);
        });

        function resetSharedUsers(company) {
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
        }

      }]);

}());
