'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('AssociationService', ['$http', '$rootScope', 'Utils', '$filter', function ($http, $rootScope, Utils) {

    function deleteAssociation(id, callback) {

      if (!id) {
        throw 'id is required!';
      }

      var future = $http({
        url: '/association/' + id,
        method: 'DELETE'
      });

      Utils.handleCallback(future, callback);
    }

    return {
      deleteAssociation: deleteAssociation
    }
  }
  ]);
})(window, jQuery);
