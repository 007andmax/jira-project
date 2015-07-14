'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('hardResetPattern', function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {

        var pattern = scope.$eval(attr.hardResetPattern),
          value = ctrl.$viewValue || '';

        element.on('input', function (e) {

          var newValue = element.val();

          console.log(scope);
          console.log(element);
          console.log(ctrl);

          if (newValue.length === 1) {
            value = '';
          } else {
            //if((newValue.length + ' ' + value.length) === 1) {
            value = newValue.substring(0, newValue.length - 1);
            //} else {
            //  value = newValue.substring(0, value.length);
            //}
          }

          //scope.$watch(function () {
          //  return ctrl.$viewValue;
          //}, function(){
          //  if (newValue && !newValue.match(pattern)) {
          //    console.log("valid no")
          //    ctrl.$setViewValue(value);
          //    element.val(value);
          //  } else {
          //    value = newValue;
          //  }
          //});

          //var validPatteen;
          //
          //for(var i = 0; i < newValue.length; i++) {
          //  if (!newValue[i].match(pattern)) {
          //    console.log('true');
          //    validPatteen = true;
          //    return
          //  }
          //  console.log('false')
          //  validPatteen = false;
          //}

          if (newValue && !newValue.match(pattern)) {
            ctrl.$setViewValue(value);
            element.val(value);
          } else {
            value = newValue;
          }
        });
      }
    };
  })
})();
