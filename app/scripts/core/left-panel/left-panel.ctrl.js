'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'TicketsService', 'TicketTagsService', '$stateParams', 'quicktech.common.services.PermissionsService',
      'FilesService', 'Downloader', '$state',
      function ($scope, TicketsService, TicketTagsService, $stateParams, PermissionsService, FilesService, Downloader, $state) {

        $scope.$state = $state;
        $scope.ticketCounts = TicketsService.getCounts($scope);
        $scope.PermissionsService = PermissionsService;

        $scope.$watch(function () {

          if (!$stateParams.listType) {
            return 0;
          }
          return $scope.ticketCounts[$stateParams.listType.toUpperCase()];

        }, function () {
          $scope.listType = $stateParams.listType;
        });

        // todo remove when generatePdf feature not needed
        $scope.ticketAttachments = [];

        $scope.generatePdf = function (file) {

          FilesService.create(file,
            function (progress) {

            },
            function (finish) {

              Downloader.downloadByUrl('/data/generatePdf?fileId=' + finish.id);


            }, function (error) {
            });
        };

        $scope.toogleCollapse = function (item) {

          if (item === $scope.collapseItem) {
            $scope.collapseItem = '';
            return;
          }

          $scope.collapseItem = item;
        };

        $scope.$watch(function () {
          return location.hash
        }, function (value) {

          var typePage = value.split('/')[1];

          if(typePage !== 'settings'){
            $scope.collapseItem = typePage.toUpperCase();
          } else {
            $scope.collapseItem = '';
          }

        });

      }]);

}());
