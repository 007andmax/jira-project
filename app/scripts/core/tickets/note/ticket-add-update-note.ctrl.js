'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateNoteCtrl',
      ['$scope', 'FilesService',
        function ($scope, FilesService) {

          var uploadingAttachmentsCount = 0;

          setTicketUpdateToDefault();

          function setTicketUpdateToDefault() {

            $scope.setTicketUpdate({
              note: '',
              attachments: []
            });
          }

          $scope.isValidTicketUpdate = function () {
            return $scope.ticketUpdate.note.length > 0 && $scope.ticketUpdate.note.length < 65000;
          };

          $scope.addAttachmentFiles = function (file) {
            $scope.ticketUpdate.attachments.push(file);
            $scope.$apply();
            $scope.disabledWhenLoadAttachment = true;

            uploadingAttachmentsCount++;

            FilesService.create(file,
              function (progress) {
                file.progress = 100 * (progress.loaded / progress.total);
                $scope.$apply();
              },
              function (finish) {

                if (--uploadingAttachmentsCount === 0) {
                  $scope.disabledWhenLoadAttachment = false;
                  $scope.$apply();
                }

                file.id = finish.id;
              }, function (error) {
              });
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

          $scope.styleProgressBar = function (progress) {
            return {
              width: progress + '%'
            };
          };

          $scope.removeAttachment = function (index) {
            $scope.ticketUpdate.attachments.splice(index, 1);
          };

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid;
          };

          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault)

        }]);
  }()
);

