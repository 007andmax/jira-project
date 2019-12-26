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
        getServiceAgreements(function (resp) {
          agreements = resp;
          callback && callback(agreements);
        });

        RealTimeService.subscribe('/serviceAgreement', scope, function (newChange) {
          if (newChange.action === 'SERVICE_AGREEMENT_SAVED') {
            var agreementToUpdate = Utils.findById(agreements, newChange.data.id);

            if (agreementToUpdate) {
              Utils.customizeObj(newChange.data, agreementToUpdate);
            } else {
              agreements.push(Utils.customizeObj(newChange.data));
            }

          } else if (newChange.action === 'SERVICE_AGREEMENT_DELETED') {
            Utils.deleteById(agreements, newChange.data.id);
          }
          callback && callback(agreements);
        })
      }

      function getServiceAgreementById(id, callback) {
        var future = $http({
          url: '/serviceAgreements/'+ id,
          method: 'GET'
        });
        Utils.handleCallback(future, callback);
      }

      function updateContract(data, callback) {
        var future = $http({
          url: '/serviceAgreements',
          method: 'PUT',
          data: data
        });
        Utils.handleCallback(future, callback);
      }

      function createContract(data, createBillableItem, callback) {
        var future = $http({
          url: '/serviceAgreements?'+'createBillableItem='+createBillableItem,
          method: 'POST',
          data: data
        });
        Utils.handleCallback(future, callback);
      }

      function getAgreementCountByType(id, type, callback) {
        var future = $http({
          method: 'GET',
          url: '/serviceAgreements/countCurrentAgreements' + '?companyId=' + id + '&types=' + type
        });
        Utils.handleCallback(future, callback)
      }

      function getAgreement(id, callback) {
        var future = $http({
          method: 'GET',
          url: '/serviceAgreements/' + id
        });
        Utils.handleCallback(future, callback)
      }

      function terminate(id, callback) {
        var future = $http({
          method: 'PUT',
          url: '/serviceAgreements/terminate/' + id
        });
        Utils.handleCallback(future, callback)
      }

      function deleteAgreement(id, callback) {
        var future = $http({
          method: 'DELETE',
          url: '/serviceAgreements/' + id
        });
        Utils.handleCallback(future, callback)
      }

      function forceCreate(id, callback) {
        var future = $http({
          method: 'GET',
          url: '/serviceAgreements/forceCreate?id=' + id
        });
        Utils.handleCallback(future, callback)
      }

      function validateCrossingDatesHourly(startDate, endDate, companyId,agreementId, callback) {
        console.log('agreementId',agreementId);
        var future = $http({
          method: 'GET',
          url: '/serviceAgreements/validateCrossingDates?' + 'companyId=' + companyId  + '&startDate=' + startDate + '&endDate=' + endDate + ((agreementId) ? '&agreementId=' + agreementId : '')
        });
        Utils.handleCallback(future, callback)
      }


      return {
        getAllServiceAgreements: getAllServiceAgreements,
        getServiceAgreementById: getServiceAgreementById,
        createContract: createContract,
        getAgreementCountByType: getAgreementCountByType,
        getAgreement: getAgreement,
        terminate: terminate,
        deleteAgreement: deleteAgreement,
        forceCreate: forceCreate,
        validateCrossingDatesHourly: validateCrossingDatesHourly,
        updateContract:updateContract
      }


    }])

})(window);
