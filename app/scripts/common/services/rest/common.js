'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

    $provide.factory('myHttpInterceptor', ['$rootScope', '$q', function ($rootScope, $q) {

      function processResponse(response) {

        if (response.data.errorMessage === 'unauthorized' || response.data.authMessage === 'unauthorized' || response.data.message === 'userDisabled') {

          if (window.location.pathname === "/test") {
            return;
          }

          if (!$rootScope.isLogOut) {
            if ($rootScope.logOut && response.data.message === 'userDisabled') {
              $rootScope.logOut('Your account has been disabled.');
            } else if ($rootScope.logOut) {
              $rootScope.logOut();
            } else {
              alert('Your will be logout now.');
              window.loggingOut = true;
              window.location.href = '/logout';
              window.location.hash = '';
            }
          }

          return;
        } else if (response.data.showMessage) {
          alert(response.data.showMessage);
          return {};
        }

        return response;
      }

      function processResponseError(response) {
        return $q.reject(processResponse(response));
      }

      return {

        'request': function (config) {

          if (config.url) {

            if (!config.params) {
              config.params = {};
            }

            if (!(config.url.indexOf('.html') >= 0)) {
              config.params.t = new Date().getTime();
            }
          }

          return config;
        },

        'response': processResponse,
        'responseError': processResponseError

      };
    }]);

    $httpProvider.interceptors.push('myHttpInterceptor');

  }]);

  services.run(['$http', '$rootScope', 'ConstantsService', function ($http, $rootScope, ConstantsService) {
    $http.get('/users/current').success(function (resp) {
      $rootScope.currentUser = resp;
    });

    $rootScope.numberCounterDelimiter = '-';

  }]);

  services.service('Downloader', function () {

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    function downloadTicketAttachments(id) {
      downloadByUrl('/v2/tickets/' + id + '/downloadAttachments');
    };

    function downloadByUrl(url, fileName) {

      //iOS devices do not support downloading. We have to inform user about this.
      if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
      }

      //If in Chrome or Safari - download via virtual link click
      if (isChrome || isFirefox) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = url;

        if (link.download !== undefined) {
          //Set HTML5 download attribute. This will prevent file from opening if supported.
          if (!fileName) {
            fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
          }
          link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
          var e = document.createEvent('MouseEvents');
          e.initEvent('click', true, true);
          link.dispatchEvent(e);
          return true;
        }
      } else if (isSafari) {
        $("#pdf").remove();
        $("body").append("<iframe id='pdf' style='display:none;'></iframe>");
        document.getElementById('pdf').src = url;
        return;
      }

      // Force file download (whether supported by server).
//            url += '?download';
//todo fix bug with multiple files download
      window.open(url, '_new');
      return true;

    }

    function downloadFile(fileId, fileName) {
      downloadByUrl('/file/' + fileId, fileName);
    }

    return {
      downloadByUrl: downloadByUrl,
      downloadTicketAttachments: downloadTicketAttachments,
      downloadFile: downloadFile
    };
  });

  services.service('Utils', ["$http", '$rootScope', function ($http, $rootScope) {

    function staticCopy(inst) {

      var instCopy,
        copyProps = inst;

      if (!copyProps && this && this.staticCopy) {
        copyProps = this;
      }

      if (Object.prototype.toString.call(copyProps) === '[object Array]') {

        instCopy = [];

        for (var i = 0; i < copyProps.length; i++) {
          instCopy.push(staticCopy(copyProps[i]));
        }

      } else if (Object.prototype.toString.call(copyProps) === '[object Object]') {

        instCopy = {};

        for (var prop in copyProps) {

          if (prop === 'staticCopy' || prop == '$$hashKey') {
            continue;
          }

          instCopy[prop] = staticCopy(copyProps[prop]);
        }
      } else {
        return copyProps;
      }

      return instCopy;
    }

    function customizeObj(sourceObj, targetObj) {

      if (Object.prototype.toString.call(sourceObj) === '[object String]') {
        return sourceObj;
      }

      targetObj = targetObj || sourceObj;

//            if(targetObj['staticCopy']){
//                throw 'Method staticCopy engaged by TicketsService!';
//            }

      for (var prop in sourceObj) {

        var value = sourceObj[prop];

        if (Object.prototype.toString.call(value) === '[object Array]') {
          customizeArray(value);
        } else if (Object.prototype.toString.call(value) === '[object Object]') {
          customizeObj(value);
        }

        defineReadOnlyProperty(targetObj, prop, value);
      }

      defineReadOnlyProperty(targetObj, 'staticCopy', staticCopy);

      return targetObj;

    }

    function customizeArray(source, target) {

      if (target) {
        for (var i = 0; i < source.length; i++) {
          target.push(customizeObj(source[i]));
        }

        defineReadOnlyProperty(target, 'staticCopy', staticCopy);

        return target;

      }

      for (var i = 0; i < source.length; i++) {
        source[i] = customizeObj(source[i]);
      }

      defineReadOnlyProperty(source, 'staticCopy', staticCopy);

      return source;

    }

    function defineReadOnlyProperty(obj, prop, value) {
      Object.defineProperty(obj, prop, {
        value: value,
        writable: false,
        enumerable: true,
        configurable: true
      })
    }

    function findById(arrayObj, id) {
      if (!arrayObj || !arrayObj.length) {
        return;
      }

      for (var i = 0; i < arrayObj.length; i++) {

        var item = arrayObj[i],
          itemId;

        if (item.versionedId) {
          itemId = item.versionedId.id;
        } else {
          itemId = item.id;
        }

        if (itemId === id) {
          return item;
        }
      }
    }

    function indexOfId(arrayObj, id) {
      for (var i = 0; i < arrayObj.length; i++) {
        var item = arrayObj[i],
          itemId;

        if (item) {

          if (item.versionedId) {
            itemId = item.versionedId.id;
          } else {
            itemId = item.id;
          }

          if (itemId === id) {
            return i;
          }
        }
      }
      return -1;
    }

    function handleCallback(future, callback) {
      if (callback) {
        future.then(function (resp) {
          callback(resp.data);
        }, function (resp) {
          callback(resp.data);
        });
      }
    }

    function deleteById(array, id) {
      var index = indexOfId(array, id);

      if (index > -1) {
        array.splice(index, 1);
      }
    }

    function getListByUrl(url, callback, realTimeApplier) {

      var resultsList = [];

      if (realTimeApplier) {
        resultsList = customizeArray(resultsList);
      }

      $http.get(url).then(function (resp) {

        if (realTimeApplier) {
          customizeArray(resp.data, resultsList);

          realTimeApplier(resultsList);

        } else {
          for (var i = 0; i < resp.data.length; i++) {
            resultsList.push(resp.data[i]);
          }
        }

        if (callback) {
          callback(resultsList);
        }
      }, function (response) {

        if (callback) {
          callback(response.data);
        }
      });

      return resultsList;
    }

    function getFormattedNumber(numberCounter, increment) {

      var num;

      if (increment) {
        num = '' + (parseInt(numberCounter.numPart) + 1);

        while (num.length < numberCounter.numPart.length) num = '0' + num;
      } else {
        num = numberCounter.numPart;
      }
      if (numberCounter.charPart) {
        return numberCounter.charPart + $rootScope.numberCounterDelimiter + num;
      } else {
        return num;
      }

    }

    function getComparatorBy(field, reverse) {
      return function sort(a, b) {
        if (reverse) return b[field] - a[field];

        return a[field] - b[field];
      }
    }

    function formatDate(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }

    return {
      customizeObj: customizeObj,
      customizeArray: customizeArray,
      defineReadOnlyProperty: defineReadOnlyProperty,
      findById: findById,
      indexOfId: indexOfId,
      handleCallback: handleCallback,
      deleteById: deleteById,
      getListByUrl: getListByUrl,
      getFormattedNumber: getFormattedNumber,
      getComparatorBy: getComparatorBy,
      formatDate: formatDate
    }
  }]);

})(window, jQuery);
