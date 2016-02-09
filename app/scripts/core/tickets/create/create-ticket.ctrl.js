'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.createTicketCtrl',
    ['$scope', '$modalInstance', 'TicketsService', 'FilesService', 'CompaniesService', 'UsersService',
      'quicktech.common.services.UserNotificationService', 'sessionId', 'ServicesService', '$timeout',
      function ($scope, $modalInstance, TicketsService, FilesService, CompaniesService, UsersService,
                UserNotificationService, sessionId, ServicesService, $timeout) {

        $scope.fileInfo = {quantityErrorFiles: 0};
        $scope.ticket = {priorityLevel: 'MEDIUM'};
        $scope.ticketAttachments = [];
        $scope.ticketPriorityValue = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High'
        };

        $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.clientCompanies = CompaniesService.getClientCompanies();
        $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);

        if (sessionId) {

          $scope.ticket.remoteSessionId = sessionId;
          $scope.ticket.serviceExpenses = [{}];
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
              $scope.ticket.serviceExpenses.push({item: {}});
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

        $scope.$watch('ticketCompany', function () {
          if ($scope.ticketCompany) {
            if ($scope.ticketCompany.name === 'Unassigned') {
              $scope.ticketCreatedUser = UsersService.getUnassignedUser($scope.ticketCompany.id);
            } else {
              delete $scope.ticketCreatedUser;
            }

            $scope.ticket.company = $scope.ticketCompany.id;

            $scope.usersCompany = UsersService.getAllByCompanyId($scope.ticketCompany.id);
            $scope.serviceList = ServicesService.getAllByCompany($scope, $scope.ticketCompany.id);

          } else {
            $scope.ticket.company = '';
            $scope.ticket.serviceExpenses = [{}];
          }
        });

        $scope.$watch('ticketCreatedUser', function () {
          $scope.ticket.createdUser = $scope.ticketCreatedUser ? $scope.ticketCreatedUser.id : '';
        });

        $scope.$watch('ticketAssignTo', function () {
          $scope.ticket.assignedUser = $scope.ticketAssignTo ? $scope.ticketAssignTo.id : '';
        });

        $scope.ticketCompany = CompaniesService.getUnassignedCompany();

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

            for (var j = 0; j < $scope.ticket.serviceExpenses.length; j++) {

              var item = $scope.ticket.serviceExpenses[j].item;

              if (!(item && item.versionedId && item.versionedId.id)) {
                $scope.ticket.serviceExpenses.splice(j, 1)
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

          var errorSubject = !$scope.ticket.subject || $scope.ticket.subject.length < 1,
            errorNote = !$scope.ticket.note || $scope.ticket.note.length < 1,
            errorUser = !$scope.ticket.createdUser || $scope.ticket.createdUser.length < 1,
            errorCompany = !$scope.ticket.company || $scope.ticket.company.length < 1;

          if (errorSubject || errorNote || errorUser || errorCompany) {
            return 'REQUIRED FIELDS CANNOT BE LEFT EMPTY.'
          }
        };

        $scope.filterUserFullName = function (value) {

          function searchInUsers(item) {

            if (value && value.length > 0 && (value !== '[$empty$]')) {
              var fullSearchFild = $scope.getUserName(item, true).toLowerCase();

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

        })

      }]);

}());
