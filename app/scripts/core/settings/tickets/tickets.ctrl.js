'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.ticketsCtrl',
    ['$scope', 'CompaniesService',
      function ($scope, CompaniesService) {

        $scope.companyForSettingPage = CompaniesService.getCompanyForSettingPage(function () {
          $scope.companyForSettingPage = $scope.companyForSettingPage.staticCopy();
        });

        $scope.$watch('companyForSettingPage.addresses[0].address', function (address) {
          $scope.isCurrentCompanyAddressEmpty = !address;
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

      }]);

}());
