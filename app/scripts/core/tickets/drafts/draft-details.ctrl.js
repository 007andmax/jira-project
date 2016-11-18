'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.draftDetailsCtrl',
    ['$scope', 'DraftsService', '$stateParams', '$state', '$sce', 'Downloader', '$rootScope',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.PermissionsService',
      function ($scope, DraftsService, $stateParams, $state, $sce, Downloader, $rootScope, UserConfirmationsService,
                UserNotificationService, PermissionsService) {
        if (!$stateParams.draftId) {
          $state.go('drafts');
        }

        $scope.attachmentTypePattern = /[0-9a-z]+$/i;
        $scope.attachmentType = {
          'image/jpg': 'jpg',
          'image/jpeg': 'jpeg',
          'image/bmp': 'bmp',
          'image/gif': 'gif',
          'image/png': 'png',
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
        $scope.attachmentImageClass = {
          'image/jpg': 'viewable',
          'archive/zip': 'zip',
          'image/bmp': 'not-viewable'
        };

        DraftsService.getFullDraft($stateParams.draftId, function (resp) {
          $scope.draftDetails = resp;
          $rootScope.$broadcast('draftDetailsLoad');
          $rootScope.$broadcast('openDraftSource', resp.source, resp.id);
        });

        $scope.toggleDraftsList = function () {
          $rootScope.$broadcast('toggleDraftsList');
        };

        $scope.deleteForever = function () {
          var confirmMesage = 'The inbox will become inaccessible. Continue with permanent deletion?',
            confirmButton = 'Delete';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            DraftsService.deleteForever([$scope.draftDetails.id], function () {
              UserNotificationService.show('The inbox “' + $scope.draftDetails.number + '” has been deleted', true);
              $state.go('drafts').then(function () {
                $rootScope.$broadcast('uncheckIfSelectedDraft', $scope.draftDetails.id);
              });
            });
          });
        };

        $scope.getDraftNote = function () {
          return $scope.draftDetails ? $sce.trustAsHtml($scope.draftDetails.note) : '';
        };

        $scope.downloadAllAttachments = function () {
          Downloader.downloadDraftAttachments($scope.draftDetails.id);
        };

        $scope.downloadAttachment = function (attachmentId, fileName) {
          Downloader.downloadFile(attachmentId, fileName)
        };

        $scope.isProceedAllowed = function () {
          return PermissionsService.isAllowed('CREATE_USERS') && PermissionsService.isAllowed('CREATE_COMPANIES');
        };

      }]);
}());
