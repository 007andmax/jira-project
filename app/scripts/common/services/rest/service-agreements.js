'use strict';


(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('AgreementsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {



    function getServiceAgreements(callback) {
      var future = $http({
        url: '/serviceAgreements',
        method: 'GET'
      });

      Utils.handleCallback(future, callback);
    }

    function getAllServiceAgreements(scope, callback) {
      var agreements = [];
      getServiceAgreements(function(resp){
        agreements = resp;
        callback && callback(agreements);
      });

      RealTimeService.subscribe('/serviceAgreement', scope, function(newChange){
        if(newChange.action === 'SERVICE_AGREEMENT_SAVED') {
          agreements.push(newChange.data);
        } else if(newChange.action === 'SERVICE_AGREEMENT_DELETED') {
          for (var i = 0; i < newChange.data.length; i++) {
            var agreementId = newChange.data[i];
            Utils.deleteById(agreements, agreementId);
          }
        }
      })
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
