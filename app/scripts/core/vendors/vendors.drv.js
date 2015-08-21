'use strict';

(function () {

  angular.module("quicktech.core.vendors").directive("vendorDrv",
    ['$state', '$modal',
      function ($state, $modal) {
        return {
          restrict: 'A',
          link: function ($scope, element, attrs, ctrl) {

            var userChange = element.find('[user-avatar]'),
              vendorProduct = element.find('[vendor-product]'),
              vendorClose = element.find('[vendor-close]'),
              vendorMore = element.find('[vendor-more]');

            userChange.click(function () {
              var selector = $(this).parent().parent().parent();

              if ($(this).parent().parent().hasClass("nactive")) {

                selector.children(".active").fadeOut(0);

                selector.children(".user.nactive").addClass("un");
                var right = 22;


                $(this).parent().parent().animate({right: right}, {
                  duration: 100,
                  complete: function () {

                    setTimeout(function () {
                      //selector.hide();
                      selector.children(".user.nactive").removeClass("nactive");
                      selector.children(".user.active").addClass("nactive");
                      selector.children(".user.active.nactive").removeClass("active");
                      selector.children(".user.nactive").show();
                      selector.children(".user.nactive").children(".user-finfo").css("display", "");
                      selector.children(".user.nactive").children(".clearfix").children(".user-inf.user-finfo").css("display", "");
                      selector.children(".user.un").addClass("active");
                      selector.children(".user.un").css("right", "");
                      selector.children(".user.un").children(".user-finfo").fadeIn("slow");
                      selector.children(".user.un").children(".clearfix").children(".user-inf.user-finfo").fadeIn("slow");
                      selector.children(".user.un").removeClass("un");
                    }, 300);

                  }
                });

              }
              return false;

            });


            vendorProduct.click(function () {
              var selector = $(this).parent().parent().parent().parent().parent().parent();

              selector.find(".thide").fadeOut(300, function () {
                selector.addClass("product");
                selector.find(".product-wrapper").fadeIn(300);
                selector.find(".close").fadeIn(100);
              });
              return false;
            });

            vendorClose.click(function () {

              if ($(this).parent().hasClass("product")) {
                $(this).parent().find(".product-wrapper").fadeOut(300, function () {
                  $(this).parent().parent().removeClass("product");
                  $(this).parent().find(".thide").fadeIn(600);
                  $(this).parent().parent().find(".close").fadeOut(100);
                  $(this).parent().parent().find(".close").removeClass("product");

                });

              } else {

                $(this).parent().find(".company-profile-wrapper").fadeOut(300, function () {
                  $(this).parent().parent().removeClass("company-profile loc");
                  $(this).parent().parent().find(".company-wrapper").fadeIn(300);
                  $(this).parent().parent().find(".close").fadeOut(100);
                  $(this).parent().find(".thide").fadeIn(600);
                  $(this).parent().find(".product").fadeIn(600);

                });
              }
              return false;
            });


            vendorMore.click(function () {

              var selector = $(this).parent().parent().parent().parent();


              selector.find(".product.pull-left").fadeOut(300);
              selector.find(".thide").fadeOut(300, function () {

                var slecter = $(this);

                $(this).parent().parent().parent().addClass("company-profile loc");

                setTimeout(function () {

                  slecter.parent().parent().parent().find(".company-profile-wrapper").fadeIn(300, function () {
                  });
                  selector.find(".close").fadeIn(100);

                }, 300);

              });
              return false;

            });

          }
        }
      }]);
})();
