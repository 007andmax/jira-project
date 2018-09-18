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
            cloned.css('height', '0px');

            element.parent().append(cloned);
            scope.$watch('value', function(){
                update();

                cloned.html(scope.value)
            });
            attr.$set("ngTrim", "false");

            var limit = attr.limit;
            console.log(scope.model, 'ATTRRR')

            if (limit) {
              console.log('limited to', limit)

              console.log('HERER AIII M')
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
                console.log('limit lines')
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

                  if (element[0].scrollHeight < +limit) {

                  } else if (keynum !== 8){
                    cloned.html(scope.value + String.fromCharCode(keynum));

                    if (cloned[0].scrollHeight > +limit) {
                      e.stopPropagation();
                      e.preventDefault();

                      cloned.html(scope.value);
                    } else {

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

                  console.log(pastedData, "PASTEDDDDD")
                  newValue = (scope.value || '') + pastedData
                  cloned.html(newValue);

                  isOverflowed = cloned[0].scrollHeight > +limit

                  var copiedValue = newValue;


                  console.log('pretty good', scope)

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
