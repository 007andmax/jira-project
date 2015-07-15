'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.createTicketCtrl',
    ['$scope', '$modalInstance', 'TicketsService', 'FilesService', 'CompaniesService', 'UsersService',
      function ($scope, $modalInstance, TicketsService, FilesService, CompaniesService, UsersService) {

        $scope.ticket = {};

        $scope.ticketPriorityValue = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High'
        };

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

        $scope.saveTicket = function () {
          if (false) {

          } else {
            $scope.triedToSaveTicket = true;
          }
        };

        $scope.closeCreateTicketForm = function () {
          $modalInstance.dismiss();
        };



        //$scope.$watch('ticket.company.id', function () {
        //  if($scope.ticket.company.id) {
        //    $scope.usersCompany = UsersService.getAllByCompanyId($scope.ticket.company.id);
        //  }
        //});


        //$scope.validateTicket = function (ticket) {
        //  console.log(ticket);
        //  var subject = ticket.subject;
        //  var note = ticket.note;
        //  var company = ticket.company;
        //
        //  ticket.validation = {
        //    subject: {
        //      required: !subject,
        //      maxlength: !!subject && subject.length > 300
        //    },
        //    note: {
        //      required: !note,
        //      maxlength: !!note && note.length > 5000
        //    },
        //    company: {
        //      invalid: !company
        //    }
        //
        //  };
        //  ticket.validation.subject.invalid = ticket.validation.subject.required || ticket.validation.subject.maxlength;
        //  ticket.validation.note.invalid = ticket.validation.note.required || ticket.validation.note.maxlength;
        //
        //};

        //$scope.userCompanies = function() {
        //  if ($scope.ticket.company.id) {
        //    return UsersService.getAllByCompanyId($scope.ticket.company.id);
        //  }
        //};

        //$scope.add = function(){
        //  var f = document.getElementById('file').files[0],
        //    r = new FileReader();
        //  r.onloadend = function(e){
        //    var data = e.target.result;
        //    //send you binary data via $http or $resource or do anything else with it
        //  }
        //  r.readAsBinaryString(f);
        //}


      }]);

}());
