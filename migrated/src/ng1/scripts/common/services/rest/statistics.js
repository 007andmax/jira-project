'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('StatisticsService', ['$http', 'Utils',
    function ($http, Utils) {

    

      function getCustomerTicketReport(dto, callback) {
        var future = $http.post('/customerReport', dto);
        Utils.handleCallback(future, callback);
      }

      return {
        getCustomerTicketReport: getCustomerTicketReport
      }
    }

  ])
  ;

})(window, jQuery);
