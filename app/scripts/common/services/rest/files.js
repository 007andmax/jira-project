'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('FilesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {

    function create(file, onProgress, onFinish, onError, isAvatar) {

      if (!file) {
        throw 'file is required!'
      }

      var storedFile = {};

      var fd = new FormData();
      fd.append("file", file);

      var xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", onProgress, false);
      xhr.addEventListener("load", function (event) {

        var created = angular.fromJson(event.currentTarget.responseText);

        for (var key in created) {
          storedFile[key] = created[key];
        }

        if (onFinish) {
          onFinish(storedFile);
        }

      }, false);
      xhr.addEventListener("error", onError, false);
      //xhr.addEventListener("abort", listeners.abort, false);
      xhr.open("POST", "/file?isAvatar=" + !!isAvatar);
      xhr.send(fd);

      return xhr;
    }

    function createImageFromBase64Url(base64Url, onFinish) {

      if (!base64Url) {
        throw 'base64Url is required!'
      }

      var storedFile = {};

      $http({
        url: '/base64image',
        method: 'POST',
        data: base64Url.substring('data:image/png;base64,'.length, base64Url.length)
      }).then(function (resp) {
        for (var key in resp.data) {
          storedFile[key] = resp.data[key];
        }

        if (onFinish) {
          onFinish(storedFile);
        }
      });

      return storedFile;
    }

    function getMetadata(fileId, callback) {

      if (!fileId) {
        throw 'fileId is required!'
      }

      var file = { id: fileId };

      $http.get('/file/' + fileId + '/meta').then(function (resp) {
        for (var key in resp.data) {
          file[key] = resp.data[key];
        }

        if (callback) {
          callback(file);
        }
      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });

      return file;
    }

    function remove(fileId, callback) {

      if (!fileId) {
        throw 'fileId is required!'
      }

      $http({
        url: '/file/' + fileId,
        method: 'DELETE'
      }).then(function (resp) {
        if (callback) {
          callback(resp.data);
        }
      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
    }

    return {
      create: create,
      createImageFromBase64Url: createImageFromBase64Url,
      getMetadata: getMetadata,
      remove: remove
    }

  }]);

})(window, jQuery);
