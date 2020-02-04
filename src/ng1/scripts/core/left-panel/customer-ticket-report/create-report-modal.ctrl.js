'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.createReportCtrl',
    ['$scope', '$uibModalInstance', 'CompaniesService', 'UsersService', 'StatisticsService', '$rootScope',
      function ($scope, $uibModalInstance, CompaniesService, UsersService, StatisticsService, $rootScope) {

        $scope.today = Date.now();
        $scope.currentCompany = CompaniesService.getCurrentCompany();
        $scope.clientCompanies = CompaniesService.getClientCompanies();
        $scope.clientUsers = UsersService.getClientUsers();

        $scope.dto = {
          companyId: '',
          userId: '',
          startDate: new Date($scope.currentCompany.createdAt),
          endDate: new Date,

          withTimeSpent: true,
          withResponseTime: true,
          extendedReport: false,
          showTotalTicketAmount: true
        };
        // $scope.showTotalAmount = true;
        // $scope.$watch('showTotalAmount', function(newData) {
        //   console.log(newData);
        //   $rootScope.$broadcast('changeShowTotalAmount', 'newData');
        // });


        $scope.dismiss = $uibModalInstance.dismiss;

        $scope.$watch('dto.company.id', function (selectedCompanyId) {
          if (!selectedCompanyId) {
            $scope.dto.user = undefined;
            $scope.dto.userId = undefined;
          }
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.triedToSave || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.filterUsers = function (value) {
          return function (item) {
            var selectedCompanyId = $scope.dto.company && $scope.dto.company.id;
            if (selectedCompanyId && item.company.id !== selectedCompanyId) {
              return false;
            }

            if (value && value.length > 0 && (value !== '[$empty$]')) {
              var userEmail = (item.primaryEmail && item.primaryEmail.length > 0) ? ' ' + item.primaryEmail.toLowerCase() : '';
              var fullSearchField = $scope.getUserName(item).toLowerCase() + userEmail;

              return fullSearchField.indexOf(value.toLowerCase()) !== -1;
            }
            return true;
          }
        };

        $scope.onUserSelect = function (user) {
          $scope.dto.company = CompaniesService.getOneById(user.company.id);
        };

        $scope.onDateRangeSelect = function (selectedDates) {
          var from = selectedDates[0], to = selectedDates[1];
          var dto = $scope.dto;
          if (from) {
            dto.startDate = from;
          }
          if (to) {
            dto.endDate = to;
          }
        };

        $scope.getCustomerTicketReport = function (form) {
          if (form.$valid) {
            var dto = $scope.dto;
            dto.startDate = formatDate(new Date(dto.startDate || $scope.currentCompany.createdAt));
            dto.endDate = formatDate(new Date(dto.endDate || undefined));
            dto.companyId = dto.company.id;
            if (dto.user) {
              dto.userId = dto.user.id;
            }

            StatisticsService.getCustomerTicketReport(dto, function (data) {
              $scope.customerReport = data;
              $scope.customerReport.showTotalTicketAmount = dto.showTotalTicketAmount;
              $scope.dismiss();
            });
          } else {
            $scope.triedToSave = true;
          }
        };

        function formatDate(date) {
          if (!date || !date.getTime()) {
            return null;
          }
          return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        }

      }]);

}());
