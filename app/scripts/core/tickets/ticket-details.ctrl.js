'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsCtrl',
      ['$scope', 'TicketsService', '$stateParams', 'UsersService', 'CompaniesService', 'Downloader', '$state', 'ProductsService', '$sce',
        function ($scope, TicketsService, $stateParams, UsersService, CompaniesService, Downloader, $state, ProductsService, $sce) {

          $scope.ticketTags = {};
          $scope.allUpdatesLoaded = false;
          $scope.currentOpenTab = 'NOTE';
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

          $scope.productCategories = ProductsService.getCategories($scope);
          $scope.ticketDetails = TicketsService.getOne($stateParams.ticketId, $scope, true, function () {

            $scope.user = UsersService.getOneById($scope.ticketDetails.createdUser.id);
            $scope.company = CompaniesService.getOneById($scope.ticketDetails.company.id);
            if ($scope.ticketDetails.assignPerformer && $scope.ticketDetails.assignPerformer.id) {
              $scope.assignPerformer = UsersService.getOneById($scope.ticketDetails.assignPerformer.id);
            }

            $scope.$broadcast('ticketDetailsLoad');

          });

          $scope.setTicketTags = function () {
            for (var j = 0; j < $scope.ticketDetails.tags.length; j++) {
              $scope.ticketTags[$scope.ticketDetails.tags[j].id] = true;
            }
          };

          $scope.setTicketUpdate = function (value) {
            $scope.ticketUpdate = value;
          };

          $scope.updateAndCloseTicket = function () {
            TicketsService.changeStatus($scope.ticketDetails.id, 'COMPLETED', function () {
              $state.go('tickets', {listType: $stateParams.listType});
            });
          };

          $scope.collapseTicket = function () {
            $state.go('tickets', {listType: $stateParams.listType});
          };

          $scope.claimTicket = function () {
            TicketsService.assignTo($scope.ticketDetails.id, $scope.currentUser.id)
          };

          $scope.openSetting = function () {
            $scope.isOpenSettings = true;
          };

          $scope.changeTicketPriority = function (priority) {
            TicketsService.changePriority($scope.ticketDetails.id, priority);
          };

          $scope.changeTicketStatus = function (status) {
            TicketsService.changeStatus($scope.ticketDetails.id, status);
          };

          $scope.moveIntoSpam = function () {
            TicketsService.changeSpamFlag($scope.ticketDetails.id, true, function () {
              $state.go('tickets', {listType: $stateParams.listType});
            });
          };

          $scope.moveToTrash = function (movedWay) {
            TicketsService.changeTrashFlag($scope.ticketDetails.id, movedWay, function () {
              $state.go('tickets', {listType: $stateParams.listType});
            });
          };

          $scope.downloadAllAttachments = function () {
            Downloader.downloadTicketAttachments($scope.ticketDetails.id)
          };

          $scope.downloadAttachment = function (attachmentId) {
            Downloader.downloadFile(attachmentId)
          };

          $scope.loadMoreUpdates = function () {
            TicketsService.loadRemainingTicketUpdates($scope.ticketDetails, function () {
              $scope.allUpdatesLoaded = false;
            })
          };

          $scope.openFullSharedUsers = function () {
            $scope.isFullSharedUserShow = true;
          };

          $scope.closeFullSharedUsers = function () {
            $scope.isFullSharedUserShow = false;
          };

          $scope.openedTab = function (tabName) {
            $scope.currentOpenTab = tabName;
          };

          $scope.postTicketUpdate = function () {
            console.log('post update ticket' + $scope.ticketDetails.id);
          };

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

          $scope.getUserById = function (userId) {
            return UsersService.getOneById(userId);
          };

          $scope.saveTicketUpdate = function(){
            console.log($scope.ticketUpdate)
          };

          $scope.getTicketNote = function() {
            return $sce.trustAsHtml($scope.ticketDetails.note);
          };

        }]);
  }()
);

