'use strict';

(function () {

  var adminServices = angular.module('admin.services', []);

  adminServices.factory('CustomerListService', ['$http', function ($http) {

    var urlForCustomerList = '/admin';

    function handleCallback(future, callback) {
      if (callback) {
        future.then(function (resp) {
          callback(resp.data);
        }, function (resp) {
          callback(resp.data);
        });
      }
    }

    function getRequest(url, callback) {
      var future = $http({
        url: url,
        method: 'GET'
      });
      handleCallback(future, callback);
    }

    function getCustomerList(scope, callback) {
      var customerList = {};
      getRequest(urlForCustomerList, function(resp) {
        customerList = resp;
        callback && callback(customerList);
      })
    }



    return {
      getCustomerList: getCustomerList
    }

  }])

})();
