'use strict';

(function(){

  angular.module('admin.directives', []).component("customerList",{
    templateUrl: '/app/scripts/admin/customer-list/customer-list.html',
    bindings: {},
    controller: customerListCtrl
  });

  customerListCtrl.$inject = ['$scope', 'CustomerListService'];
  function customerListCtrl($scope, CustomerListService) {


  }

})();

