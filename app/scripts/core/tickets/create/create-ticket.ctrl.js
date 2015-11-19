'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.createTicketCtrl',
    ['$scope', '$modalInstance', 'TicketsService', 'FilesService', 'CompaniesService', 'UsersService',
      'quicktech.common.services.UserNotificationService', '$timeout',
      function ($scope, $modalInstance, TicketsService, FilesService, CompaniesService, UsersService, UserNotificationService, $timeout) {

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

        TicketsService.getActualNumber($scope, function (number) {
            $scope.ticketNumber = number;
          }
        );

        $scope.addAttachmentFiles = function (file) {

          $scope.ticketAttachments.push(file);
          $scope.$apply();

          FilesService.create(file,
            function (progress) {
              file.progress = 100 * (progress.loaded / progress.total);
              $scope.$apply();
            },
            function (finish) {
              file.id = finish.id;
            }, function (error) {
            });
        };

        $scope.removeAttachment = function (index) {
          $scope.ticketAttachments.splice(index, 1);
        };

        $scope.reloadAttachment = function (file) {
          FilesService.create(file,
            function (progress) {
              file.progress = 100 * (progress.loaded / progress.total);
              $scope.$apply();
            },
            function (finish) {
              file.id = finish.id;
            }, function (error) {
            });
        };

        $scope.saveTicket = function (form) {
          if (form.$valid) {
            $scope.savingInProcess = true;

            $scope.ticket.attachFileIds = [];

            for (var i = 0; i < $scope.ticketAttachments.length; i++) {
              $scope.ticket.attachFileIds.push($scope.ticketAttachments[i].id);
            }

            TicketsService.createTicket($scope.ticket, function () {
              $scope.savingInProcess = false;
              $modalInstance.dismiss();
              UserNotificationService.show('New Ticket “' + $scope.ticketNumber + '” has been created', true);
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

        $scope.$watch('searchCompany', function () {

          if (!($scope.searchCompany && $scope.clientCompanies)) {
            return
          }

          for (var i = 0; i < $scope.clientCompanies.length; i++) {
            if ($scope.searchCompany.toLowerCase() === $scope.clientCompanies[i].name.toLowerCase()) {
              $scope.usersCompany = UsersService.getAllByCompanyId($scope.clientCompanies[i].id);
              $scope.ticket.company = $scope.clientCompanies[i].id;
              $scope.searchCompany = $scope.clientCompanies[i].name;

              return;
            } else {
              $scope.ticket.company = '';
            }
          }
        });

        $scope.$watch('searchUser', function () {

          if (!($scope.searchUser && $scope.usersCompany)) {
            return
          }

          for (var i = 0; i < $scope.usersCompany.length; i++) {
            var userName = $scope.getUserName($scope.usersCompany[i]);

            if ($scope.searchUser.toLowerCase() === userName.toLowerCase()) {

              $scope.ticket.createdUser = $scope.usersCompany[i].id;

              return;
            } else {
              $scope.ticket.createdUser = '';
            }
          }
        });

        $scope.$watch('ticketAssignTo', function () {

          if (!($scope.ticketAssignTo && $scope.usersCurrentCompany)) {
            return
          }

          for (var i = 0; i < $scope.usersCurrentCompany.length; i++) {
            var userName = $scope.getUserName($scope.usersCurrentCompany[i]);

            if ($scope.ticketAssignTo.toLowerCase() === userName.toLowerCase()) {

              $scope.ticket.assignedUser = $scope.usersCurrentCompany[i].id;

              return;
            } else {
              $scope.ticket.assignedUser = '';
            }
          }
        });

        $scope.chooseCompany = function (company) {
          $scope.usersCompany = UsersService.getAllByCompanyId(company.id);
          $scope.ticket.company = company.id;
          $scope.searchCompany = company.name
        };

        $scope.chooseUser = function (user) {
          $scope.ticket.createdUser = user.id;
          $scope.searchUser = $scope.getUserName(user);
        };

        $scope.chooseAssignedUser = function (assignedUser) {
          $scope.ticket.assignedUser = assignedUser.id;
          $scope.ticketAssignTo = $scope.getUserName(assignedUser);
        };

        $scope.validationMessage = function (form) {

          if (form.$pristine) {
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

        $scope.filterCreatedForUser = function (item) {
          if ($scope.searchUser && $scope.searchUser.length > 0) {
            return ((item.firstName + ' ' + item.lastName + ' ' + item.primaryEmail).toLowerCase()).indexOf($scope.searchUser.toLowerCase()) !== -1;
          }

          return true;
        };

        $scope.filterAssignedToUser = function (item) {
          if ($scope.ticketAssignTo && $scope.ticketAssignTo.length > 0) {
            return ((item.firstName + ' ' + item.lastName + ' ' + item.primaryEmail).toLowerCase()).indexOf($scope.ticketAssignTo.toLowerCase()) !== -1;
          }

          return true;
        };

      }]);

}());
