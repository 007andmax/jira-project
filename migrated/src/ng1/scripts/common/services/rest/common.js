'use strict';


(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

    $provide.factory('myHttpInterceptor', ['$rootScope', '$q', function ($rootScope, $q) {

      function processResponse(response) {

        var unlockExpiredHeader = response.headers('SESSION_UNLOCK_EXPIRED');
        var userDisabledHeader = response.headers('USER_DISABLED');
        var isUnauthorized= response.data.errorMessage === 'unauthorized' || response.data.authMessage === 'unauthorized',
          isDisabled = response.data.message === 'userDisabled';

        if (userDisabledHeader) {
          isDisabled = isDisabled || userDisabledHeader.toLowerCase() === 'true';
        }

        if (unlockExpiredHeader) {
          var isSessionUnlockExpired = unlockExpiredHeader.toLowerCase() === 'true';
        }

        if (isSessionUnlockExpired && $rootScope.logOut) {
          if (!$rootScope.isLogOut) {
            $rootScope.logOut('You have been away for more than 3 hours. You have been logged off. Please login again.');
          }
          return;
        }

        if (isUnauthorized || isDisabled) {

          if (window.location.pathname === "/test") {
            return;
          }

          if (!$rootScope.isLogOut) {
            if ($rootScope.logOut && isDisabled) {
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
        } else if (response.status === 423) {
          if (!$rootScope.isUnlockShowed) {
            $rootScope.showLockModal(true);
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

            if (window.qtBuildDate !== 'dateOfLastBuild' && config.url.indexOf('uib/') !== 0) {
              config.params.t = window.qtBuildDate;
            } else if (!(config.url.indexOf('.html') >= 0)) {
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

  services.run(['$http', '$rootScope', 'RealTimeService', function ($http, $rootScope, RealTimeService) {
    $http.get('/users/current').success(function (resp) {
      $rootScope.currentUser = resp;
      $rootScope.currentUserLoaded = true;
      if ($rootScope.servicesLoaded) {
        $rootScope.applicationLoaded = true;
      }
      RealTimeService.subscribe('/permissions', $rootScope.$new(), function (newChange) {
        if (newChange.action === 'PERMISSIONS_UPDATE') {
          $rootScope.currentUser.permissions = newChange.data.permissions;
        } else if (newChange.action === 'PERMISSIONS_UPDATE_GLOBAL') {
          $rootScope.changedPermission = newChange.data;
        }
      })
    });

    $rootScope.numberCounterDelimiter = '-';

  }]);

  services.factory('$exceptionHandler', ['$log', function($log) {
    return function myExceptionHandler(exception, cause) {
      //todo: send errors to the backend (need endpoint)
      console.log('teste');
      $log.warn(exception, cause);
    };
  }]);

  services.service('Downloader', function () {

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    function downloadTicketAttachments(id) {
      downloadByUrl('/v2/tickets/' + id + '/downloadAttachments');
    }

    function downloadDraftAttachments(id) {
      downloadByUrl('/drafts/' + id + '/downloadAttachments');
    }

    function downloadByUrl(url, fileName) {

      const indexOfDot = fileName && fileName.lastIndexOf('.');
      const fileFormat = fileName && fileName.substring(indexOfDot);
      //iOS devices do not support downloading. We have to inform user about this.
      if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
      }



      //If in Chrome or Safari - download via virtual link click
      if (isChrome || isFirefox) {
        //Creating new link node.
        var indexOf = url.indexOf('.com');
        var shortUrl = url.slice(url.indexOf('.com') + 4);

        if (indexOf !== -1) {
          return redownload(url, true) && redownload(shortUrl);
        } else {

         // return redownload(url);
          if (fileFormat === '.pdf' || fileFormat === '.html') {
            console.log('1');
            return redownload((url + fileFormat), true);
          } else {
            console.log('2');
            return redownload((url + fileFormat));
          }
        }

        // var link = document.createElement('a');
        // link.target = "_blank";
        // link.href = url;
        //
        // if (link.download !== undefined) {
        //   //Set HTML5 download attribute. This will prevent file from opening if supported.
        //   if (!fileName) {
        //     fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
        //   }
        //
        //   // alert(url);
        //   // alert(fileName);
        //   link.download = fileName.indexOf('.') === -1 ? fileName + '.pdf' : fileName;
        //
        //   // alert(link.download)
        // }
        //
        // //Dispatching click event.
        // if (document.createEvent) {
        //   var e = document.createEvent('MouseEvents');
        //   e.initEvent('click', true, true);
        //   link.dispatchEvent(e);
        //
        //   console.log(link)
        //   return true;
        // }
      } else if (isSafari) {
        $("#pdf").remove();
        $("body").append("<iframe id='pdf' style='display:none;'></iframe>");
        document.getElementById('pdf').src = url;
        return;
      }

      // Force file download (whether supported by server).
//            url += '?download';
//todo fix bug with multiple files download
      window.open(url, '_blank');
      return true;

      function redownload(url, open) {
        var link = document.createElement('a');
        link.target = "_blank";
        link.href = url;

        if (link.download !== undefined) {
          //Set HTML5 download attribute. This will prevent file from opening if supported.
          if (!fileName) {
            fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
          }

          // alert(url);
          // alert(fileName);
          if (!open) {
            link.download = fileName;

          }

          // alert(link.download)
        }

        //Dispatching click event.
        if (document.createEvent) {
          var e = document.createEvent('MouseEvents');
          e.initEvent('click', true, true);
          link.dispatchEvent(e);
          return true;
        }
      }

    }



    function downloadFile(fileId, fileName) {
      downloadByUrl('/file/' + fileId, fileName);
    }

    return {
      downloadByUrl: downloadByUrl,
      downloadTicketAttachments: downloadTicketAttachments,
      downloadDraftAttachments: downloadDraftAttachments,
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

        defineProperty(targetObj, prop, value);
      }

      defineProperty(targetObj, 'staticCopy', staticCopy);

      return targetObj;

    }

    function customizeArray(source, target) {

      if (target) {
        for (var i = 0; i < source.length; i++) {
          target.push(customizeObj(source[i]));
        }

        defineProperty(target, 'staticCopy', staticCopy);

        return target;

      }

      for (var i = 0; i < source.length; i++) {
        source[i] = customizeObj(source[i]);
      }

      defineProperty(source, 'staticCopy', staticCopy);

      return source;

    }

    function defineProperty(obj, prop, value) {
      if (obj && prop != null) {
        Object.defineProperty(obj, prop, {
          value: value,
          writable: true,
          enumerable: true,
          configurable: true
        })
      }
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
        return true;
      }
      return false;
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
      return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    }

   function removeFromArrayByCondition(array, condition) {
     var i = 0;
     while (i < array.length) {
       if (condition(array[i], i)) {
         array.splice(i, 1);
       }
       else {
         ++i;
       }
     }
   }

    function addNumberOfMonth(oldDate, amountOfMonth) {
      Date.isLeapYear = function (year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
      };

      Date.getDaysInMonth = function (year, month) {
        return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
      };

      Date.prototype.isLeapYear = function () {
        return Date.isLeapYear(this.getFullYear());
      };

      Date.prototype.getDaysInMonth = function () {
        return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
      };

      Date.prototype.addMonths = function (value) {
        var n = this.getDate();
        var ifLastDay = this.getDate() == this.getDaysInMonth();
        this.setDate(1);
        this.setMonth(this.getMonth() + value);
        if(ifLastDay) {
          this.setDate( this.getDaysInMonth());
        } else {
          this.setDate(Math.min(n, this.getDaysInMonth()));
        }

        return this;
      };

      var newDate = new Date(oldDate);
      return newDate.addMonths(amountOfMonth);
    }

    function minusDays(date, amountOfDays) {
      var temp = new Date(date);
      temp.setDate(temp.getDate() - amountOfDays);
      return temp;
    }

    function compareDateNowWithDate(date) {
      var d = new Date(date);
      var t = d.getTime();
      var now = Date.now();
      return (now > t);
    }

    function calculateDateWithTimeZoneAndPeriod(dateToChange, period, numOfIntervals) {
      var nOfIntervals = numOfIntervals || 1;
      var date = dateToChange;
      var day = 1000 * 60 * 60 * 24;
      var utc_timestamp = Date.UTC(date.getUTCFullYear(),date.getUTCMonth(), date.getUTCDate() ,
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
      var calculatePlusDays = utc_timestamp + day*period*nOfIntervals;
      var nd = new Date(calculatePlusDays);
      date.setTime(calculatePlusDays - (nd.getTimezoneOffset()*60000));
      return date;
    }

    return {
      customizeObj: customizeObj,
      customizeArray: customizeArray,
      defineReadOnlyProperty: defineProperty,
      findById: findById,
      indexOfId: indexOfId,
      handleCallback: handleCallback,
      deleteById: deleteById,
      getListByUrl: getListByUrl,
      getFormattedNumber: getFormattedNumber,
      getComparatorBy: getComparatorBy,
      formatDate: formatDate,
      removeFromArrayByCondition: removeFromArrayByCondition,
      addNumberOfMonth: addNumberOfMonth,
      minusDays: minusDays,
      compareDateNowWithDate: compareDateNowWithDate,
      calculateDateWithTimeZoneAndPeriod: calculateDateWithTimeZoneAndPeriod
    }
  }]);

})(window, jQuery);
