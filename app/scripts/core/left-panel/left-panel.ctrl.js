'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'TicketsService', 'TicketTagsService', '$stateParams', 'quicktech.common.services.PermissionsService', 'FilesService', 'Downloader',
      function ($scope, TicketsService, TicketTagsService, $stateParams, PermissionsService, FilesService, Downloader) {

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

        $scope.toogleCollapse = function(item){

          if(item === $scope.collapseItem){
            $scope.collapseItem = '';
            return;
          }

          $scope.collapseItem = item;
        }

      }]);

}());
