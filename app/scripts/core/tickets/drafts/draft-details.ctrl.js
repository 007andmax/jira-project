'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.draftDetailsCtrl',
    ['$scope', 'DraftsService', '$stateParams', '$state', '$sce', 'Downloader',
      function ($scope, DraftsService, $stateParams, $state, $sce, Downloader) {
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
          angular.element(document.body).addClass('opened-ticket');//move to directive
        });

        $scope.deleteForever = function (draftId) {
          DraftsService.deleteForever(draftId);
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

      }]);
}());
