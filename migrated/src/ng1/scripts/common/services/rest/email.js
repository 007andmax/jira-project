'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('EmailSettingsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', function ($http, $rootScope, RealTimeService, Utils) {

    function saveNumberForm(data, type, callback) {

      if (!data) {
        throw 'data is required!';
      }
      if (!type) throw 'type is required!';

      data.type = type;

      var url = '/settings/emailPages/updateNumberForm',
        method = 'PUT';

      var future = $http({
        url: url,
        method: method,
        data: data
      });
      Utils.handleCallback(future, callback);
    }

    function getCompanyEmailNotification(callback) {

      var info = {};

      $http.get('/settings/emailPages/emailNotifications').then(function (resp) {
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

    function getTermsAndConditions(callback) {

      var info = {};

      $http.get('/settings/emailPages/termsAndConditions').then(function (resp) {
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

    function getTemplate(type, callback) {

      if (!type) throw 'type is required!';

      var info = {};

      $http.get('/settings/emailPages/byType/' + type).then(function (resp) {
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

 

    function setToDefaultTemplate(type, callback) {

      if (!type) throw 'type is required!';

      var url = '/settings/emailPages/toDefaultTemplate/' + type,
        method = 'POST';

      var future = $http({
        url: url,
        method: method
      });
      Utils.handleCallback(future, callback);
    }

    function saveEmailTemplate(data, type, callback) {

      if (!data) throw 'data is required!';
      if (!data.subject) throw 'data.subject is required!';
      if (!data.body) throw 'data.body is required!';
      if (!type) throw 'type is required!';

      var url = '/settings/emailPages/updateTemplate/' + type,
        method = 'PUT';

      var future = $http({
        url: url,
        method: method,
        data: data
      });
      Utils.handleCallback(future, callback);
    }

    function getHtmlForPreview(data, type, callback) {
      if (!data) throw 'data is required!';
      if (!data.subject) throw 'data.subject is required!';
      if (!data.body) throw 'data.body is required!';
      if (!type) throw 'type is required!';

      var url = '/settings/emailPages/preview/' + type,
        method = 'POST';

      var future = $http({
        url: url,
        method: method,
        data: data
      });
      Utils.handleCallback(future, callback);
    }

    function getInvoiceContact(callback) {
      var future = $http.get('/settings/emailPages/invoiceContact');
      Utils.handleCallback(future, callback);
    }

    function saveInvoiceContact(data, callback) {
      var future = $http.put('/settings/emailPages/invoiceContact', data);
      Utils.handleCallback(future, callback);
    }

    function toggleInvoiceContact(data, callback) {
      var future = $http.put('/settings/emailPages/toggleInvoiceContact', data);
      Utils.handleCallback(future, callback);
    }

    function getTaxNumber(callback) {
      var future = $http({
        method: 'GET',
        url: '/settings/emailPages/taxNumber'
      });
      Utils.handleCallback(future, callback);
    }

    function updateTaxNumber(data, callback) {

      data.taxId = data.taxId || null
      data.taxIdDescription = data.taxIdDescription || null;
      
      var future = $http({
        method: 'PUT',
        url: '/settings/emailPages/taxNumber',
        data: data
      });
      Utils.handleCallback(future, callback);
    }

    return {
      saveNumberForm: saveNumberForm,
      getCompanyEmailNotification: getCompanyEmailNotification,
      getTermsAndConditions: getTermsAndConditions,
      setToDefaultTemplate: setToDefaultTemplate,
      getTemplate: getTemplate,
      saveEmailTemplate: saveEmailTemplate,
      getHtmlForPreview: getHtmlForPreview,
      getInvoiceContact: getInvoiceContact,
      saveInvoiceContact: saveInvoiceContact,
      toggleInvoiceContact: toggleInvoiceContact,
      getTaxNumber: getTaxNumber,
      updateTaxNumber: updateTaxNumber
    }
  }
  ]);
})(window, jQuery);
