'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.ticketsCtrl',
    ['$scope', 'CompaniesService', '$filter',
      function ($scope, CompaniesService, $filter) {
        var counter = 0;


        CompaniesService.getReferenceDate(function(val) {

          // $scope.referenceDate = moment(val.data.accountingStartDate).format('dd MMM yyyy');
          $scope.referenceDate = $filter('date')(new Date(val.data.accountingStartDate), 'dd MMM yyyy');
          // $scope.referenceDate = new Date(val.data.accountingStartDate).toISOString();


        })


        $scope.resetReferenceDate = function() {
          CompaniesService.resetReferenceDate();

          $scope.referenceDate = null;
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
