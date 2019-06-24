'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.customerTicketReportCtrl',
    ['$scope', 'CompaniesService', 'UsersService', '$rootScope', '$sce', '$filter',
      function ($scope, CompaniesService, UsersService, $rootScope, $sce, $filter) {
        var renderFinished = {
          tickets: false,
          chart: false
        };

        $scope.dateFormat = '%d %b';
        $scope.frequency = 'DAILY';


        $scope.getCompanyById = CompaniesService.getOneById;
        $scope.getUserById = UsersService.getOneById;
        $scope.getUserName = $rootScope.getUserName;
        $scope.dateParse = Date.parse.bind(Date);
        // $scope.showTotalAmount = true;
        //
        // $scope.$on('changeShowTotalAmount', function(response){
        //   $scope.showTotalAmount = response;
        // });

        $scope.$watch('data', function (data) {
          if (data) {
            if (data.ticketsPerDate && data.ticketsPerDate.length) {
              $scope.reportChartData = [];
              for (var i = 0; i < data.ticketsPerDate.length; i++) {
                var item = data.ticketsPerDate[i];
                if (item.ticketResolved) {
                  $scope.reportChartData.push(item);
                }
              }
            }

            data.startDate = new Date(data.startDate);
            data.endDate = new Date(data.endDate);
          }
        });


        $scope.parseDate = function (values) {
          var result = [];
          for (var i = 0; i < values.length; i++) {
            var item = values[i];
            result.push($filter('date')(new Date(item.date), 'dd MMM'));
          }
          return result;
        };

        $scope.groupBars = function (data) {
          var result = [];
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (result.indexOf(item.ticketResolved) === -1) {
              result.push(item.ticketResolved);
            }
          }
          return result;
        };

        $scope.timeToHoursAndMinutes = function (time, small) {
          var hours = Math.floor(time) || 0,
            minutes = Math.round((time - hours) * 60) || 0;

          if (small) {
            return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
          } else {
            return (hours ? hours + ' hours ' : '') + (minutes ? minutes + ' min' : '');
          }
        };

        $scope.getTrustedHtml = function (html) {
          if (html) {
            return $sce.trustAsHtml(html);
          } else {
            return '';
          }
        };

        $scope.getPdfName = function (data) {
          if (data) {
            var companyName = $scope.getCompanyById(data.companyId).name.toLowerCase().split(' ').join('-');
            if (data.userId) {
              var userName = $scope.getUserName($scope.getUserById(data.userId)).toLowerCase().split(' ').join('-');
              return 'customer-report-' + companyName + '-' + userName;
            } else {
              return 'customer-report-' + companyName;
            }
          }
        };

        $scope.buildPdf = function (part) {
          renderFinished[part] = true;
          if (renderFinished['tickets'] && renderFinished['chart']){
            if($scope.ticketReport) {
              $rootScope.$broadcast('buildPdf-' + $scope.getPdfName($scope.ticketReport))
            } else {
              $rootScope.$broadcast('buildPdf-' + $scope.getPdfName($scope.data));
            }
          }
        };

      }]);

}());
