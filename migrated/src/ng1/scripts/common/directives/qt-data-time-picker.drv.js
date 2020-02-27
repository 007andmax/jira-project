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
            defaultDate: '=',
            period: '='
          },
          link: function (scope, element, attrs, ctrl) {
           console.log("scope",scope);
            var isolate = (element[0].getAttribute('isolate')) ? true : false;
            var mobile = (element[0].getAttribute('mobile')) ? true : false;
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


            console.log("scope.minDate",scope.minDate);
            if (scope.minDate) {
              options.minDate = $filter('date')(getMinStartDate(scope.period,scope.minDate ), 'dd MMM yyyy');
              console.log("getMinStartDate",getMinStartDate(scope.period,scope.minDate ));

            } else {
              console.log("getMinStartDate",getMinStartDate(scope.period,scope.minDate ));
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
console.log("options",options);
            $timeout(function () {
              element.datetimepicker(options);
              ctrl.$setPristine();
            });


            element.bind('dp.show', function (e) {
            
              if (mobile)   element.parents().find('.dropdown-menu').addClass('mobile-datepicker');
              open = true;
              element.parent().find('.datepicker').removeClass('datepicker');
            });


            element.bind('dp.change', function (e) {
              console.log("e.date._d",e);
              var formattedDate = $filter('date')(e.date._d, 'dd MMM yyyy');
              
              if (isolate && open) {
                var type = element[0].getAttribute('isolate-type');
                var id = element[0].getAttribute('id-item');
              
                if (type == "product") {
                  $rootScope.$broadcast('onChangeProductDate', {date:e.date._d,id: id});
                }
                if (type == "service") {
                  $rootScope.$broadcast('onChangeServiceDate', {date:e.date._d,id: id});
                }
                
              }
            //  if (open)  $rootScope.$broadcast('resetBlockUpdateAndClosed', null);
              ctrl.$setViewValue(formattedDate);

              element.data('DateTimePicker') && element.data('DateTimePicker').hide();
              if (element.data('DateTimePicker') && mobile)  element.parents().find('.dropdown-menu').removeClass('mobile-datepicker');
              open = false;
            });

            function getMinStartDate(interval,startDate) {
              var newMinStartDate;
              var now = new Date(startDate);
              var n = new Date(now);
              console.log("interval",interval);
              var day = 1000 * 60 * 60 * 24;
              if (interval === 'Month') {
                
                n.setMonth(n.getMonth() - 1);
                newMinStartDate = n.getTime() + day;
    
              } else if (interval === 'Year') {
               
                n.setFullYear(n.getFullYear() - 1);
                newMinStartDate = n.getTime() + day;
    
              } else if (interval === 30) {
                
                newMinStartDate = now - (29*day);
    
              } else if (interval === 15) {
               
                newMinStartDate = now - (14*day);
    
              } else if (interval === 7) {
                 
                newMinStartDate = now - (6*day);
    
              } else if(interval === 1) {
              
              }

              return newMinStartDate;
            
            }

          }
        }
      }]);
})();
