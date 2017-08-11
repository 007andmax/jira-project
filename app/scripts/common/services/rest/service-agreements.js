'use strict';


(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('AgreementsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {



    function getAllServiceAgreements(callback) {
      var future = $http({
        url: '/serviceAgreements',
        method: 'GET'
      });

      Utils.handleCallback(future, callback);
    }

    function createContract(data, callback) {
      var future = $http({
        url: '/serviceAgreements',
        method: 'POST',
        data: data
      });
      Utils.handleCallback(future, callback);
    }

    function getAgreementCountByType(id, type, callback) {
      var future = $http({
        method: 'GET',
        url: '/serviceAgreements/countCurrentAgreements' + '?companyId='+id+'&types='+type
      });
      Utils.handleCallback(future, callback)
    }

    function getAgreement(id, callback) {
      var future=$http({
        method: 'GET',
        url: '/serviceAgreements/'+id
      });
      Utils.handleCallback(future, callback)
    }

    function terminate(id, callback) {
      var future = $http({
        method: 'PUT',
        url: '/serviceAgreements/terminate/'+id
      });
      Utils.handleCallback(future, callback)
    }





    return {
      getAllServiceAgreements: getAllServiceAgreements,
      createContract: createContract,
      getAgreementCountByType: getAgreementCountByType,
      getAgreement: getAgreement,
      terminate: terminate
    }


    }])

})(window);
