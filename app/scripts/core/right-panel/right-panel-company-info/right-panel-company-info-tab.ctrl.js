'use strict';

(function () {

  angular.module('quicktech.core.rightPanel').controller('quicktech.core.rightPanel.rightPanelCompanyInfoTabCtrl',
    ['$scope', 'CompaniesService', 'DevicesService', 'UsersService',
      function ($scope, CompaniesService, DevicesService, UsersService) {

        $scope.$watch('companyGroupedData.company.id', function (value) {
          $scope.companyContacts = CompaniesService.getCompanyContacts($scope, value);

          DevicesService.isDomainPresent(value, function (resp) {
            $scope.hideLoginPass = resp;
          });

          $scope.downloadAgentUser = {
            name: '',
            password: '',
            companyId: value
          };
        });

        $scope.sendEmailInPopover = function (contactId) {
          var user = UsersService.getOneById(contactId);
          window.open("mailto:" + user.primaryEmail, '_parent');
        };

        $scope.downloadAgent = function () {
          DevicesService.downloadAgent($scope.downloadAgentUser.companyId, $scope.downloadAgentUser.name, $scope.downloadAgentUser.password, function () {
            $scope.isCompanyHasUserNameAndPass = true;
          })
        };

        $scope.formatOffset = function (offset) {
          var minutesOffset = offset / 60000,
            sign = Math.sign(offset) === -1 ? '-' : '+',
            hours = Math.abs(Math.floor(minutesOffset / 60)) || '00',
            minutes = Math.abs(minutesOffset % 60) || '00';

          return '(UTC ' + sign + (hours.toString().length !== 2 ? ('0' + hours) : hours) +
            ':' + (minutes.toString().length !== 2 ? ('0' + minutes) : minutes) + ') ';
        };

      }]);

}());
