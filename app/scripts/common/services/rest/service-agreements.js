'use strict';


(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('AgreementsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {

    var urlForGetAllServiceAgreements = '/serviceAgreements';

    function getAllServiceAgreements(callback) {
      var future = $http({
        url: urlForGetAllServiceAgreements,
        method: 'GET'
      });

      Utils.handleCallback(future, callback);
    }






    return {
      getAllServiceAgreements: getAllServiceAgreements
    }


    }])

})(window);
