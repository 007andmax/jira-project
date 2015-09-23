'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateNoteCtrl',
      ['$scope', 'FilesService',
        function ($scope, FilesService) {

          $scope.setTicketUpdate({
            note: '',
            ticketAttachments: []
          });

          $scope.isValidTicketUpdate = function () {
            return $scope.ticketUpdate.note.length > 0;
          };

          $scope.addAttachmentFiles = function (file) {
            $scope.ticketUpdate.ticketAttachments.push(file);
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

          $scope.styleProgressBar = function (progress) {
            return {
              width: progress + '%'
            };
          };

          $scope.removeAttachment = function (index) {
            $scope.ticketUpdate.ticketAttachments.splice(index, 1);
          };

        }]);
  }()
);

