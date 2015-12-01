'use strict';

(function () {

  angular.module("quicktech.core.vendors").directive("vendorCard",
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {

          var vendorTotalProducts = element.find('[ vendor-total-products ]'),
            nameRating = element.find('.name-rating'),
            vendorContacts = element.find('.vendor-contacts'),
            archiveVendorBtn = element.find('[archive-vendor-button]'),
            vendorCoverArea = element.find('.vendor-cover-area'),
            productNameOnProductList = element.find('.product-name-txt'),
            closeBtn = element.find('.close-btn'),
            vendorMoreWrapper = element.find('.vendor-more-wrapper'),
            vendorMoreBtn = element.find('.vendor-more-btn'),
            companyAssociationList = element.find('[company-association-list]'),
            companyLocationCollapse = element.find('[company-location-collapse]');

          function vendorProductList() {
            return element.find('.vendor-product-list')
          }

          vendorTotalProducts.click(function () {

            vendorContacts.fadeOut(300);
            nameRating.fadeOut(300);
            archiveVendorBtn.fadeOut(300);
            vendorCoverArea.delay(600).animate({height: "72px"}, 300);
            productNameOnProductList.delay(900).fadeIn(300);
            vendorProductList().delay(900).fadeIn(300);
            closeBtn.fadeIn(300);
            vendorCoverArea.css({'padding': '24px 30px'});

          });

          closeBtn.click(function(){

            productNameOnProductList.fadeOut(300);
            vendorProductList().fadeOut(300);
            vendorMoreWrapper.fadeOut(300);
            vendorCoverArea.delay(600).animate({height: "163px", padding: '30px'}, 300);
            companyAssociationList.delay(900).animate({top: '-71px'}, 300);
            vendorContacts.delay(900).fadeIn(300);
            nameRating.delay(900).fadeIn(300);
            archiveVendorBtn.delay(900).fadeIn(900);
            closeBtn.fadeOut(300);

          });

          vendorMoreBtn.click(function(){

            vendorContacts.fadeOut(300);
            nameRating.fadeOut(300);
            vendorCoverArea.find('.btn').fadeOut(300);
            vendorCoverArea.delay(600).animate({height: "0"}, 300).css({'padding': '0'});
            companyLocationCollapse.delay(900).animate({top: '0'}, 300);
            vendorMoreWrapper.delay(900).fadeIn(300);
            closeBtn.fadeIn(300);

          });

        }
      }
    }]);
})();
