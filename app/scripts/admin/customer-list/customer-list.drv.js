'use strict';

(function(){

  angular.module('admin.directives', []).component("customerList",{
    templateUrl: '/html/scripts/admin/customer-list/customer-list.html',
    bindings: {},
    controller: customerListCtrl
  });

  customerListCtrl.$inject = ['$scope', 'CustomerListService'];
  function customerListCtrl($scope, CustomerListService) {

    $scope.customerList;
    $scope.customerListOrder = 'createDate';

    $scope.parseDate = Date.parse.bind(Date);

    $scope.customerListDateRange = 'TOTAL';

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

    CustomerListService.getCustomerList($scope, function(resp){
      console.log("resp ", resp);
      $scope.customerList = resp;
    });

    // $scope.removeCustomer = function(customer) {
    //
    // };

    $scope.changeCustomerListDateRange = function(range) {
      $scope.customerListDateRange = range;
    };





    // $scope.changeOrder = function(order) {
    //   $scope.customerListOrder = order;
    //   console.log($scope.customerListOrder);
    // }

  }

})();

