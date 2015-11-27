'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoBasicInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService',
      function ($scope, $state, $stateParams, $location, CompaniesService) {

        $scope.techDomainName =  $scope.companyForSettingPage.techDomain.split('.')[0];

        $scope.validateCompanyName = function (ngModelCtrl) {
          var validationResult = CompaniesService.isNameUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.saveBasicInfo = function(form){

          $scope.savingBasicInfoInProcess = true;

          var basicInfo = {
            logo: $scope.editCompany.logo,
            name: $scope.editCompany.name,
            supportMailBox: $scope.companyForSettingPage.supportMailBox,
            techDomain: $scope.techDomainName,
            businessEmail: $scope.companyForSettingPage.businessEmail,
            description: $scope.editCompany.description
          };

          CompaniesService.saveForCompanyProfile(basicInfo, 'basic', function (a){
            console.log(a);
            $scope.savingBasicInfoInProcess = false;
            form.$setPristine();
          })
        };

        $scope.$watch('editCompany.name', function(){
          if(!$scope.editCompany.name){
            return;
          }

          var validationResult = CompaniesService.isDomainUnique($scope.editCompany.name, $scope.editCompany.id || '', function () {
            $scope.basicInfoForm.supportMailBox.$setValidity('uniqueDomain', !validationResult.value);
            $scope.basicInfoForm.supportMailBox.$setDirty();
          });
        })

      }]);

}());
