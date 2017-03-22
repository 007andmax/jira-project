'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('RecurringService', ['$http', '$rootScope', 'RealTimeService', 'CompaniesService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, CompaniesService, Utils) {

    function getRecurringCompanies(scope, callback) {

      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!'
      }

      var recurring = [];

      $http({
        url: '/recurringInvoice/total',
        method: 'GET'
      }).then(function (resp) {

        Utils.customizeArray(resp.data, recurring);

        RealTimeService.subscribe('/recurringTotal', scope, function (newChange) {

          if (newChange.action === 'CLIENT_RECURRING_TOTAL') {

            var index = Utils.indexOfId(recurring, newChange.data.id);

            if (newChange.data.total === 0) {

              if (index > -1) {
                recurring.splice(index, 1);
              }
              return;
            }

            if (index > -1) {
              Utils.customizeObj(newChange.data, recurring[index]);
            } else {
              var isNew = true;
              for (var j = 0; j < recurring.length; j++) {
                if (recurring[j].company.id === newChange.data.company.id) {
                  recurring[j].id = newChange.data.id;
                  recurring[j].total = newChange.data.total;
                  recurring[j].invoicesCount = newChange.data.invoicesCount;
                  isNew = false;
                }
              }
              if (isNew) {
                recurring.push(Utils.customizeObj(newChange.data));
              }

            }
          }
        });

        if (callback) {
          callback(resp.data);
        }
      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });

      return recurring;

    }

    function saveRecurringOrder(order, callback) {
      if (!order) {
        throw 'order must be!';
      }

      var future = $http({
        url: '/recurringInvoice/saveRecurringOrder',
        method: 'POST',
        data: order
      });

      Utils.handleCallback(future, callback);
    }

    function getAll(scope, callback) {
      if (!scope || !scope.$id) {
        throw 'Second argument must be Angularjs scope!'
      }

      var invoices = [];

      $http.get('/recurringInvoice/getAll').then(function (resp) {

        Utils.customizeArray(resp.data, invoices);

        RealTimeService.subscribe('/recurring', scope, function (newChange) {

          if (newChange.action == 'RECURRING_SAVED') {

            var invoice = Utils.findById(invoices, newChange.data.id);

            if (invoice) {
              Utils.customizeObj(newChange.data, invoice);
            } else {
              invoices.unshift(Utils.customizeObj(newChange.data));
            }

          } else if (newChange.action == 'RECURRING_DELETE') {
            Utils.deleteById(invoices, newChange.data.id);
          }

          if (callback) {
            callback(invoices);
          }
        });

        if (callback) {
          callback(invoices);
        }
      });

      return invoices;
    }

    function getCompanyRecurringInvoices(companyId, scope, callback) {

      if (!companyId) {
        throw 'companyId is required!'
      }

      if (!scope || !scope.$id) {
        throw 'Second argument must be Angularjs scope!'
      }

      var invoices = [];

      $http.get('/recurringInvoice?companyId=' + companyId).then(function (resp) {

        Utils.customizeArray(resp.data, invoices);

        RealTimeService.subscribe('/recurring/' + companyId, scope, function (newChange) {

          if (newChange.action == 'RECURRING_SAVED') {

            var invoice = Utils.findById(invoices, newChange.data.id);

            if (invoice) {
              Utils.customizeObj(newChange.data, invoice);
            } else {
              invoices.push(Utils.customizeObj(newChange.data));
            }

          } else if (newChange.action == 'RECURRING_DELETE') {

            var index = Utils.indexOfId(invoices, newChange.data.id);

            if (index > -1) {
              invoices.splice(index, 1);
            }
          }
        });

        if (callback) {
          callback(resp.data);
        }
      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });

      return invoices;
    }

    function createRecurringInvoice(recurringInvoice, companyId, callback) {

      if (!recurringInvoice) {
        throw 'recurringInvoice is required!'
      }

      if (!companyId) {
        throw 'companyId is required!'
      }

      recurringInvoice.company = { id: companyId };

      var future = $http({
        url: '/recurringInvoice',
        method: 'POST',
        data: recurringInvoice
      });

      Utils.handleCallback(future, callback)

    }

    function deleteRecurringInvoice(recurringInvoiceId, callback) {

      if (!recurringInvoiceId) {
        throw 'recurringInvoiceId is required!'
      }

      var future = $http({
        url: '/recurringInvoice/' + recurringInvoiceId,
        method: 'DELETE'
      });

      Utils.handleCallback(future, callback)

    }

    function deleteAllRecurringInvoicesByCompany(companyId, recurring, callback) {

      if (!companyId) {
        throw 'companyId is required!'
      }

      var future = $http({
        url: '/recurringInvoice/company/' + companyId,
        method: 'DELETE'
      });

      var customCallback = function (resp) {
        if (recurring) {
          for (var i = 0; i < recurring.length; i++) {
            if (recurring[i].company.id === companyId) {
              recurring.splice(i, 1);
              i--
            }
          }
        }
        if (callback) {
          callback(resp.data)
        }
      };

      Utils.handleCallback(future, customCallback)

    }

    function saveRecInvProductExpense(recurringInvoiceId, expense, callback) {
      saveRecurringInvoiceExpense('productExpense', recurringInvoiceId, expense, callback)
    }

    function saveRecInvServiceExpense(recurringInvoiceId, expense, callback) {
      saveRecurringInvoiceExpense('serviceExpense', recurringInvoiceId, expense, callback)
    }

    function saveRecurringInvoiceExpense(expenseType, recurringInvoiceId, expense, callback) {

      if (!recurringInvoiceId) {
        throw 'recurringInvoiceId is required!'
      }

      if (!expense) {
        throw 'expense is required!'
      }

      var config = {
        url: '/recurringInvoice/' + recurringInvoiceId + '/' + expenseType,
        data: expense
      };

      if (expense.id) {
        config.method = 'PUT';
        config.url = config.url + '/' + expense.id;
      } else {
        config.method = 'POST';
      }

      var future = $http(config);

      Utils.handleCallback(future, callback)

    }

    function deleteProductExpenseFromRecInv(recurringInvoiceId, expenseId, callback) {
      deleteExpenseFromRecurringInvoice(recurringInvoiceId, expenseId, callback);
    }

    function deleteServiceExpenseFromRecInv(recurringInvoiceId, expenseId, callback) {
      deleteExpenseFromRecurringInvoice(recurringInvoiceId, expenseId, callback);
    }

    function deleteExpenseFromRecurringInvoice(recurringInvoiceId, expenseId, callback) {

      if (!recurringInvoiceId) {
        throw 'recurringInvoiceId is required!'
      }

      if (!expenseId) {
        throw 'expenseId is required!'
      }

      var future = $http({
        url: '/recurringInvoice/' + recurringInvoiceId + '/expense/' + expenseId,
        method: 'DELETE'
      });

      Utils.handleCallback(future, callback);

    }

    function forceCreate(id, callback) {
      if (!id) {
        throw 'Id of the invoice required!'
      }

      var future = $http.get('/recurringInvoice/' + id + '/forceCreate');

      Utils.handleCallback(future, callback);
    }

    return {
      getRecurringCompanies: getRecurringCompanies,
      getCompanyRecurringInvoices: getCompanyRecurringInvoices,
      getAll: getAll,
      saveRecurringOrder: saveRecurringOrder,
      createRecurringInvoice: createRecurringInvoice,
      deleteRecurringInvoice: deleteRecurringInvoice,
      deleteAllRecurringInvoicesByCompany: deleteAllRecurringInvoicesByCompany,
      saveRecInvProductExpense: saveRecInvProductExpense,
      saveRecInvServiceExpense: saveRecInvServiceExpense,
      deleteProductExpenseFromRecInv: deleteProductExpenseFromRecInv,
      deleteServiceExpenseFromRecInv: deleteServiceExpenseFromRecInv,
      forceCreate: forceCreate
    }
  }]);

})(window, jQuery);
