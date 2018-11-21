'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateNoteCtrl',
      ['$scope', 'FilesService',
        function ($scope, FilesService) {

          var uploadingAttachmentsCount = 0;

          $scope.fileInfo = { quantityErrorFiles: 0 };

          setTicketUpdateToDefault();

          function setTicketUpdateToDefault() {
            if ($scope.editExpense) return;
            $scope.setTicketUpdate({
              note: '',
              attachments: []
            });
          }

          $scope.addAttachmentFiles = function (file) {
            // console.log(file, 'file to upload')
            $scope.ticketUpdate.attachments.push(file);
            $scope.disabledWhenLoadAttachment = true;

            uploadingAttachmentsCount++;
            if (file.size < 4194304) {
              file.xhr = FilesService.create(file,
                function (progress) {
                  file.progress = 100 * (progress.loaded / progress.total);
                  $scope.$apply();
                },
                function (finish) {

                  if (finish.code === 400 || finish.code === 500) {

                    var message = finish.code === 500 ? 'Maximum upload size of 4 MB' : finish.message;

                    $scope.fileInfo[file.name] = {
                      error: true,
                      message: message,
                      code: finish.code
                    };

                    $scope.fileInfo.quantityErrorFiles++;
                    $scope.updateTicketNote.$setValidity('errorFile', false);
                  }

                  if (--uploadingAttachmentsCount === 0) {
                    $scope.disabledWhenLoadAttachment = false;
                  }

                  file.xhr = null;
                  file.id = finish.id;
                  $scope.$apply();
                }, function (error) {
                });
            } else {
              $scope.fileLoadOrError = true;

              $scope.fileInfo[file.name] = {
                error: true,
                message: 'File must be less then 4 MB'
              };

              $scope.fileInfo.quantityErrorFiles++;
              $scope.ticketForm.$setValidity('errorFile', false);
            }

            $scope.$apply();
          };

          $scope.reloadAttachment = function (file) {
            if ($scope.fileInfo[file.name] && $scope.fileInfo[file.name].error) {
              return;
            }
            if (file.xhr && file.xhr.abort) {
              file.xhr.abort();
            }
            file.xhr = FilesService.create(file,
              function (progress) {
                file.progress = 100 * (progress.loaded / progress.total);
                $scope.$apply();
              },
              function (finish) {
                file.xhr = null;
                file.id = finish.id;
                $scope.$apply();
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

          $scope.$watch('ticketUpdate.attachments.length', function (val) {

            if (!val) return;

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
