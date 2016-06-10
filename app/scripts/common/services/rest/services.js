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

          //TODO implement real-time!
          //RealTimeService.subscribe('/service', scope, function (newChange) {
          //
          //    console.log(newChange);
          //
          //    if (newChange.action == 'SERVICE_SAVED') {
          //
          //        var service = Utils.findById(list, newChange.data.versionedId.id);
          //
          //        if (service) {
          //            Utils.customizeObj(newChange.data, service);
          //        } else {
          //            list.push(Utils.customizeObj(newChange.data));
          //        }
          //    } else if (newChange.action == 'SERVICE_DELETED') {
          //        Utils.deleteById(list, newChange.data.versionedId.id);
          //        scope.$broadcast("service_deleted", newChange.data);
          //    } else {
          //        //            todo remove this later
          //        console.log("DEBUUUG!!!", newChange);
          //    }
          //});

        });
      }

      function getServicesData(scope, isOnlyDefault, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        var data = Utils.customizeObj({});

        var url = '/services';

        if (isOnlyDefault) {
          url = url + '/getDefaultServices';
        }

        $http.get(url).then(function (resp) {

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

        RealTimeService.subscribe('/service', scope, function (newChange) {

          console.log(newChange);

          if (newChange.action == 'SERVICE_SAVED') {
            serviceSaved(newChange.data);
          } else if (newChange.action == 'SERVICE_LIST_SAVED') {

            for (var i = 0; i < newChange.data.length; i++) {
              serviceSaved(newChange.data[i]);
            }

          } else if (newChange.action == 'SERVICES_MOVED') {
            for (var i = 0; i < newChange.data.length; i++) {
              addServiceData(data, newChange.data[i])
            }

          } else if (newChange.action == 'COMPANY_SERVICES_DELETED') {
            delete data[newChange.data.id];
          } else if (newChange.action == 'SERVICES_DELETED') {
            for (var i = 0; i < newChange.data.length; i++) {
              serviceDeleted(newChange.data[i].versionedId.id, data);
            }
          }
          /* else if (newChange.action == 'COMPANY_ARCHIVED') {
           delete data[newChange.data.id];
           }*/
        });

        return data;
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

      function saveList(services, companyId, callback) {

        if (!services) {
          throw 'services is required!';
        }

        if (!companyId) throw 'companyId is required!';

        var future = $http({
          url: '/services/saveList/' + companyId,
          method: 'POST',
          data: { serviceDtoList: services }
        });

        Utils.handleCallback(future, callback);

      }

      function save(service, callback) {

        if (!service) throw 'service is required!';

        var url = '/services',
          method = 'POST';

        if (service.id) {
          method = 'PUT';
          url = url + '/' + service.id;

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

      function changeBillableStatus(ids, toBillable, callback) {

        if (!ids) throw 'ids is required argument!';
        if (toBillable === undefined) throw 'toBillable is required argument!';

        if (!Array.isArray(ids)) ids = [ids];

        var future = $http({
          url: '/services/changeBillableStatus?toBillable=' + !!toBillable,
          method: 'POST',
          data: ids
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
          data[key] = [];
        }

        var services = data[key],
          realTimeService = Utils.findById(services, service.id);

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

      function serviceDeleted(serviceId, data) {

        for (var key in data) {
          var index = Utils.indexOfId(data[key], serviceId);

          if (index > -1) {
            data[key].splice(index, 1);
          }
        }
      }

      return {
        search: search,
        getAllByCompany: getAllByCompany,
        getServicesData: getServicesData,
        save: save,
        saveList: saveList,
        addCompanyToServiceData: addCompanyToServiceData,
        deleteCompanyFromServiceData: deleteCompanyFromServiceData,
        deleteService: deleteService,
        deleteCompany: deleteCompany,
        move: move,
        getActualMapping: getActualMapping,
        changeBillableStatus: changeBillableStatus
      }

    }]);

})(window, jQuery);
