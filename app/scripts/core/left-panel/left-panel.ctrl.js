'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'TicketsService', '$stateParams', 'quicktech.common.services.PermissionsService',
      'quicktech.common.services.SharedStateService', 'FilesService', 'Downloader', '$state', 'DevicesService',
      'CompaniesService', '$filter',
      function ($scope, TicketsService, $stateParams, PermissionsService,
                SharedStateService, FilesService, Downloader, $state, DevicesService, CompaniesService, $filter) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession');

        $scope.$state = $state;
        $scope.ticketCounts = TicketsService.getCounts($scope);
        $scope.PermissionsService = PermissionsService;
        $scope.companiesWithDevices = DevicesService.getDevicesCount($scope);

        $scope.$watch('companiesWithDevices', function (value) {
          if (value) {
            $scope.companies = sortByCompanyName(value);
          }
        }, true);

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

          if (!$scope.isLeftPanelOpen) {
            return;
          }

          if ((item === $scope.collapseItem) && item !== 'QUICKSUPPORT') {
            $scope.collapseItem = '';
            return;
          }

          $scope.collapseItem = item;
        };

        $scope.addQuickSession = function () {
          sharedQuickSession.isCreateNew = true;
        };

        $scope.stateGo = function (event, state, stateParams) {
          if (!$scope.isLeftPanelOpen) {
            return;
          }

          if (event.button > 0) {
            var url = $state.href(state, stateParams, { absolute: true });
            window.open(url, '_blank');
          } else {
            $state.go(state, stateParams);
          }

        };

        $scope.$watch(function () {
          return location.hash
        }, function (value) {

          var pageTypes = value.split('/'),
            pageType = pageTypes[1];

          if (pageType !== 'settings') {
            if (pageType === 'clients' && (pageTypes[2] === 'devices' || pageTypes[2] === 'companyDevices')) {
              pageType = 'devices';
            }
            $scope.collapseItem = pageType.toUpperCase();
          } else {
            $scope.collapseItem = '';
          }

        });

        $scope.getCompany = function (id) {
          return CompaniesService.getOneById(id);
        };

        $scope.goToDevicePage = function (event) {
          $scope.toogleCollapse('DEVICES');
          $scope.stateGo(event, 'devices');
        };

        $scope.getCompaniesWithDevicesLength = function () {
          return Object.keys($scope.companiesWithDevices).filter(function (item) {
            return item !== 'staticCopy';
          }).length;
        };

        function sortByCompanyName(value) {
          var companies = [];
          for (var id in value) {
            if (id !== 'staticCopy') {
              var devices = value[id],
                company = CompaniesService.getOneById(id);
              company.devicesCounts = devices;
              companies.push(company);
            }
          }

          return $filter('orderBy')(companies, 'name');
        }

      }]);

}());
