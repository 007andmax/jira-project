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

        $scope.timePickerModel = $rootScope.currentUser.serviceExpenseDurationPresentation ?
          $rootScope.currentUser.serviceExpenseDurationPresentation
          : 'DURATION_PICKER';

        $scope.setTimePickerValue = function (type) {
          $scope.timePickerModel = type;
          console.log('test');
          $rootScope.currentUser.serviceExpenseDurationPresentation = type;
          UsersService.changeTimePickerType(type);
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
