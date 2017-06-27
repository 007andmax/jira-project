'use strict';

(function(){

  angular.module('admin.directives', []).component("customerList",{
    templateUrl: '/html/scripts/admin/customer-list/customer-list.tpl.html',
    bindings: {},
    controller: customerListCtrl
  });

  customerListCtrl.$inject = ['$scope', 'CustomerListService'];
  function customerListCtrl($scope, CustomerListService) {


  }

})();
