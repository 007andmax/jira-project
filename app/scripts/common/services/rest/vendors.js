'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('VendorsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {

    function getAll(scope, callback) {

      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!';
      }

      return Utils.getListByUrl('/vendor', callback, function (list) {

        RealTimeService.subscribe('/vendor', scope, function (newChange) {

          console.log(newChange);

          if (newChange.action == 'VENDOR_SAVE') {

            var vendor = Utils.findById(list, newChange.data.id);

            if (vendor) {
              Utils.customizeObj(newChange.data, vendor);
            } else {
              list.push(Utils.customizeObj(newChange.data));
            }
          } else if (newChange.action == 'VENDOR_ARCHIVED') {
            Utils.deleteById(list, newChange.data.id);
            scope.$broadcast("vendor_archived", newChange.data);

          } else if (newChange.action == 'VENDOR_DEARCHIVED') {
            list.push(Utils.customizeObj(newChange.data));
            scope.$broadcast("vendor_dearchived", newChange.data);
          } else if (newChange.action == 'VENDOR_PRODUCT_SAVE') {
            var vendor = Utils.findById(list, newChange.data.id),
              oldProduct = Utils.findById(vendor.products, newChange.data.products[0].versionedId.id);
            if (vendor && oldProduct) {
              for (var i = 0; vendor.products.length < i; i++) {
                oldProduct = newChange.data.products[0];
              }
            } else if (vendor) {
              vendor.products[vendor.products.length] = newChange.data.products[0];
            }
          } else if (newChange.action == 'VENDOR_PRODUCT_DELETE') {
            var vendor = Utils.findById(list, newChange.data.id);
            if (vendor) {
              Utils.deleteById(vendor.products, newChange.data.products[0].versionedId.id);
            }
          }
        });
      });
    }

    function getAllForCompanyProfile(scope, companyId, callback) {

      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!';
      }

      if (!companyId) {
        throw 'companyId is required!'
      }

      return Utils.getListByUrl('/vendor/companyProfile/' + companyId, callback, function (list) {

        RealTimeService.subscribe('/vendor', scope, function (newChange) {

          console.log(newChange);

          if (newChange.action == 'VENDOR_SAVE') {

            var vendor = Utils.findById(list, newChange.data.id);

            if (vendor) {
              Utils.customizeObj(newChange.data, vendor);
            } else {
              list.push(Utils.customizeObj(newChange.data));
            }
          } else if (newChange.action == 'VENDOR_ARCHIVED') {
            Utils.deleteById(list, newChange.data.id);
            scope.$broadcast("vendor_archived", newChange.data);

          } else if (newChange.action == 'VENDOR_DEARCHIVED') {
            list.push(Utils.customizeObj(newChange.data));
            scope.$broadcast("vendor_dearchived", newChange.data);
          } else if (newChange.action == 'VENDOR_PRODUCT_SAVE') {
            var vendor = Utils.findById(list, newChange.data.id),
              oldProduct = Utils.findById(vendor.products, newChange.data.products[0].versionedId.id);
            if (vendor && oldProduct) {
              for (var i = 0; vendor.products.length < i; i++) {
                oldProduct = newChange.data.products[0];
              }
            } else if (vendor) {
              vendor.products[vendor.products.length] = newChange.data.products[0];
            }
          } else if (newChange.action == 'VENDOR_PRODUCT_DELETE') {
            var vendor = Utils.findById(list, newChange.data.id);
            if (vendor) {
              Utils.deleteById(vendor.products, newChange.data.products[0].versionedId.id);
            }
          }
        });
      });
    }

    function getAllForAutocomplete(scope, callback) {

      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!';
      }

      return Utils.getListByUrl('/vendor/autocomplete/list', callback, function (list) {

        RealTimeService.subscribe('/vendor', scope, function (newChange) {

          console.log(newChange);

          if (newChange.action == 'VENDOR_SAVE') {

            var vendor = Utils.findById(list, newChange.data.id);

            if (vendor) {
              Utils.customizeObj(newChange.data, vendor);
            } else {
              list.push(Utils.customizeObj(newChange.data));
            }
          } else if (newChange.action == 'VENDOR_ARCHIVED') {
            Utils.deleteById(list, newChange.data.id);
            scope.$broadcast("vendor_archived", newChange.data);

          } else if (newChange.action == 'VENDOR_DEARCHIVED') {
            list.push(Utils.customizeObj(newChange.data));
            scope.$broadcast("vendor_dearchived", newChange.data);
          }
        });
      });
    }

    function getAllInCompanyForAutocomplete(companyId, callback) {

      if (!companyId) {
        throw 'companyId is required!'
      }

      var info = Utils.customizeArray([]);

      $http.get('/vendor/getAll/' + companyId).then(function (resp) {
        Utils.customizeArray(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function save(vendor, callback) {

      if (!vendor) {
        throw 'vendor is required!';
      }

      var url = '/vendor',
        method = 'POST';

      if (vendor.id) {
        method = 'PUT';
      }

      var future = $http({
        url: url,
        method: method,
        data: vendor
      });

      Utils.handleCallback(future, callback);
    }

    function isNameUnique(name, id, callback) {

      if (!name) {
        throw 'name is required!'
      }

      var info = Utils.customizeObj({});

      $http.get('/vendor/isNameUnique?name=' + name + '&id=' + id).then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function isWebsiteUnique(website, id, callback) {

      if (!website) {
        throw 'website is required!'
      }

      var info = Utils.customizeObj({});

      $http.get('/vendor/isWebsiteUnique?website=' + website + '&id=' + id).then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function getOneById(vendorId, callback) {

      if (!vendorId) {
        throw 'vendorId is required!'
      }

      var info = Utils.customizeObj({});

      $http.get('/vendor/getOneById/' + vendorId).then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function archive(id, callback) {
      if (!id) {
        throw 'id is required!'
      }
      var future = $http.get('/vendor/archive/' + id);
      Utils.handleCallback(future, callback);
    }

    function dearchive(id, callback) {
      if (!id) {
        throw 'id is required!'
      }
      var future = $http.get('/vendor/dearchive/' + id);
      Utils.handleCallback(future, callback);

    }

    function search(keyword) {

      if (!keyword) {
        throw 'Keyword is required!'
      }

      return $http.get("/vendor/search?keyword=" + keyword).then(function (response) {
        return response.data;
      });
    }

    return {
      save: save,
      getAll: getAll,
      getAllForCompanyProfile: getAllForCompanyProfile,
      getAllForAutocomplete: getAllForAutocomplete,
      getAllInCompanyForAutocomplete: getAllInCompanyForAutocomplete,
      isWebsiteUnique: isWebsiteUnique,
      isNameUnique: isNameUnique,
      archive: archive,
      dearchive: dearchive,
      getOneById: getOneById,
      search: search
    }
  }
  ]);
})(window, jQuery);
