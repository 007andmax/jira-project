'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtDataTimePicker',
    ['$timeout', '$filter','$rootScope',
      function ($timeout, $filter,$rootScope) {
        return {
          restrict: 'A',
          require: 'ngModel',
          scope: {
            minDate: '=',
            maxDate: '=',
            defaultDate: '='
          },
          link: function (scope, element, attrs, ctrl) {
            console.log('scope.type',element.get);
            var isolate = (element[0].getAttribute('isolate')) ? true : false;
          let open = false;
            var options = {
              keepOpen: true,
              format: 'DD MMM YYYY',
              defaultDate: $filter('date')(Date.now(), 'dd MMM yyyy'),
              ignoreReadonly: true,
              sideBySide: true,
              widgetPositioning: {
                horizontal: 'right',
                vertical: 'auto'
              }
            };



            if (scope.minDate) {
              options.minDate = $filter('date')(scope.minDate, 'dd MMM yyyy');
            }

            if (scope.maxDate) {
              options.maxDate = $filter('date')(scope.maxDate, 'dd MMM yyyy');
            }

            if (scope.defaultDate) {
              var defaultDate = new Date(scope.defaultDate);
              if (defaultDate.getTime() < Date.now()) {
                defaultDate = Date.now();
              }
              options.defaultDate = $filter('date')(defaultDate, 'dd MMM yyyy');
            }

            $timeout(function () {
              element.datetimepicker(options);
              ctrl.$setPristine();
            });


            element.bind('dp.show', function (e) {
              console.log('show');
              open = true;
              element.parent().find('.datepicker').removeClass('datepicker');
            });


            element.bind('dp.change', function (e) {
              var formattedDate = $filter('date')(e.date._d, 'dd MMM yyyy');
              if (isolate && open) {
                var type = element[0].getAttribute('isolate-type');
                var id = element[0].getAttribute('id-item');
                console.log('e.date._d',e.date._d);
                if (type == "product") {
                  $rootScope.$broadcast('onChangeProductDate', {date:e.date._d,id: id});
                }
                if (type == "service") {
                  $rootScope.$broadcast('onChangeServiceDate', {date:e.date._d,id: id});
                }
                
              }
              ctrl.$setViewValue(formattedDate);

              element.data('DateTimePicker') && element.data('DateTimePicker').hide();
              open = false;
            });

          }
        }
      }]);
})();
