'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('serviceQuantityPicker',
    ['$templateRequest', '$compile', '$timeout', '$rootScope', function ($templateRequest, $compile, $timeout, $rootScope) {
      return {
        restrict: 'A',
        scope: {
          quantity: "=serviceQuantityPicker",
          form: '=sqpForm',
          sqpDay: '<sqpDay',
          sqpPeriod: '@sqpPeriod'
        },
        link: function (scope, element, attrs) {
          if (scope.sqpDay) {
            scope.sqpInput = 'sqp-cond-input=' + '"' + scope.sqpDay + ' ' + scope.sqpPeriod + '"';
          } else {
            scope.sqpInput = 'sqp-input';
          }

          var quantityDropdown,
            isFormatShow = attrs.sqpIsShowFormat === 'true',
            isDropdownShow = false,
            input = element.find('[' + scope.sqpInput + ']'),
            dropdownElement = {
              hoverHour: '00',
              hoverMinute: '00',
              hoverFormat: 'AM',
              hoverFormatElement: undefined,
              hoverHourElement: undefined,
              hoverMinuteElement: undefined
            },
            savedValue = '',
            inited = false;

          element.addClass('timer-quantity');

          scope.$watch('quantity', function (val) {


            if (!inited || true) {


              initPicker();
              inited = true;
            }
            if (!val && input.val()) {
              input.val('')
            }
          });

          scope.$watch(function() {
            return $rootScope.hideTimePickers;
          }, function(val) {
            if (!val) return;
            if (scope.sqpDay !== val[0] || scope.sqpPeriod !== val[1]) {
              quantityDropdown.hide();
              $rootScope.hideTimePickers = null;
            }
          })

          checkInput()

          function checkInput() {
            if (input.val() === undefined) {
              input = element.find('[' + scope.sqpInput + ']');
              $timeout(checkInput, 100)
            } else {
              initPicker();
              inited = true;
              input.bind('input', onInput);
              input.bind('blur', onBlur);
              input.click(onClick);
            }
          }

          function onClick() {
            if (scope.sqpDay) {
              $rootScope.hideTimePickers = [scope.sqpDay, scope.sqpPeriod];
            }

            if (!isDropdownShow) {
              quantityDropdown.show();
              isDropdownShow = true;
            } else {
              quantityDropdown.hide();
              isDropdownShow = false;
            }
          }

          function onBlur() {
            var splited = input.val().split(' '),
              hours = splited.shift(),
              minutes = splited.pop();

            if (!hours) {
              scope.quantity = 0;
              return;
            }

            if (!minutes) {
              minutes = '0';
            }

            hours = parseInt(hours);
            minutes = parseInt(minutes);

            var isHoursInvalid = (hours || hours === 0) && hours < 10,
              isMinutesInvalid = minutes < 10,
              formattedHours = (isHoursInvalid ? '0' : '') + hours,
              formattedMinutes = (isMinutesInvalid ? '0' : '') + minutes;

            input.val(formattedHours + ' : ' + formattedMinutes);

            if (hours <= 8) {
              dropdownElement.hoverHour = formattedHours;
            } else {
              dropdownElement.hoverHour = '08';
            }

            if (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45) {
              dropdownElement.hoverMinute = formattedMinutes;
            } else {
              dropdownElement.hoverMinute = '00';
            }

            scope.quantity = hours * 60 + minutes;
            scope.$apply();
          }

          function onInput() {
            quantityDropdown.hide();
            isDropdownShow = false;

            var value = input.val(),
              lastIndex = value.length - 1;

            if (value === savedValue || value.length < savedValue.length) {

              var splited = value.split('');

              for (var i = 0; i < splited.length; i++) {
                var symbol = splited[i];
                if (': 0123456789'.indexOf(symbol) === -1) {
                  splited.splice(i--, 1);
                }
              }

              if (value[lastIndex] === ':' || (value[lastIndex] === ' ' && value[lastIndex - 1] !== ':')) {
                savedValue = value.split(' ')[0];
              } else {
                savedValue = splited.join('');
              }

              input.val(savedValue);
              return;
            }

            if (value) {
              var newSymbol = value[lastIndex],
                oldPart = value.substring(0, lastIndex),
                isNumber = !!parseInt(newSymbol) || parseInt(newSymbol) === 0,
                minutes = value.split(' : ')[1];

              if ((newSymbol === ':' || newSymbol === ' ') && oldPart.length && oldPart.indexOf(newSymbol) === -1) {
                savedValue = oldPart + ' : ';
              } else if (!isNumber || (minutes && minutes.length > 2)) {
                savedValue = oldPart;
              } else if (parseInt(minutes) > 60) {
                value = value.split(' : ');
                value[1] = '60';
                savedValue = value.join(' : ');
              } else {
                savedValue = value;
              }

              input.val(savedValue);
            }
          }

          function initPicker() {

            $templateRequest('/html/scripts/common/templates/service-quantity-picker.tpl.html').then(function (html) {

              quantityDropdown = angular.element(html);
              element.append(quantityDropdown);
              $compile(quantityDropdown)(scope);

              var hourDropdown = element.find('[hour_drop_down]'),
                minuteDropdown = element.find('[min_drop_down]'),
                formatDropdown = element.find('[format_drop_down]');

              hourDropdown.bind('mousedown', chooseQuantity);
              minuteDropdown.bind('mousedown', chooseQuantity);
              formatDropdown.bind('mousedown', chooseQuantity);

              if (scope.quantity) {
                setStartingValue(scope.quantity, hourDropdown, minuteDropdown, formatDropdown)
              }

              if (isFormatShow) {

                formatDropdown.show();

                formatDropdown.bind('mousemove', function (event) {

                  processingColumn('Format', event.target);

                });
              }

              hourDropdown.bind('mousemove', function (event) {
                processingColumn('Hour', event.target);

                // if (!dropdownElement.hoverHour) return;

                if (+dropdownElement.hoverHour < 6 || scope.sqpDay) {

                  // var topMinuteElement = (+dropdownElement.hoverHour * 30);
                  var topMinuteElement = getMousePositionInsidePicker(event);
                  minuteDropdown.css('top', topMinuteElement + 'px');

                  if (isFormatShow && +dropdownElement.hoverMinute * 2 > 60) {
                    formatDropdown.css('top', (+topMinuteElement + 60) + 'px');
                  } else if (isFormatShow) {
                    formatDropdown.css('top', (topMinuteElement + (+dropdownElement.hoverMinute * 2)) + 'px');
                  }

                } else {

                  var maxTop = (5 * 30);
                  minuteDropdown.css('top', maxTop + 'px');

                  if (isFormatShow && +dropdownElement.hoverMinute * 2 > 60) {
                    formatDropdown.css('top', (+maxTop + 60) + 'px');
                  } else if (isFormatShow) {
                    formatDropdown.css('top', (maxTop + (+dropdownElement.hoverMinute * 2)) + 'px');
                  }
                }

              });

              minuteDropdown.bind('mousemove', function (event) {

                var top = minuteDropdown.position().top;

                processingColumn('Minute', event.target);

                if (isFormatShow && +dropdownElement.hoverMinute < 45) {
                  formatDropdown.css('top', (top + (+dropdownElement.hoverMinute * 2)) + 'px');
                } else if (isFormatShow) {
                  formatDropdown.css('top', (top + (30 * 2)) + 'px');
                }

              });

            });
          }

          function getMousePositionInsidePicker(event) {
            var topPos = event.pageY - quantityDropdown[0].getBoundingClientRect().top - (quantityDropdown[0].scrollTop + (window.pageYOffset || document.documentElement.scrollTop));
            return Math.floor(topPos / 24) * 24;
          }


          scope.closeDropdown = function () {
            quantityDropdown.hide();
            isDropdownShow = false;
          };

          function chooseQuantity(event) {

            var hour = dropdownElement.hoverHour,
              minute = dropdownElement.hoverMinute;

            if (isFormatShow) {

              input.val(hour + ' : ' + minute + ' ' + dropdownElement.hoverFormat);

              if (dropdownElement.hoverFormat === 'PM') {
                scope.quantity = +((+hour * 60) + +minute) * 12 * 60 || undefined;
              } else {
                scope.quantity = +((+hour * 60) + +minute) || undefined;
              }

            } else {

              if ((parseFloat(hour) + parseFloat(minute)) < 1) {
                input.val('');
                scope.quantity = 0;
              } else {
                input.val(hour + ' : ' + minute);
                scope.quantity = +((+hour * 60) + +minute) || undefined;
              }

            }

            if (scope.form) {
              scope.form.$setDirty();
            }

            quantityDropdown.hide();
            isDropdownShow = false;

            scope.$apply();
          }

          function processingColumn(element, target) {
            if (target.tagName.toLowerCase() !== 'a') return;

            if (dropdownElement['hover' + element + 'Element']) {
              dropdownElement['hover' + element + 'Element'].css('background-color', '#ffffff');
            }

            dropdownElement['hover' + element + 'Element'] = $(target);
            dropdownElement['hover' + element] = target.text;

            dropdownElement['hover' + element + 'Element'].css('background-color', '#e2f1fd');

          }

          function setStartingValue(value, hourDropdown, minuteDropdown, formatDropdown) {

            if (scope.sqpDay) {
              var time = value.split(':');
              var hour = time[0];
              var minute = time[1];

              setValue(hour, minute);

              return;
            }

            if (isFormatShow) {

              var format;

              if (value > 525) {
                value = value / 12 / 60;
                format = 'PM';
              } else {
                format = 'AM';
              }

            }

            var hour = value / 60 ^ 0;

            if (hour) {

              var minute = value % 60;

              if (hour < 10) {
                hour = '0' + hour;
              }

              if (minute < 10) {
                minute = '0' + minute;
              }

              setValue(hour, minute)

            } else {
              setValue('00', value < 10 ? '0' + value : value);
            }

            function setValue(hours, minute) {
              if (isFormatShow) {
                input.val(hours + ' : ' + minute + ' ' + format);

                dropdownElement.hoverHourElement = hourDropdown.find('li:nth-child(' + (+hours + 1) + ') a');
                dropdownElement.hoverHourElement.css('background-color', '#f1f5fa');

                if ((minute % 15) === 0) {
                  dropdownElement.hoverMinuteElement = minuteDropdown.find('li:nth-child(' + (+minute / 15 + 1) + ') a');
                  dropdownElement.hoverMinuteElement.css('background-color', '#f1f5fa');
                }

                dropdownElement.hoverFormatElement = formatDropdown.find('li:nth-child(' + (format === 'AM' ? 1 : 2) + ') a');
                dropdownElement.hoverFormatElement.css('background-color', '#f1f5fa');

                if (+hours < 6) {
                  minuteDropdown.css('top', (+hours * 30) + 'px');
                } else {
                  var maxTop = (5 * 30);
                  minuteDropdown.css('top', maxTop + 'px');
                }

                var topMinuteElement = (+hours * 30);

                if (+minute * 2 > 60) {
                  formatDropdown.css('top', (+topMinuteElement + 60) + 'px');
                } else {
                  formatDropdown.css('top', (topMinuteElement + (+minute * 2)) + 'px');
                }

              } else {
                input.val(hours + ' : ' + minute);

                dropdownElement.hoverHourElement = hourDropdown.find('li:nth-child(' + (+hours + 1) + ') a');
                dropdownElement.hoverHourElement.css('background-color', '#f1f5fa');

                if ((minute % 15) === 0) {
                  dropdownElement.hoverMinuteElement = minuteDropdown.find('li:nth-child(' + (+minute / 15 + 1) + ') a');
                  dropdownElement.hoverMinuteElement.css('background-color', '#f1f5fa');
                }

                if (+hours < 6) {
                  minuteDropdown.css('top', (+hours * 30) + 'px');
                } else {
                  var maxTop = (5 * 30);
                  minuteDropdown.css('top', maxTop + 'px');
                }

              }
            }

          }

        }
      }
    }]);
})();
