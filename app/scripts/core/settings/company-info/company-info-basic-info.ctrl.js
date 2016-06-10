'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoBasicInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService',
      function ($scope, $state, $stateParams, $location, CompaniesService) {

        $scope.techDomainName = $scope.companyForSettingPage.techDomain.split('.')[0];

        $scope.validateCompanyName = function (ngModelCtrl) {
          var validationResult = CompaniesService.isNameUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.$watch('editCompany.logo', function (newValue) {
          if (newValue !== undefined && $scope.companyForSettingLoad) {
            $scope.saveBasicInfo($scope.basicInfoForm);
          }
        }, true);

        $scope.saveBasicInfo = function (form) {

          if (form.$valid) {
            var basicInfo = {
              logo: $scope.editCompany.logo,
              name: $scope.editCompany.name,
              supportMailBox: $scope.companyForSettingPage.supportMailBox,
              //techDomain: $scope.techDomainName,
              businessEmail: $scope.companyForSettingPage.businessEmail,
              description: $scope.editCompany.description
            };

            CompaniesService.saveForCompanyProfile(basicInfo, 'basic', function () {
              form.$setPristine();
            });
          }
        };

        $scope.validateCompanyDomain = function (ngModelCtrl) {
          var validationResult = CompaniesService.isDomainUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', !validationResult.value);
          });
        };

        $scope.validateSuppEmailName = function (ngModelCtrl) {
          var validationResult = CompaniesService.isCompanyInboxUnique(ngModelCtrl.$viewValue, function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        }

      }]);

}());
