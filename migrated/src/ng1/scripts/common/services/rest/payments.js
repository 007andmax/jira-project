'use strict';

/*Payments*/

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('PaymentsService', ['$http', 'RealTimeService', 'Utils', '$rootScope',
    function ($http, RealTimeService, Utils, $rootScope) {

      var urlForGetPayments = '/payments';
      var urlForGetDepositSlips = '/payments/deposits';
      var urlForPostNewDepositSlip = ' /payments/deposits';
      var urlForGetDepositNumber = '/data/actualNumber?type=DEPOSIT';
      var payments = [];
      var wasSubscribed = false;

      function getData(url, callback, data) {
        console.log(data);
        var getFuture = $http({
          url: url,
          method: 'post',
          data: data ? data : null
        });

        Utils.handleCallback(getFuture, callback)
      }

      var isRequestSent = false;

      function getPaymentsDataTable(scope, callback, data) {
        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }
        return $http.post('/payments', data).then(function (resp) {
          if (callback) {
            if (resp.data.list) {
              payments = resp.data.list;
              callback(resp.data.list);
            } else {
              callback(resp.data);
              payments = resp.data;
            }
          }
        });
      }


      function postData(url, data, callback) {
        console.log(data, 'data');
        var postFuture = $http({
          url: url,
          method: 'POST',
          body: data
        });
        Utils.handleCallback(postFuture, callback)
      }

      function getPaymentsData(data, scope, callback) {

        // if (payments && payments.length) {
        //   callback && callback(payments);
        //   return;
        // }


        if (data) {
          getData(urlForGetPayments, function(resp) {
            payments = resp;
            callback && callback(payments);
          }, data);
        }


        // if (wasSubscribed) return;

        RealTimeService.subscribe('/payments', scope,  function(newChange) {
          var invoices = $rootScope.receivableInvoicesData && $rootScope.receivableInvoicesData.list;

          console.log(newChange, 'newChange');
          console.log(newChange, 'newChange');

          if(newChange.action === 'PAYMENT_CREATED') {
            invoices = $rootScope.allInvoices;
            if (payments.findIndex(function(el) { return el.id === newChange.data.id }) !== -1) return;

            payments.unshift(newChange.data);

            if (invoices) {

              var invoiceNumber = newChange.data.partialPaidInvoice;
              var sum = newChange.data.partialPaidAmount;
              var invoiceIndex = invoices.findIndex(function(el) {
                return el.number == invoiceNumber;
              });

              if (invoiceIndex && invoices[invoiceIndex]) {

                invoices[invoiceIndex].paidSum += sum;

                if (invoices[invoiceIndex].paidSum >= invoices[invoiceIndex].sum) {
                  if (!invoices[invoiceIndex].paidOn) {
                    invoices[invoiceIndex].paidOn = +moment(new Date()).format('x');
                  }
                } else {
                  invoices[invoiceIndex].paidOn = null;
                }
              }





            }



          } else if ( newChange.action === 'PAYMENTS_DELETED') {
            for (var i = 0; i < newChange.data.length; i++) {
              var paymentId = newChange.data[i];

              var payment = payments.find(function(el) {
                return el.id == paymentId
              });

              var invoices = $rootScope.allInvoices;

              var payment = Object.assign({}, payment);

              if (payment.refundMethod) {

              }




              if (invoices && !payment.refundMethod) {
                var invoice = invoices.find(function(el) {
                  return el.number === payment.partialPaidInvoice;
                })

                if (invoice) {
                  invoice.paidSum -= payment.partialPaidAmount;

                  if (invoice.paidSum >= invoice.sum) {
                    if (!invoice.paidOn) {
                      invoice.paidOn = +moment(new Date()).format('x');
                    }
                  } else {
                    invoice.paidOn = null;
                  }
                }



              }


              Utils.deleteById(payments, paymentId);
            }
          } else if (newChange.action === 'PAYMENTS_REFUNDED') {
            var refund = newChange.action;
            var changed = newChange.data;

            var index = payments.findIndex(function(el) {
              return el.id == changed.id;
            })

            var payment = payments[index];

            payments[index].refundMethod = changed.refundMethod;

            if (invoices) {
              var invoice = invoices.find(function(el) {
                return el.number === payment.partialPaidInvoice;
              })

              invoice.paidSum -= payment.partialPaidAmount;

              if (invoice.paidSum >= invoice.sum) {
                if (!invoice.paidOn) {
                  invoice.paidOn = +moment(new Date()).format('x');
                }
              } else {
                invoice.paidOn = null;
              }

            }

          } else if (newChange.action === 'PAYMENT_EDITED') {
            var changed = newChange.data;
            console.log(payments, 'payments');


            var index = payments.findIndex(function(el) {
              return el.id == changed.id;
            })
            console.log(index, 'index');

            var invoices = $rootScope.allInvoices;

            var prevPayment = payments[index];
            var difference = changed.partialPaidAmount - prevPayment.partialPaidAmount;
            var invoiceNum = prevPayment.partialPaidInvoice;


            if (invoices) {
              var invoice = invoices.find(function(el) {
                return el.number === invoiceNum;
              })

              invoice.paidSum += difference;

              if (invoice.paidSum >= invoice.sum) {
                if (!invoice.paidOn) {
                  invoice.paidOn = +moment(new Date()).format('x');
                }
              } else {
                invoice.paidOn = null;
              }
            }

            var keys = Object.keys(changed);

            keys.forEach(function(key) {
              payments[index][key] = changed[key];
            })

          }
        });

        wasSubscribed = true;
      }

      function getDepositSlipsData(scope, callback) {
        var depositSlips = [];
        getData(urlForGetDepositSlips, function(resp) {
          depositSlips = resp;
          callback && callback(depositSlips);
        });

        RealTimeService.subscribe('/deposits', scope, function(newChange) {
          if(newChange.action === 'DEPOSIT_CREATED') {
            depositSlips.push(newChange.data);
          } else if ( newChange.action === 'DEPOSIT_DELETED') {
            for (var i = 0; i < newChange.data.length; i++) {
              var depositSlipId = newChange.data[i];
              Utils.deleteById(depositSlips, depositSlipId);
            }
          }
        })
      }

      function postNewDepositSlip(data, callback) {
        return postData(urlForPostNewDepositSlip, data, callback)
      }

      function rollback(paymentId, callback) {
        var future = $http.put('/payments/rollback?paymentId=' + paymentId, {});
        Utils.handleCallback(future, callback);
      }

      function getDepositNumber(callback) {
        var depositNumber;
        getData(urlForGetDepositNumber, function(resp) {
          depositNumber = resp;
          callback && callback(depositNumber);
        })
      }

      function editPayment(data, callback) {
        $http.put('/payments/edit', data)
          .then(function(res) {

            if (callback) callback(res);
          })
      }

      function deletePayment(id, callback) {
        $http.put('/payments/delete?paymentId=' + id)
          .then(function(res) {
            if (callback) callback(res)
          })
      }

      function refundPayment(data, callback) {
        $http.put('/payments/refund', data)
          .then(function(res) {
            if (callback) callback(res);
          })
      }

      return {
        getPaymentsData: getPaymentsData,
        getDepositSlipsData: getDepositSlipsData,
        postNewDepositSlip: postNewDepositSlip,
        rollback: rollback,
        getDepositNumber: getDepositNumber,
        editPayment: editPayment,
        deletePayment: deletePayment,
        refundPayment: refundPayment,
        getPaymentsDataTable: getPaymentsDataTable
      }


    }])

})(window);
