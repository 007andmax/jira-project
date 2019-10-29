'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.ticketsCtrl',
    ['$scope', 'CompaniesService', 'UsersService', '$rootScope', '$filter',
      function ($scope, CompaniesService, UsersService, $rootScope, $filter) {
        var counter = 0;


        // CompaniesService.getReferenceDate(function(val) {
        //   $scope.referenceDate = $filter('date')(new Date(val.data.accountingStartDate), 'dd MMM yyyy');
        // });

        $scope.resetReferenceDate = function() {
          CompaniesService.resetReferenceDate();
          $scope.referenceDate = null;
        };

        $scope.timePickerModel = CompaniesService.getCurrentCompany().serviceExpenseDurationPresentation ?
        CompaniesService.getCurrentCompany().serviceExpenseDurationPresentation
          : 'DURATION_PICKER';
          console.log('$rootScope.currentUser',CompaniesService.getCurrentCompany());
        $scope.timePickerInterval = CompaniesService.getCurrentCompany().serviceExpenseDurationPickerInterval ?
        CompaniesService.getCurrentCompany().serviceExpenseDurationPickerInterval
          : 'FIVE_MINUTES';
        $scope.setTimePickerInterval = function (type) {
          $scope.timePickerInterval = type;
          console.log('test');
         
          UsersService.changeTimePickerType($scope.timePickerModel,type);
        };
        $scope.setTimePickerValue = function (type) {
          $scope.timePickerModel = type;
          $scope.timePickerInterval = ($scope.timePickerModel == 'DURATION_PICKER') ? 'FIVE_MINUTES'  : 'ONE_MINUTE';
          console.log('test');
          $rootScope.currentUser.serviceExpenseDurationPresentation = type;
          UsersService.changeTimePickerType(type,$scope.timePickerInterval);
        };

        $scope.companyForSettingPage = CompaniesService.getCompanyForSettingPage(function () {
          $scope.companyForSettingPage = $scope.companyForSettingPage.staticCopy();
        });

        $scope.$watch('companyForSettingPage.addresses[0].address', function (address) {
          $scope.isCurrentCompanyAddressEmpty = !address;
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

        $scope.$watch('referenceDate', function(val) {



          if (val) {

            if (!counter) {
              counter++;
              return;
            }

            CompaniesService.setReferenceDate(new Date(val).getTime());
          }
        }, true)

      }]);

}());
