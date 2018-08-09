'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoBasicInfoCtrl',
    ['$scope', 'CompaniesService', '$rootScope',
      function ($scope, CompaniesService, $rootScope) {

        $scope.validateCompanyName = function (ngModelCtrl, modelId, afterValidationCallback) {
          var validationResult = CompaniesService.isNameUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.$watch('editCompany.logo', function (newValue) {
          if (newValue !== undefined && $scope.companyForSettingLoad) {
            $scope.saveBasicInfo($scope.basicInfoForm);
          }
        }, true);


        $scope.$watch(function() {
          return $rootScope.updateTech;
        }, function(val) {
          console.log('updatedTECH')
          if (val) {
            $scope.saveBasicInfo(val);
          }
        })

        $scope.saveBasicInfo = function (form) {

          if (form.$valid) {
            var basicInfo = {
              logo: $scope.editCompany.logo,
              name: $scope.editCompany.name,
              description: $scope.editCompany.description
            };

            CompaniesService.saveForCompanyProfile(basicInfo, 'basic', function () {
              form.$setPristine();
            });
          }
        };

      }]);

}());
