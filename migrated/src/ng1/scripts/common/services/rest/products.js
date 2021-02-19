'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ProductsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {


      function getFullListForAutocompleteWithOutRealTime(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        var categories = [];

        $http.get("/products/autocompleteList").then(function (response) {
          response.data.forEach(function (c) {
            categories.push(c)
          });

          if (callback) {
            callback(categories);
          }
        });

        return categories;
      }

      function getFullListForAutocomplete(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        var categories = [];

        $http.get("/products/autocompleteList").then(function (response) {
          response.data.forEach(function (c) {
            categories.push(c)
          });

          RealTimeService.subscribe('/productCategory', scope, function (newChange) {

            if (newChange.action == 'PRODUCT_CATEGORY_SAVED') {

              var category = Utils.findById(categories, newChange.data.id);

              if (category) {
                Utils.customizeObj(newChange.data, category);
              } else {
                newChange.data.products = [];
                categories.push(Utils.customizeObj(newChange.data));
              }

            } else if (newChange.action == 'PRODUCT_CATEGORY_DELETED') {
              Utils.deleteById(categories, newChange.data.id);
              scope.$broadcast("product_category_deleted", newChange.data);
            }

            if (callback) {
              callback(categories);
            }
          });

          RealTimeService.subscribe('/product', scope, function (newChange) {
            if (newChange.action === 'PRODUCT_SAVED') {
              var category = Utils.findById(categories, newChange.data.category.id);
              var product = Utils.findById(category.products, newChange.data.versionedId.id);

              if (product) {

                Utils.customizeObj(newChange.data, product);
              } else {
                var categoryMoveFrom;

                for (var i = 0; i < categories.length; i++) {
                  var checkCategory = categories[i];

                  if (category.id === checkCategory.id) {
                    continue;
                  }

                  var checkProduct = Utils.findById(checkCategory, newChange.data.versionedId.id);

                  if (checkProduct) {

                    categoryMoveFrom = checkCategory;
                  }
                }

                if (categoryMoveFrom) {

                  Utils.deleteById(categoryMoveFrom.products, newChange.data.versionedId.id);
                }

                category.products.push(newChange.data);
              }
            } else if (newChange.action == 'PRODUCT_DELETED') {
              category = Utils.findById(categories, newChange.data.category.id);
              Utils.deleteById(category.products, newChange.data.versionedId.id);

              scope.$broadcast("product_deleted", newChange.data);
            }

            if (callback) {
              callback(categories);
            }
          });

          if (callback) {
            callback(categories);
          }
        });

        return categories;
      }














      function getProductsByCompany(scope, companyId, callback) {
        var data = [];
        $http.get('/products/' + companyId).then(function (resp) {

          data = resp.data;

          if (callback) {
            callback(Utils.customizeObj(data));
          }

          RealTimeService.subscribe('/product', scope, function (newChange) {

            if (newChange.action == 'PRODUCT_SAVED') {

              var product = Utils.findById(data, newChange.data.versionedId.id);

              if (product) {
                Utils.customizeObj(newChange.data, product);
              } else {
                data.push(newChange.data);
              }

            } else if (newChange.action == 'PRODUCT_DELETED') {
              Utils.deleteById(data, newChange.data.versionedId.id);
            }
            if (callback) {
              callback(data);
            }
          });

        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });
      }

      return {
        getFullListForAutocomplete: getFullListForAutocomplete,
        getProductsByCompany: getProductsByCompany,
        getFullListForAutocompleteWithOutRealTime: getFullListForAutocompleteWithOutRealTime
      }

    }]);

})(window, jQuery);
