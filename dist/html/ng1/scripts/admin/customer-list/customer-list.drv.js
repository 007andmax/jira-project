'use strict';

(function () {

  angular.module('admin.directives', []).component("customerList", {
    templateUrl: '/html/scripts/admin/customer-list/customer-list.html',
    bindings: {},
    controller: customerListCtrl
  });

  customerListCtrl.$inject = ['$scope', 'CustomerListService'];
  function customerListCtrl($scope, CustomerListService) {

    $scope.customerList;
    $scope.customerListOrder = 'createDate';

    $scope.parseDate = Date.parse.bind(Date);

    $scope.customerListLastDate = 'TOTAL';
    //$scope.todayDate = new Date();
    $scope.dateRange;

    $scope.availableOrder = [
      {name: 'Create Date', value: 'createDate'},
      {name: 'Company name', value: 'companyName'},
      {name: 'Short name', value: 'shortName'},
      {name: 'Primary contact', value: 'primaryContactName'},
      {name: 'E-mail', value: 'email'},
      {name: 'Subscription', value: 'subscription'},
      {name: 'Agents', value: 'agentCount'},
      {name: 'Last logon', value: 'lastLogon'},
      {name: 'Status', value: 'status'}
    ];

    // $scope.availableOrder = {
    //   createDate: 'Create Date',
    //   companyName: 'Company name',
    //   shortName: 'Short name',
    //   primaryContactName: 'Primary contact',
    //   email: 'E-mail',
    //   subscription: 'Subscription',
    //   agentCount: 'Agents',
    //   lastLogon: 'Last logon',
    //   status: 'Status'
    // };

    CustomerListService.getCustomerList($scope, function (resp) {
      $scope.customerList = resp;
    });

    //DateRange filter
    $scope.dateRangeFilter = function (customerList) {
      return function (item) {
        if ($scope.customerListLastDate === 'TOTAL') {
          return true;
        }
        var todayDate = new Date();
        var minDate;
        switch ($scope.customerListLastDate) {
          case('TODAY'):
            minDate = new Date(todayDate).getTime() - (1 * 24 * 60 * 60 * 1000);
            break;
          case('WEEK'):
            minDate = new Date(todayDate).getTime() - (7 * 24 * 60 * 60 * 1000);
            break;
          case('MONTH'):
            minDate = new Date(todayDate).getTime() - (30 * 24 * 60 * 60 * 1000);
            break;
          default:
            console.log('smth wrong with date');
        }
        var itemDate = new Date(item.createDate);
        if(itemDate.getTime() <= todayDate && itemDate.getTime() >= minDate) {
          return true;
        } else {
          return false;
        }
      }
    };

    $scope.changeCustomerListDateRange = function (range) {
      $scope.customerListLastDate = range;
    };


    // $scope.changeOrder = function(order) {
    //   $scope.customerListOrder = order;
    // }

  }

})();
