'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateNoteCtrl',
      ['$scope', 'FilesService',
        function ($scope, FilesService) {

          var uploadingAttachmentsCount = 0;

          $scope.fileInfo = {quantityErrorFiles: 0};

          setTicketUpdateToDefault();

          function setTicketUpdateToDefault() {

            $scope.setTicketUpdate({
              note: '',
              attachments: []
            });

            $scope.addTicketOwnerToUpdate();
          }

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

                if (finish.code === 400 || finish.code === 500) {

                  $scope.fileInfo[file.name] = {
                    error: true,
                    message: finish.message
                  };

                  $scope.fileInfo.quantityErrorFiles++;
                  $scope.updateTicketNote.$setValidity('errorFile', false);
                }

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

          $scope.removeAttachment = function (index, isErrorFile) {
            if (isErrorFile) {

              $scope.fileInfo.quantityErrorFiles--;

              if ($scope.fileInfo.quantityErrorFiles === 0) {
                $scope.updateTicketNote.$setValidity('errorFile', true);
              }
            }

            $scope.ticketUpdate.attachments.splice(index, 1);
          };

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && !form[fieldName].$valid;
          };

          $scope.$on('setCreateUpdateFormToDefault', setTicketUpdateToDefault);

          $scope.$watch('ticketUpdate.attachments.length', function () {

            var totalAttachSize = 0;

            for (var i = 0; i < $scope.ticketUpdate.attachments.length; i++) {
              totalAttachSize += $scope.ticketUpdate.attachments[i].size;
            }

            if (totalAttachSize > (15 * 1024 * 1024)) {
              $scope.errorAttachSize = 'Attachments must be less than 15 Megabyte';
              $scope.disabledWhenLoadAttachment = true;
            } else {
              $scope.errorAttachSize = false;
              $scope.disabledWhenLoadAttachment = false;
            }

          })

        }]);
  }()
);

