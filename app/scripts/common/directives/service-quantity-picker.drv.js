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

          if (scope.quantity) {
            setStartingValue(scope.quantity)
          }

          element.addClass('timer-quantity');

          $templateRequest('/html/scripts/common/templates/service-quantity-picker.tpl.html').then(function (html) {

            quantityDropdown = angular.element(html);
            element.append(quantityDropdown);
            $compile(quantityDropdown)(scope);

            var minuteDropdown = element.find('[min_drop_down]'),
              formatDropdown = element.find('[format_drop_down]');

            if (isFormatShow) {

              formatDropdown.show();

              quantityDropdown.find('[format_drop_down]').bind('mousemove', function (event) {

                processingColumn('Format', event.target);

              });
            }

            quantityDropdown.find('[hour_drop_down]').bind('mousemove', function (event) {

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

            quantityDropdown.find('[min_drop_down]').bind('mousemove', function (event) {

              processingColumn('Minute', event.target);

              if (isFormatShow && +dropdownElement.hoverMinute < 45) {
                var top = minuteDropdown.position().top;
                formatDropdown.css('top', (top + (+dropdownElement.hoverMinute * 2)) + 'px');
              } else if (isFormatShow) {
                var top = minuteDropdown.position().top;
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
              dropdownElement['hover' + element + 'Element'].css('background-color', '#f1f5fa');
            }

            dropdownElement['hover' + element + 'Element'] = $(target);
            dropdownElement['hover' + element] = target.text;

            dropdownElement['hover' + element + 'Element'].css('background-color', '#e7ecf2');

          }

          function setStartingValue(value) {

            if (isFormatShow) {

              var isPmFormat;

              if (value > 525) {
                value = value / 12 / 60;
                isPmFormat = 'PM';
              } else {
                isPmFormat = 'AM';
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
                input.val(hours + ' : ' + minute + ' ' + isPmFormat);
              } else {
                input.val(hours + ' : ' + minute);
              }
            }

          }

        }
      }
    }]);
})();
