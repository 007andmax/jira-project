'use strict';


(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('AgreementsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {

    var urlForGetAllServiceAgreements = '/serviceAgreements';
    var urlForContractCreat = '/serviceAgreements';


    function getAllServiceAgreements(callback) {
      var future = $http({
        url: urlForGetAllServiceAgreements,
        method: 'GET'
      });

      Utils.handleCallback(future, callback);
    }

    function createContract(data, callback) {
      var future = $http({
        url: urlForContractCreat,
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





    return {
      getAllServiceAgreements: getAllServiceAgreements,
      createContract: createContract,
      getAgreementCountByType: getAgreementCountByType
    }


    }])

})(window);
