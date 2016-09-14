'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.createTicketCtrl',
    ['$scope', '$modalInstance', 'TicketsService', 'FilesService', 'CompaniesService', 'UsersService', 'DevicesService',
      'quicktech.common.services.UserNotificationService', 'sessionId', 'sessionTime', 'fromRemoteCompanyId', 'fromRemoteDeviceId',
      'ServicesService', '$timeout', 'quicktech.common.services.TicketsPermissionsService', '$state', 'Utils',
      'quicktech.common.services.PermissionsService',
      function ($scope, $modalInstance, TicketsService, FilesService, CompaniesService, UsersService, DevicesService,
                UserNotificationService, sessionId, sessionTime, fromRemoteCompanyId, fromRemoteDeviceId, ServicesService,
                $timeout, TicketsPermissionsService, $state, Utils, PermissionsService) {

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
        $scope.ticket = { priorityLevel: 'MEDIUM' };
        $scope.ticketAttachments = [];
        $scope.ticketPriorityValue = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High'
        };
        $scope.ticketSharedUsersList = [];
        $scope.selectUpdateSharedUser = {};

        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.clientCompanies = CompaniesService.getClientCompanies();
        Utils.deleteById($scope.clientCompanies, $scope.unassignedCompany.id);

        $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);

        DevicesService.getDevicesCount($scope, function (agents) {
          agentsByCompany = agents;

          var agentsList = [];
          for (var companyId in agents) {
            if (companyId !== 'staticCopy') {
              agentsList = agentsList.concat(agents[companyId].map(function (agent) {
                agent.companyId = companyId;

                if (fromRemoteCompanyId === companyId && fromRemoteDeviceId === agent.id) {
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

        if (fromRemoteCompanyId) {
          $timeout(function () {
            var company = CompaniesService.getOneById(fromRemoteCompanyId);
            if (!company.default) {
              $scope.ticketCompany = company;
            }
          });
        }

        if (sessionId) {

          $timeout(function () {
            var techUsers = UsersService.getTechUsers();
            if (techUsers.length > 1) {
              $scope.ticket.ticketAssignTo = $scope.currentUser;
            } else {
              $scope.ticket.isAssignToMe = true;
            }
          });

          $scope.ticket.remoteSessionId = sessionId;
          $scope.ticket.serviceExpenses = [{}];

          var quantity = parseFloat(sessionTime);
          $scope.ticket.serviceExpenses[0].quantity = quantity ? quantity.toFixed() : undefined;
          $scope.isShowService = true;
          $scope.maxServiceDate = new Date();

          ServicesService.getAllByCompany($scope, fromRemoteCompanyId, function (resp) {
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
              if (ticketUserId && ticketCompanyId !== val.id && ticketCompanyId !== $scope.unassignedCompany.id) {
                delete $scope.ticketCreatedUser;
              }

              $scope.ticket.createdUser.companyId = val.id;
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
            if ($scope.ticket.createdUser) {
              $scope.ticket.createdUser.companyId = $scope.unassignedCompany.id;
              resetSharedUsers($scope.unassignedCompany);
            }

            if ($scope.ticket.serviceExpenses && $scope.ticket.serviceExpenses.length) {
              $scope.ticket.serviceExpenses[0].item = undefined;
              $scope.ticket.serviceExpenses.splice(1);
            }

            $scope.ticketForm.ticketCompany.$setValidity('invalidName', true);
            $scope.clients = UsersService.getClientUsers();
            Utils.deleteById($scope.clients, UsersService.getUnassignedUser($scope.unassignedCompany.id).id);

            $scope.ticketAgent = '';
          }
        });

        $scope.$watch('ticketCreatedUser', function (val) {

          if ((val !== null) && (typeof val === 'object') && (val.id)) {
            $scope.ticketForm.ticketCreatedUser.$setValidity('pattern', true);
            $scope.ticketForm.ticketCreatedUser.$setValidity('unique', true);
            $scope.ticketForm.ticketCreatedUser.$setValidity('permissions', true);

            $scope.ticket.createdUser = {
              firstName: $scope.ticketCreatedUser.firstName,
              id: $scope.ticketCreatedUser.id,
              primaryEmail: $scope.ticketCreatedUser.primaryEmail
            };

            $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.filter(function (share) {
              return !share.user || (share.user.id !== 'new' && share.user.id !== $scope.ticketCreatedUser.id);
            });

            $scope.ticketSharedUsersList.push({
              user: $scope.ticketCreatedUser,
              notify: false
            });

            $scope.selectUpdateSharedUser[$scope.ticketCreatedUser.id] = true;

            var ticketCompany = CompaniesService.getOneById($scope.ticketCreatedUser.company.id);

            if (ticketCompany.id !== $scope.unassignedCompany.id) {
              $scope.ticketCompany = ticketCompany;
              $scope.ticket.createdUser.companyId = ticketCompany.id;
            } else {
              $scope.ticket.createdUser.companyId = $scope.unassignedCompany.id;
              resetSharedUsers($scope.unassignedCompany);
              $scope.ticketAgent = '';
            }
          } else if (val && val.match($scope.emailPattern)) {

            $scope.ticketForm.ticketCreatedUser.$setValidity('pattern', true);

            var selectedUser = null;
            for (var i = 0, len = $scope.clients.length; i < len; i++) {
              var user = $scope.clients[i];
              if (user.primaryEmail === val) {
                selectedUser = user;
                break;
              }
            }

            if (!selectedUser) {

              if (!PermissionsService.isAllowed('CREATE_USERS')) {
                $scope.ticketForm.ticketCreatedUser.$setValidity('permissions', false);
              } else {
                $scope.ticketForm.ticketCreatedUser.$setValidity('permissions', true);
              }

              UsersService.isEmailUnique(val, '', false, function (resp) {
                if (resp.value) {
                  $scope.ticketForm.ticketCreatedUser.$setValidity('unique', true);
                  var firstName = val.split('@')[0],
                    selectedCompany = $scope.ticketCompany ? $scope.ticketCompany : $scope.unassignedCompany;

                  $scope.ticket.createdUser = {
                    primaryEmail: val,
                    firstName: firstName,
                    companyId: selectedCompany.id
                  };

                  resetSharedUsers(selectedCompany);
                  $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.filter(function (share) {
                    return share.user.id !== 'new';
                  });

                  $scope.ticketSharedUsersList.push({
                    user: {
                      id: 'new',
                      primaryEmail: val,
                      firstName: val
                    },
                    notify: false
                  });

                  $scope.ticketAgent = $scope.ticketCompany ? $scope.ticketAgent : '';
                } else {
                  $scope.ticketForm.ticketCreatedUser.$setValidity('unique', false);
                }
              });
            } else {
              $scope.ticketCreatedUser = selectedUser;
              $scope.ticketForm.ticketCreatedUser.$setValidity('permissions', true);
            }

          } else if (val) {
            $scope.ticketForm.ticketCreatedUser.$setValidity('pattern', false);
            $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.filter(function (share) {
              return share.user.id !== 'new';
            });
          } else {
            $scope.ticket.createdUser = undefined;
            $scope.ticketSharedUsersList = $scope.ticketSharedUsersList.filter(function (share) {
              return share.user.id !== 'new';
            });
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
          $scope.$apply();

          FilesService.create(file,
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

              file.id = finish.id;
              $scope.$apply();
            }, function (error) {
            });
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
          FilesService.create(file,
            function (progress) {
              $scope.fileLoadOrError = true;
              file.progress = 100 * (progress.loaded / progress.total);
              $scope.$apply();
            },
            function (finish) {
              $scope.fileLoadOrError = false;
              file.id = finish.id;
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

              if (ticketSharedUser.user) {

                $scope.ticket.shares.push({
                  user: { id: ticketSharedUser.user.id }
                });

              } else if (ticketSharedUser.contact) {

                $scope.ticket.shares.push({
                  contact: { id: ticketSharedUser.contact.id }
                })
              }
            }

            TicketsService.createTicket($scope.ticket, function (resp) {
              $scope.savingInProcess = false;
              $modalInstance.dismiss();

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

        $scope.closeCreateTicketForm = function () {
          $modalInstance.dismiss();
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
            if (error === 'pattern' || error === 'unique' || error === 'invalidName' || error === 'permissions') {
              primaryError = error;
              break;
            }
          }

          if (primaryError === 'pattern') {
            return 'Incorrect email.';
          } else if (primaryError === 'unique') {
            return 'Email already occupied by tech user.';
          } else if (primaryError === 'invalidName') {
            return 'Invalid company name.';
          } else if (primaryError === 'permissions') {
            return 'You have no permissions to create new user.';
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

        function resetSharedUsers(company) {
          for (var i = 0; i < $scope.ticketSharedUsersList.length; i++) {
            var shares = $scope.ticketSharedUsersList[i];

            if (!shares.user || shares.user.id === 'new' || UsersService.getOneById(shares.user.id).accountType === 'TECH') {
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
