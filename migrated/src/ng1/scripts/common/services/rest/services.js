'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ServicesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService) {
      var serviceScope = $rootScope.$new();


      function search(keyword) {

        if (!keyword) {
          throw 'Keyword is required!';
        }

        return $http.get("/services/search?keyword=" + keyword.toLowerCase()).then(function (response) {
          return response.data;
        });

      }

      function getAllByCompany(scope, companyId, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        if (!companyId || Object.prototype.toString.call(companyId) === "[object Function]") {
          throw 'companyId is required argument!'
        }

        return Utils.getListByUrl('/services/' + companyId, callback, function (list) {

          RealTimeService.subscribe('/service', scope, function (newChange) {

            if (newChange.action === 'SERVICE_DELETED') {
              Utils.deleteById(list, newChange.data.versionedId.id);
            }
          });
        });
      }





      function addCompanyToServiceData(data, companyId) {

        if (!data) {
          throw 'data argument is required'
        }
        if (!companyId) {
          throw 'companyId argument is required'
        }

        if (!data[companyId]) {
          Utils.defineReadOnlyProperty(data, companyId, []);
        }
      }

      function deleteCompanyFromServiceData(data, companyId) {
        if (data[companyId].length > 0) {
          throw 'This action cannot be performed on company that has not empty services list! Use deleteCompany() method.'
        }

        delete data[companyId];
      }










      function getActualMapping(data) {
        var actualMapping = {};

        for (var key in data) {
          if (key == 'default' || key == 'staticCopy') {
            continue;
          }

          var serviceIds = [];
          var services = data[key];

          for (var i = 0; i < services.length; i++) {
            serviceIds.push(services[i].originService.versionedId.id);
          }

          actualMapping[key] = serviceIds;
        }

        return actualMapping
      }

      function addServiceData(data, service) {

        var key = service.company.id;

        if (key === CompaniesService.getCurrentCompany().id) {
          key = "default";
        }

        if (!data[key]) {
          Utils.defineReadOnlyProperty(data, key, []);
        }

        var services = data[key],
          realTimeService = Utils.findById(services, service.versionedId.id);

        if (realTimeService) {
          Utils.customizeObj(service, realTimeService);
        } else {
          data[key].push(Utils.customizeObj(service));
        }
      }

      function findService(data, serviceId) {

        for (var key in data) {
          if (key == 'staticCopy') continue;
          var service = Utils.findById(data[key], serviceId);

          if (service) {
            return service;
          }
        }

      }



      function searchDuplicatedServiceNames(startDate, endDate, companyId, serviceNamesList, agreementId, callback) {

        var future = $http({
          method: 'POST',
          url: '/services/searchDuplicatedServiceNames?' + 'startDate=' + startDate + '&endDate=' + endDate + '&companyId=' + companyId + ((agreementId) ? '&agreementId=' + agreementId : ''),
          data: serviceNamesList
        });
        Utils.handleCallback(future, callback);
      }
      return {

        getAllByCompany: getAllByCompany,
        addCompanyToServiceData: addCompanyToServiceData,
        deleteCompanyFromServiceData: deleteCompanyFromServiceData,
        getActualMapping: getActualMapping,
        searchDuplicatedServiceNames: searchDuplicatedServiceNames,

      }

    }]);

})(window, jQuery);
