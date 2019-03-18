'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ProductsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {

      function search(keyword) {

        if (!keyword) {
          throw 'Keyword is required!'
        }

        return $http.get("/products/search?keyword=" + keyword.toLowerCase()).then(function (response) {
          return response.data;
        });

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

      function getAllProducts(scope, callback) {

        if (!scope) {
          throw 'scope is required!'
        }

        var data = {
          list: [],
          categories: []
        };

        $http.get("https://dev.quicktech.com/products/categories").then(function (categoriesResp) {

          var categories = categoriesResp.data;

          for (var i = 0; i < categories.length; i++) {
            categories[i].productsList = [];
            data.categories.push(categories[i]);
          }

          $http.get('/products/').then(function (resp) {

            data.list = resp.data;

            for (var i = 0; i < data.list.length; i++) {
              var category = Utils.findById(data.categories, data.list[i].category.id);
              category.productsList.push(data.list[i]);
            }

            if (callback) {
              callback(Utils.customizeObj(data));
            }

            RealTimeService.subscribe('/product', scope, function (newChange) {

              if (newChange.action == 'PRODUCT_SAVED') {

                var product = Utils.findById(data.list, newChange.data.versionedId.id);

                if (product) {
                  if (product.category.id !== newChange.data.category.id) {
                    var categoryMoveFrom = Utils.findById(data.categories, product.category.id);
                    Utils.deleteById(categoryMoveFrom.productsList, product.versionedId.id);

                    var categoryMoveTo = Utils.findById(data.categories, newChange.data.category.id);
                    categoryMoveTo.productsList.push(product);
                  }
                  Utils.customizeObj(newChange.data, product);
                } else {
                  var sourceCategory = Utils.findById(data.categories, newChange.data.category.id);
                  var product = Utils.customizeObj(newChange.data);
                  sourceCategory.productsList.push(product);
                  data.list.push(product);
                }

              } else if (newChange.action == 'PRODUCT_DELETED') {
                Utils.deleteById(data.list, newChange.data.versionedId.id);
                category = Utils.findById(data.categories, newChange.data.category.id);
                Utils.deleteById(category.productsList, newChange.data.versionedId.id);

                scope.$broadcast("product_deleted", newChange.data);
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

          RealTimeService.subscribe('/productCategory', scope, function (newChange) {

            if (newChange.action == 'PRODUCT_CATEGORY_SAVED') {

              var category = Utils.findById(data.categories, newChange.data.id);

              if (category) {
                Utils.customizeObj(newChange.data, category);

                for (var i = 0; i < data.list.length; i++) {
                  if (data.list[i].category.id === newChange.data.id) {
                    Utils.customizeObj(newChange.data, data.list[i].category);
                  }
                }
              } else {
                newChange.data.productsList = [];
                data.categories.push(Utils.customizeObj(newChange.data));
              }

            } else if (newChange.action == 'PRODUCT_CATEGORY_DELETED') {
              Utils.deleteById(data.categories, newChange.data.id);
              scope.$broadcast("product_category_deleted", newChange.data);

              var productsToDelete = [];
              for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].category.id === newChange.data.id) {
                  productsToDelete.push(data.list[i].versionedId.id);
                }
              }
              for (i = 0; i < productsToDelete.length; i++) {
                Utils.deleteById(data.list, productsToDelete[i]);
              }
            }

            if (callback) {
              callback(data);
            }
          });
        });
      }

      function getCategories(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        return Utils.getListByUrl("https://dev.quicktech.com/products/categories", callback, function (list) {

          RealTimeService.subscribe('https://dev.quicktech.com/productCategory', scope, function (newChange) {

            if (newChange.action == 'PRODUCT_CATEGORY_SAVED') {

              var category = Utils.findById(list, newChange.data.id);

              if (category) {
                Utils.customizeObj(newChange.data, category);
              } else {
                list.push(Utils.customizeObj(newChange.data));
              }
            } else if (newChange.action == 'PRODUCT_CATEGORY_DELETED') {
              Utils.deleteById(list, newChange.data.id);
              scope.$broadcast("product_category_deleted", newChange.data);
            }
          });
        });
      }

      function saveCategory(category, callback) {

        if (!category) throw 'category is required!';

        var url = 'https://dev.quicktech.com/products/categories',
          method = 'POST';

        if (category.id) {
          url += '/' + category.id;
          method = 'PUT';
        }

        var future = $http({
          url: url,
          method: method,
          data: category
        });

        Utils.handleCallback(future, callback);
      }

      function deleteCategory(categoryId, callback) {

        if (!categoryId) throw 'categoryId is required argument!';

        var future = $http({
          url: 'https://dev.quicktech.com/products/categories/' + categoryId,
          method: 'DELETE'
        });

        Utils.handleCallback(future, callback);
      }

      function saveProduct(product, callback) {

        if (!product) throw 'product is required!';

        var url = '/products',
          method = 'POST';

        if (product.id) {
          method = 'PUT';
        }

        var future = $http({
          url: url,
          method: method,
          data: product
        });

        Utils.handleCallback(future, callback);
      }

      function deleteProduct(productId, callback) {

        if (!productId) throw 'productId is required argument!';

        var future = $http({
          url: '/products/' + productId,
          method: 'DELETE'
        });

        Utils.handleCallback(future, callback);
      }

      function moveProducts(categoryId, productIds, callback) {

        if (!categoryId) throw 'categoryId is required argument!';
        if (!productIds) throw 'productIds is required argument!';

        if (!Array.isArray(productIds)) productIds = [productIds];

        var future = $http({
          url: '/products/moveProduct?categoryId=' + categoryId,
          method: 'POST',
          data: productIds
        });

        Utils.handleCallback(future, callback);
      }

      function isILCUnique(ilc, id, callback) {

        if (!ilc) {
          throw 'ilc is required!'
        }

        var info = Utils.customizeObj({});

        $http.get('/products/isILCUnique?ilc=' + ilc + '&id=' + id).then(function (resp) {
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

      function isMfgUnique(manufacture, id, callback) {

        if (!manufacture) {
          throw 'manufacture is required!'
        }

        var info = Utils.customizeObj({});

        $http.get('/products/isMfgUnique?manufacture=' + manufacture + '&id=' + id).then(function (resp) {
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
        search: search,
        getFullListForAutocomplete: getFullListForAutocomplete,
        getCategories: getCategories,
        saveCategory: saveCategory,
        deleteCategory: deleteCategory,
        saveProduct: saveProduct,
        deleteProduct: deleteProduct,
        isILCUnique: isILCUnique,
        isMfgUnique: isMfgUnique,
        moveProducts: moveProducts,
        getAllProducts: getAllProducts,
        getProductsByCompany: getProductsByCompany
      }

    }]);

})(window, jQuery);
