'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("autoExpand", function(){
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          value: '=value'
        },

        link: function(scope, element, attr){
            var update = function(){
                element.css("height", "auto");
                var height = element[0].scrollHeight;
                if(height > 0){

                  if (limit && height >= limit) {
                    element.css('height', limit + 'px')
                  } else {
                    element.css("height", height + "px");
                  }

                }
            };

            element.parent().css('position', 'relative');


            var cloned = element.clone();

            cloned.css('opacity', 0);
            cloned.css('z-index', '1000');
            cloned.css('height', '0px');

            element.parent().append(cloned);
            scope.$watch('value', function(){
                update();

                cloned.html(scope.value)
            });
            attr.$set("ngTrim", "false");

            var limit = attr.limit;

            if (limit) {

              element.css('overflow', 'hidden');
              cloned.css('overflow', 'hidden');
              cloned.css('position', 'absolute');
              cloned.css('width', element[0].clientWidth + 'px')


              var lines = 1;

              function getKeyNum(e) {
                  var keynum;
                  // IE
                  if (window.event) {
                      keynum = e.keyCode;
                      // Netscape/Firefox/Opera
                  } else if (e.which) {
                      keynum = e.which;
                  }

                  return keynum;
              }

              var limitLines = function (e) {
                  var keynum = getKeyNum(e);

                  var evtobj = window.event? event : e
                  if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
                    scope.value = checkForOverflow(scope.value);

                    element[0].blur();
                    element[0].focus();
                    element[0].click();
                    scope.$digest()
                  }


                  if (keynum === 13) {
                      if (element[0].scrollHeight >= +limit) {
                          e.stopPropagation();
                          e.preventDefault();
                      }
                  }

                  if (keynum !== 8) {
                    var value = e.target.value.slice(0, e.srcElement.selectionStart) + String.fromCharCode(keynum) + e.target.value.slice(e.srcElement.selectionStart);
                    // value.splice(e.srcElement.selectionStart, 0, String.fromCharCode(keynum))
                    cloned.html(value);
                    if (cloned[0].scrollHeight > +limit) {
                      e.stopPropagation();
                      e.preventDefault();

                      cloned.html(scope.value);
                    }
                  }


              };

              var setNumberOfLines = function (e) {
                  lines = getNumberOfLines(this.value);
              };

              var limitPaste = function (e) {
                  var clipboardData, pastedData, newValue, isOverflowed;
                  // Stop data actually being pasted into div
                  e.stopPropagation();
                  e.preventDefault();

                  // Get pasted data via clipboard API
                  clipboardData = e.clipboardData || window.clipboardData;
                  pastedData = clipboardData.getData('Text');


                  newValue = (scope.value || '').slice(0, e.srcElement.selectionStart) + pastedData + (scope.value || '').slice(e.srcElement.selectionStart);
                  cloned.html(newValue);

                  isOverflowed = cloned[0].scrollHeight > +limit

                  var copiedValue = newValue;


                

                  scope.value = checkForOverflow(copiedValue);
                  element[0].blur();
                  element[0].focus();
                  element[0].click();
                  scope.$digest()



              };

              function checkForOverflow(value) {
                var isOverflowed = cloned[0].scrollHeight > +limit;

                while (isOverflowed) {
                  value = value.slice(0, -1);
                  cloned.html(value);
                  isOverflowed = cloned[0].scrollHeight > +limit;
                }

                return value;
              }

              function getNumberOfLines(str) {
                  if (str) {
                      return str.split(/\r\n|\r|\n/).length;
                  }

                  return 1;
              }
              //
              // element[0].addEventListener('change', )


                element[0].addEventListener('keydown', limitLines);
                element[0].addEventListener('keyup', setNumberOfLines);
                element[0].addEventListener('cut', setNumberOfLines);
                element[0].addEventListener('paste', limitPaste);
            }


          }
      }
  });

})();
