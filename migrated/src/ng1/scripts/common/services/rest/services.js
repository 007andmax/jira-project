'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ServicesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService) {

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

      function getServicesData(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        var data = Utils.customizeObj({});

        $http.get('/services/getDefaultServices').then(function (resp) {

          for (var i = 0; i < resp.data.length; i++) {
            addServiceData(data, resp.data[i])
          }

          if (callback) {
            callback(resp.data);
          }

        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        function serviceSaved(service) {
          var oldService = findService(data, service.versionedId.id);

          if (oldService) {
            Utils.customizeObj(service, oldService);
          } else {
            addServiceData(data, service)
          }
        }

        function serviceDeleted(serviceId, data) {

          var index = Utils.indexOfId(data.default, serviceId);

          if (index > -1) {
            data.default.splice(index, 1);
          }
        }

        RealTimeService.subscribe('/service', scope, function (newChange) {

          if (newChange.action == 'SERVICE_SAVED') {
            if (newChange.data.isDefault) {
              serviceSaved(newChange.data);
              console.log('ggggggggggggggggggggggggggg');
            }
          } else if (newChange.action == 'SERVICE_DELETED') {
            serviceDeleted(newChange.data.versionedId.id, data);
            console.log('bbbbbbbbbbbbbbbbbbbbbbbb');
          }

        });

        return data;
      }

      function getSpecialServices(callback) {
        $http.get('/serviceAgreements/services').then(function(res) {
          if (callback) callback(res);
        })
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

      function save(service, callback) {

        if (!service) throw 'service is required!';

        var url = '/services',
          method = 'POST';

        if (service.versionedId && service.versionedId.id) {
          service.id = service.versionedId.id;
          method = 'PUT';
          url = url + '/' + service.versionedId.id;
        }

        var future = $http({
          url: url,
          method: method,
          data: service
        });

        Utils.handleCallback(future, callback);
      }

      function deleteService(serviceId, callback) {
        if (!serviceId) throw 'serviceId is required argument!';

        var future = $http({
          url: '/services/' + serviceId,
          method: 'DELETE'
        });

        Utils.handleCallback(future, callback);
      }

      function deleteCompany(companyId, callback) {
        if (!companyId) throw 'companyId is required argument!';

        var future = $http({
          url: '/services/company/' + companyId,
          method: 'DELETE'
        });

        Utils.handleCallback(future, callback);
      }

      function move(mapping, callback) {
        if (!mapping) throw 'mapping is required argument!';

        var future = $http({
          url: '/services/move',
          method: 'POST',
          data: mapping
        });

        Utils.handleCallback(future, callback);
      }

      function changeBillableStatus(id, toBillable, callback) {

        if (!id) throw 'ids is required argument!';
        if (toBillable === undefined) throw 'toBillable is required argument!';

        var future = $http({
          url: '/services/changeBillableStatus?id=' + id + '&toBillable=' + !!toBillable,
          method: 'POST'
        });

        Utils.handleCallback(future, callback);
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

      function isNameUnique(name, modelId, callback) {
        var future = $http.get('/services/isDefaultServiceNameUnique?name=' + name + (modelId ? '&id=' + modelId : ''));
        Utils.handleCallback(future, callback);
      }

      function searchDuplicatedServiceNames(startDate, endDate, companyId, serviceNamesList,agreementId, callback) {
        console.log('agreementId',agreementId);
        var future = $http({
          method: 'POST',
          url: '/services/searchDuplicatedServiceNames?' + 'startDate=' + startDate + '&endDate=' + endDate + '&companyId=' + companyId + ((agreementId) ? '&agreementId=' + agreementId : ''),
          data: serviceNamesList
        });
        Utils.handleCallback(future, callback);
      }

      return {

        getAllByCompany: getAllByCompany,
        getServicesData: getServicesData,
        getSpecialServices: getSpecialServices,
        save: save,
        addCompanyToServiceData: addCompanyToServiceData,
        deleteCompanyFromServiceData: deleteCompanyFromServiceData,
        deleteService: deleteService,
        deleteCompany: deleteCompany,
        move: move,
        getActualMapping: getActualMapping,
        changeBillableStatus: changeBillableStatus,
        isNameUnique: isNameUnique,
        searchDuplicatedServiceNames: searchDuplicatedServiceNames
      }

    }]);

})(window, jQuery);
