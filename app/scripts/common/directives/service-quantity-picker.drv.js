'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('serviceQuantityPicker',
    ['$templateRequest', '$compile', function ($templateRequest, $compile) {
      return {
        restrict: 'A',
        scope: {
          quantity: "=serviceQuantityPicker"
        },
        link: function (scope, element, attrs) {

          var quantityDropdown,
            isFormatShow = attrs.sqpIsShowFormat === 'true',
            isDropdownShow = false,
            input = element.find('[sqp-input]'),
            dropdownElement = {
              hoverHour: '00',
              hoverMinute: '00',
              hoverFormat: 'AM',
              hoverFormatElement: undefined,
              hoverHourElement: undefined,
              hoverMinuteElement: undefined
            };

          element.addClass('timer-quantity');

          $templateRequest('/html/scripts/common/templates/service-quantity-picker.tpl.html').then(function (html) {

            quantityDropdown = angular.element(html);
            element.append(quantityDropdown);
            $compile(quantityDropdown)(scope);

            var hourDropdown = element.find('[hour_drop_down]'),
              minuteDropdown = element.find('[min_drop_down]'),
              formatDropdown = element.find('[format_drop_down]');

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

              if (+dropdownElement.hoverHour < 6) {

                var topMinuteElement = (+dropdownElement.hoverHour * 30);
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

          input.click(function () {
            if (!isDropdownShow) {
              quantityDropdown.show();
              isDropdownShow = true;
            } else {
              quantityDropdown.hide();
              isDropdownShow = false;
            }
          });

          scope.closeDropdown = function () {
            quantityDropdown.hide();
            isDropdownShow = false;
          };

          scope.chooseQuantity = function () {

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

              input.val(hour + ' : ' + minute);
              scope.quantity = +((+hour * 60) + +minute) || undefined;

            }

            quantityDropdown.hide();
            isDropdownShow = false;
          };

          function processingColumn(element, target) {

            if (dropdownElement['hover' + element + 'Element']) {
              dropdownElement['hover' + element + 'Element'].css('background-color', '#ffffff');
            }

            dropdownElement['hover' + element + 'Element'] = $(target);
            dropdownElement['hover' + element] = target.text;

            dropdownElement['hover' + element + 'Element'].css('background-color', '#f1f5fa');

          }

          function setStartingValue(value, hourDropdown, minuteDropdown, formatDropdown) {

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
              setValue('00', value);
            }

            function setValue(hours, minute) {
              if (isFormatShow) {
                input.val(hours + ' : ' + minute + ' ' + format);

                dropdownElement.hoverHourElement = hourDropdown.find('li:nth-child(' + (+hours + 1) + ') a');
                dropdownElement.hoverHourElement.css('background-color', '#f1f5fa');

                dropdownElement.hoverMinuteElement = minuteDropdown.find('li:nth-child(' + (+minute / 15 + 1) + ') a');
                dropdownElement.hoverMinuteElement.css('background-color', '#f1f5fa');

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

                dropdownElement.hoverMinuteElement = minuteDropdown.find('li:nth-child(' + (+minute / 15 + 1) + ') a');
                dropdownElement.hoverMinuteElement.css('background-color', '#f1f5fa');

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
