'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("insertKeyword",
    function () {
      return {
        restrict: 'A',
        link: function (scope) {
          var fieldsForInsert = document.querySelectorAll('.insert-field'),
            lastSelected = fieldsForInsert[fieldsForInsert.length - 1];

          angular.element(fieldsForInsert).bind('focus', function (e) {
            lastSelected = e.target;
          });

          scope.insertAtCaret = function (text) {
            var scrollPos = lastSelected.scrollTop;
            var strPos = 0;
            var br = ((lastSelected.selectionStart || lastSelected.selectionStart == '0') ?
              "ff" : (document.selection ? "ie" : false ) );
            if (br == "ie") {
              lastSelected.focus();
              var range = document.selection.createRange();
              range.moveStart('character', -lastSelected.value.length);
              strPos = range.text.length;
            }
            else if (br == "ff") {
              strPos = lastSelected.selectionStart;
            }

            var front = (lastSelected.value).substring(0, strPos);
            var back = (lastSelected.value).substring(strPos, lastSelected.value.length);
            lastSelected.value = front + text + back;
            strPos = strPos + text.length;
            if (br == "ie") {
              lastSelected.focus();
              var range = document.selection.createRange();
              range.moveStart('character', -lastSelected.value.length);
              range.moveStart('character', strPos);
              range.moveEnd('character', 0);
              range.select();
            }
            else if (br == "ff") {
              lastSelected.selectionStart = strPos;
              lastSelected.selectionEnd = strPos;
              lastSelected.focus();
            }
            lastSelected.scrollTop = scrollPos;
            angular.element(lastSelected).data('$ngModelController').$setViewValue(lastSelected.value);
            return false;
          }
        }
      }
    });
})();
