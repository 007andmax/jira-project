'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketsCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams', 'TicketTagsService', 'quicktech.common.services.PermissionsService',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams, TicketTagsService, PermissionsService) {

        var availableTypes = ['unassigned', 'user', 'shared', 'spam'];

        $scope.PermissionsService = PermissionsService;
        $scope.tags = TicketTagsService.getList($scope);
        $scope.users = UsersService.getAllUsers();
        $scope.usersCurrentCompany = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
        $scope.attachmentTypePattern = /[0-9a-z]+$/i;
        $scope.numberPattern = /^\+?[0-9]{0,19}$/;
        $scope.attachmentType = {
          'image/jpg': 'jpg',
          'image/jpeg': 'jpeg',
          'image/bmp': 'bmp',
          'image/gif': 'gif',
          'application/vnd.oasis.opendocument.text': 'odt',
          'application/vnd.oasis.opendocument.spreadsheet': 'ods',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
          'application/vnd.ms-powerpoint': 'ppt',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
          'application/msword': 'doc',
          'application/msxls': 'xls',
          'application/rtf': 'rtf',
          'application/x-rtf': 'rtf',
          'text/plain': 'txt',
          'text/csv': 'cvs'
        };
        $scope.ticketStatus = {
          IN_PROGRESS: 'IN PROGRESS',
          ON_HOLD: 'ON HOLD',
          COMPLETED: 'CLOSED'
        };
        $scope.attachmentImageClass = {
          'image/jpg': 'viewable',
          'archive/zip': 'zip',
          'image/bmp': 'not-viewable'
        };

        if ($scope.currentUser.role === 'ADMIN' || $scope.currentUser.role === 'SUPER_TECH_ADMIN') {
          availableTypes.push('open');
          availableTypes.push('closed');
          availableTypes.push('trash');
        }

        $scope.$watch(function () {
          return $stateParams;
        }, function (stateParams) {

          if (availableTypes.indexOf(stateParams.listType) < 0) {
            $state.go('tickets', {
              listType: availableTypes[0]
            });
          } else {
            $scope.listType = stateParams.listType;
            $scope.currentOpeningTicket = stateParams.ticketId;
          }
        }, true);

        $scope.ticketStatusToCssFormat = function (status) {
          if (status === 'IN_PROGRESS') {
            return 'progress';
          } else if (status === 'COMPLETED') {
            return 'completed';
          } else if (status === 'ON_HOLD') {
            return 'onhold';
          }
        };

      }]);

}());
