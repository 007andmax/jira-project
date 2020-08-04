'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('BillableService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {
      function getExistTimeByLockId(lockId, callback) {

        if (!lockId) {
          throw 'lockId is required!'
        }
        var future = $http.get('/invoice/lock/timeToUnlock/' + lockId);
        Utils.handleCallback(future, callback);
      }
      
      return {
        getExistTimeByLockId:getExistTimeByLockId
      }

    }]);

})(window, jQuery);
