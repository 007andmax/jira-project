'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ContactsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService) {

      function isEmailUnique(email, id, callback) {

        if (!email) {
          throw 'email is required!'
        }

        var info = Utils.customizeObj({});

        $http.get('/contacts/isEmailUnique?email=' + email + '&id=' + id).then(function (resp) {
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

      function getSubscribedContactsOnTicket(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        var info = Utils.customizeArray([]);

        $http.get('/contacts/getSubscribedContactsOnTicket/').then(function (resp) {
          Utils.customizeArray(resp.data, info);

          RealTimeService.subscribe('/subscription/' + CompaniesService.getCurrentCompany().id, scope, function (newChange) {

            console.log(newChange);

            if (!newChange.data.contact) {
              return;
            }

            var contact = Utils.findById(info, newChange.data.contact.id);

            if (contact) {

              if (newChange.action == 'SUBSCRIPTION_SAVED') {
                Utils.defineReadOnlyProperty(contact, 'subscription', Utils.customizeObj(newChange.data));

                if (callback) {
                  callback();
                }
              } else if (newChange.action == 'SUBSCRIPTION_DELETED') {
                delete contact.subscription;

                if (callback) {
                  callback();
                }
              }
            }

          });

          RealTimeService.subscribe('/vendorContacts', scope, function (newChange) {

            console.log(newChange);

            if (newChange.action == 'VENDOR_CONTACTS_SAVE') {

              for (var i = 0; i < newChange.data.length; i++) {
                var newContact = newChange.data[i];
                var oldContact = Utils.findById(info, newContact.id);

                if (newContact.subscription.ticket) {
                  if (oldContact) {
                    Utils.customizeObj(newContact, oldContact);
                  } else {
                    info.push(Utils.customizeObj(newContact));
                  }
                } else if (oldContact) {
                  Utils.deleteById(info, oldContact.id)
                }

              }

              if (callback) {
                callback();
              }

            } else if (newChange.action == 'VENDOR_CONTACTS_DELETE') {
              for (var i = 0; i < newChange.data.length; i++) {
                Utils.deleteById(info, newChange.data[i].id);
              }

              if (callback) {
                callback();
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
        return info;
      }

      function getAllVendorsContacts(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        var info = Utils.customizeArray([]);

        $http.get('/contacts/getAllVendorsContacts/').then(function (resp) {
          Utils.customizeArray(resp.data, info);

          RealTimeService.subscribe('/vendorContacts', scope, function (newChange) {

            console.log(newChange);

            if (newChange.action == 'VENDOR_CONTACTS_SAVE') {

              for (var i = 0; i < newChange.data.length; i++) {
                var newContact = newChange.data[i];
                var oldContact = Utils.findById(info, newContact.id);

                if (oldContact) {
                  Utils.customizeObj(newContact, oldContact);
                } else {
                  info.push(Utils.customizeObj(newContact));
                }
              }
              if (callback) {
                callback();
              }

            } else if (newChange.action == 'VENDOR_CONTACTS_DELETE') {
              for (var i = 0; i < newChange.data.length; i++) {
                Utils.deleteById(info, newChange.data[i].id);
              }

              if (callback) {
                callback();
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
        return info;
      }


      return {
        isEmailUnique: isEmailUnique,
        getSubscribedContactsOnTicket: getSubscribedContactsOnTicket,
        getAllVendorsContacts: getAllVendorsContacts
      }
    }
  ]);
})(window, jQuery);
