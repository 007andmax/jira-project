'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.createTicketCtrl',
    [
      '$scope', '$modalInstance', 'TicketsService', 'FilesService', 'CompaniesService', 'UsersService',
      'quicktech.common.services.UserNotificationService', 'sessionId', 'sessionTime', 'ServicesService', '$timeout',
      function ($scope, $modalInstance, TicketsService, FilesService, CompaniesService, UsersService,
                UserNotificationService, sessionId, sessionTime, ServicesService, $timeout) {

        var isNeedToDeleteUser = true;

        $scope.fileInfo = { quantityErrorFiles: 0 };
        $scope.ticket = { priorityLevel: 'MEDIUM' };
        $scope.ticketAttachments = [];
        $scope.ticketPriorityValue = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High'
        };

        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.clientCompanies = CompaniesService.getClientCompanies().filter(function (item) {
          if (!item.isDefault) {
            return item;
          }
        });
        $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);

        if (sessionId) {

          $scope.ticket.remoteSessionId = sessionId;
          $scope.ticket.serviceExpenses = [
            {
              quantity: (sessionTime * 60).toFixed()
            }
          ];
          $scope.isShowService = true;
          $scope.maxServiceDate = new Date();

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
            $scope.ticketNumber = number;
          }
        );

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.triedToSaveTicket || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.$watch('ticketCompany', function (val) {
          if (val && typeof val === 'object') {
            $scope.ticketCompanyChoosen = true;

            if (isNeedToDeleteUser) {
              delete $scope.ticketCreatedUser;
            }
            isNeedToDeleteUser = true;

            if ($scope.ticket.createdUser) {
              $scope.ticket.createdUser.companyId = val.id;
            }

            $scope.usersCompany = UsersService.getAllByCompanyId(val.id);
            $scope.serviceList = ServicesService.getAllByCompany($scope, val.id);
            $scope.ticketForm.ticketCompany.$setValidity('invalidName', true);
          } else if (val) {
            $scope.ticketCompanyChoosen = true;
            var companies = [];
            if ($scope.ticketCreatedUser && typeof $scope.ticketCreatedUser === 'object' && $scope.ticketCreatedUser.company.name === val) {
              companies.push($scope.ticketCreatedUser.company);
            } else {
              for (var prop in $scope.clientCompanies) {
                var company = $scope.clientCompanies[prop];
                if (company.name === val) {
                  companies.push(company);
                  if (company.length > 1) {
                    break;
                  }
                }
              }
            }

            if (companies.length !== 1) {
              if ($scope.ticket.createdUser) {
                $scope.ticket.createdUser.companyId = undefined;
              }
              return $scope.ticketForm.ticketCompany.$setValidity('invalidName', false);
            } else {
              $scope.ticketCompany = companies[0];
            }
          } else {
            if ($scope.ticket.createdUser) {
              $scope.ticket.createdUser.companyId = undefined;
            }
            $scope.ticketForm.ticketCompany.$setValidity('invalidName', true);
            $scope.ticket.serviceExpenses = [{}];
            $scope.usersCompany = UsersService.getClientUsers().filter(function (item) {
              if (!item.isDefault) {
                return item;
              }
            });
          }
        });

        $scope.$watch('ticketCreatedUser', function (val) {
          if ((val !== null) && (typeof val === 'object') && (val.id)) {
            $scope.ticketForm.ticketCreatedUser.$setValidity('pattern', true);
            $scope.ticketForm.ticketCreatedUser.$setValidity('unique', true);
            $scope.ticket.createdUser = {
              id: $scope.ticketCreatedUser.id,
              primaryEmail: $scope.ticketCreatedUser.primaryEmail
            };
            isNeedToDeleteUser = false;
            var ticketCompany = CompaniesService.getOneById($scope.ticketCreatedUser.company.id);

            if (ticketCompany.id !== CompaniesService.getUnassignedCompany().id) {
              $scope.ticketCompany = ticketCompany;
            }
          } else if (val && val.match($scope.emailPattern)) {
            $scope.ticketForm.ticketCreatedUser.$setValidity('pattern', true);

            var users = [];
            for (var prop in $scope.usersCompany) {
              var user = $scope.usersCompany[prop];
              if (user.primaryEmail === val) {
                users.push(user);
                if (users.length > 1) {
                  break;
                }
              }
            }

            if (users.length !== 1) {
              UsersService.isEmailUnique(val, '', function (resp) {
                if (resp.value) {
                  $scope.ticketForm.ticketCreatedUser.$setValidity('unique', true);
                  $scope.ticket.createdUser = {
                    primaryEmail: val,
                    companyId: $scope.ticketCompany ? $scope.ticketCompany.id : undefined
                  };
                  isNeedToDeleteUser = false;
                } else {
                  $scope.ticketForm.ticketCreatedUser.$setValidity('unique', false);
                }
              });
            } else {
              $scope.ticketCreatedUser = users[0];
            }

          } else if (val) {
            $scope.ticketForm.ticketCreatedUser.$setValidity('pattern', false);
          }

        });

        $scope.$watch('ticketAssignTo', function () {
          $scope.ticket.assignedUser = $scope.ticketAssignTo ? $scope.ticketAssignTo.id : '';
        });

        $scope.addAttachmentFiles = function (file) {

          $scope.ticketAttachments.push(file);
          $scope.$apply();

          FilesService.create(file,
            function (progress) {
              $scope.fileLoadOrError = true;
              file.progress = 100 * (progress.loaded / progress.total);
              $scope.$apply();
            },
            function (finish) {

              $scope.fileLoadOrError = false;

              if (finish.code === 400 || finish.code === 500) {

                $scope.fileLoadOrError = true;

                $scope.fileInfo[file.name] = {
                  error: true,
                  message: finish.message
                };

                $scope.fileInfo.quantityErrorFiles++;
                $scope.ticketForm.$setValidity('errorFile', false);
              }

              file.id = finish.id;
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

        $scope.saveTicket = function (form) {

          if (form.$valid || $scope.isTicketFormValid(form)) {
            $scope.savingInProcess = true;

            $scope.ticket.attachFileIds = [];

            for (var i = 0; i < $scope.ticketAttachments.length; i++) {
              $scope.ticket.attachFileIds.push($scope.ticketAttachments[i].id);
            }

            if ($scope.ticket.serviceExpenses) {
              for (var j = 0; j < $scope.ticket.serviceExpenses.length; j++) {

                var item = $scope.ticket.serviceExpenses[j].item;

                if (!(item && item.versionedId && item.versionedId.id)) {
                  $scope.ticket.serviceExpenses.splice(j, 1)
                }
              }
            }

            var ticketNumber = $scope.ticketNumber;

            TicketsService.createTicket($scope.ticket, function (resp) {
              $scope.savingInProcess = false;
              $modalInstance.dismiss();

              if (resp.code >= 400) {
                var message = resp.validationResults && resp.validationResults.remoteSessionId ? resp.validationResults.remoteSessionId : resp.message;
                alert(message)
              } else {
                UserNotificationService.show('New Ticket “' + ticketNumber + '” has been created', true);
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
            error = errors.find(function (item) {
              return item === 'pattern' || item === 'unique' || item === 'invalidName';
            });


          if (error === 'pattern') {
            return 'INCORRECT EMAIL.';
          } else if (error === 'unique') {
            return 'EMAIL NOT UNIQUE.';
          } else if (error === 'invalidName') {
            return 'INVALID COMPANY NAME.';
          } else if (!error && errors.indexOf('required') > -1) {
            return 'REQUIRED FIELDS CANNOT BE LEFT EMPTY.';
          }
        };

        $scope.filterUserFullName = function (value) {

          function searchInUsers(item) {

            if (value && value.length > 0 && (value !== '[$empty$]')) {
              var fullSearchFild = $scope.getUserName(item).toLowerCase() +
              item.primaryEmail ? ' ' + item.primaryEmail.toLowerCase() : '';

              return fullSearchFild.indexOf(value.toLowerCase()) !== -1;
            }

            return true;

          }

          return searchInUsers;
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
      }
    ]);

}());
