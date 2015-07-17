'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.createTicketCtrl',
    ['$scope', '$modalInstance', 'TicketsService', 'FilesService', 'CompaniesService', 'UsersService',
      function ($scope, $modalInstance, TicketsService, FilesService, CompaniesService, UsersService) {

        $scope.ticket = {};
        $scope.ticketAttachments = [];
        $scope.ticketFilesId = [];
        $scope.ticketPriorityValue = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High'
        };

        $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

        TicketsService.getActualNumber($scope, function (number) {
            $scope.ticketNumber = number;
          }
        );

        $scope.clientCompanies = CompaniesService.getClientCompanies();

        $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveTicket || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.$watch('ticketCompany', function () {
          if ($scope.ticketCompany) {
            delete $scope.ticketCreatedUser;
            $scope.ticket.company = $scope.ticketCompany.id;
            $scope.usersCompany = UsersService.getAllByCompanyId($scope.ticketCompany.id);
          } else {
            $scope.ticket.company = '';
          }
        });

        $scope.$watch('ticketCreatedUser', function () {
          $scope.ticket.createdUser = $scope.ticketCreatedUser ? $scope.ticketCreatedUser.id : '';
        });

        $scope.$watch('ticketAssignTo', function () {
          $scope.ticket.assignedUser = $scope.ticketAssignTo ? $scope.ticketAssignTo.id : '';
        });

        $scope.addAttachmentFiles = function (file) {
          $scope.ticketAttachments.push(file);
          $scope.$apply();
          FilesService.create(file,
            function (progress) {
              $scope.ticketAttachments[$scope.ticketAttachments.length - 1].progress = 100 * (progress.loaded / progress.total);
              $scope.$apply();
            },
            function (finish) {
              $scope.ticketFilesId.push(finish.id)
            }, function (error) {
            });
        };

        $scope.removeAttachment = function (index) {
          $scope.ticketAttachments.splice(index, 1);
          $scope.ticketFilesId.splice(index, 1);
        };
        $scope.reloadAttachment = function (file, index) {
          FilesService.create(file,
            function (progress) {
              $scope.ticketAttachments[index].progress = 100 * (progress.loaded / progress.total);
              $scope.$apply();
            },
            function (finish) {
              $scope.ticketFilesId.push(finish.id)
            }, function (error) {
            });
        }

        $scope.saveTicket = function (form) {
          if (form.$valid) {
            $scope.ticket.attachFileIds = $scope.ticketFilesId;
            //TicketsService.createTicket($scope.ticket);
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
        }

      }]);

}());
