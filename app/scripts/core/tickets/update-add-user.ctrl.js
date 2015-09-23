'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.updateAddUserCtrl',
      ['$scope', 'UsersService', 'CompaniesService',
        function ($scope, UsersService, CompaniesService) {

          $scope.currentAddUserTab = 'TEAM_MEMBER';

          $scope.agents = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id);
          $scope.clients = UsersService.getClientUsers();
          // TODO get vendor's contscts

          $scope.openAddUserTab = function (mode) {

            switch (mode) {

              case 'TEAM_MEMBER':
                $scope.currentAddUserTab = 'TEAM_MEMBER';
                return;

              case 'VENDOS':
                $scope.currentAddUserTab = 'VENDOS';
                return;

              case 'CLIENT_USER':
                $scope.currentAddUserTab = 'CLIENT_USER';
                return;
            }
          }

        }]);
  }()
);
