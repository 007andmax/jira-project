'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketUpdateTabCtrl',
      ['$scope', 'ServicesService', '$uibModal', 'AgreementsService', '$timeout', '$filter', '$rootScope',
        function ($scope, ServicesService, $uibModal, AgreementsService, $timeout, $filter, $rootScope) {
          $scope.serviceList = ServicesService.getAllByCompany($scope, $scope.ticketDetails.company.id)
          $scope.areTicketsPresented = false;
          $scope.areTicketsTerminated = false;
          $scope.areTickets = false;
          $scope.checkForOpenDropdown = checkForOpenDropdown;

          var closeDropdowns = $rootScope.debounce(closeDropdowns, 200)

          $scope.$watch(function() {
            setTimeout(checkForOpenDropdown, 100)
          });

          window.addEventListener('scroll', closeDropdowns)

          $scope.$watch('currentOpenTab', function() {
            setTimeout(function() {
              var scrollable = document.querySelector('[scrollable]');

              if (!scrollable) return;
              scrollable.addEventListener('scroll', closeDropdowns)
            }, 1000)

          })

          $scope.$on('$destroy', function() {
            window.removeEventListener('scroll', closeDropdowns)
          })

          function closeDropdowns() {
            var ticketAddContent = document.querySelector('.ticket-add-content');

            if (ticketAddContent) {
              ticketAddContent.click();
            }

          }

          function checkForOpenDropdown() {
            var quantity = document.querySelector('.new-quantity-picker #service-quantity-dropdown');
            var date = document.querySelector('.new-date-picker .bootstrap-datetimepicker-widget');

            console.log(date, 'date')
            var products = document.querySelectorAll('.custom-product-list');
            var services = document.querySelectorAll('[ng-show="isOpen() && !moveInProgress"]');

            var arr = [date];
            arr.forEach(function(el) {
              if (!el) return;
              var pos = el.getBoundingClientRect();
              var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
              var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              el.style.removeProperty('top');
              el.style.removeProperty('left');
              el.style.removeProperty('bottom');
              el.style.position = 'fixed';
              el.style.top = pos.top + scrollTop;
              el.style.left = pos.left + scrollLeft;
              el.style.zIndex = 100000;
            })

          }


          AgreementsService.getAllServiceAgreements($scope, function (data) {
            $scope.areTickets = data.length;

            var data = data.filter(function(el) {
              return el.company.id === $scope.ticketDetails.company.id;
            })

            if (!data.length) {
              $scope.areTicketsPresented = false;

              $scope.serviceList = $scope.serviceList.filter(function(el) {
                return el.canUseInTicket;
              });
            } else {
              $scope.areTicketsPresented = true;

              $scope.areTicketsTerminated = data.every(function(el) {
                return el.status === 'EXPIRED'  || el.status === 'TERMINATED'
              })
            }

          });


          $scope.$watch('ticketUpdate', function(val) {
            if (!$scope.editExpense) {
              $scope.updateNote = $scope.ticketUpdate;
            }
          })

          if (window.innerWidth <= 414) {
            $scope.$watch('editExpense', function(val) {


              $timeout(function() {

                $scope.newEditExpense = angular.copy($scope.editExpense);
                if (val && val.note) {
                  $scope.updateNote = $scope.newEditExpense.note;
                  $scope.openedTab('NOTE')
                } else {

                  if ($scope.ticketUpdate) {
                    $scope.ticketUpdate.note = '';
                  }

                  $scope.updateNote = $scope.ticketUpdate

                }

                if (val && val.product) {
                  $scope.openedTab('PRODUCT')
                  $scope.productToEdit = $scope.newEditExpense.product;
                } else {
                  $scope.productToEdit = null;
                }

                if (val && val.service) {
                  $scope.openedTab('SERVICE');
                  $scope.serviceToEdit = [$scope.newEditExpense.service];
                } else {
                  $scope.serviceToEdit = $scope.ticketUpdate.services;
                }

                if ($scope.serviceToEdit && ($scope.serviceToEdit[0].quantity || $scope.serviceToEdit[0].quantity == 0)) {

                  if ($scope.serviceToEdit[0].quantity / 60 >= 0.25) {

                  } else {
                    $scope.serviceToEdit[0].quantity = +(($scope.serviceToEdit[0].quantity || 0) * 60).toFixed(0);


                    $scope.serviceToEdit[0].quantity = +(($scope.serviceToEdit[0].quantity || 0) / 60 );
                    $scope.serviceToEdit[0].quantity = +(($scope.serviceToEdit[0].quantity || 0) * 60).toFixed(0);
                  }
                }

                if ($scope.serviceToEdit[0].date) {
                  $scope.serviceToEdit[0].date = $filter('date')($scope.serviceToEdit[0].date, 'dd MMM yyyy');

                }

                toggleDataSelector()


              }, 100)

            }, true);

            $scope.$watch(function() {
              return $scope.ticketUpdate && $scope.ticketUpdate.services
            }, function(val) {
              // console.log(val, 'TICEKTUPDATE SERVICE!!!!!!!!!!')
              if (val) {
                if ($scope.newEditExpense && $scope.newEditExpense.service) {
                  $scope.openedTab('SERVICE');
                  $scope.serviceToEdit = [$scope.newEditExpense.service];
                } else {

                  $scope.serviceToEdit = $scope.ticketUpdate.services;
                  // console.log($scope.serviceToEdit, 'TICKKKKKKKKK')

                }

                if ($scope.serviceToEdit && ($scope.serviceToEdit[0].quantity || $scope.serviceToEdit[0].quantity == 0)) {
                  if ($scope.serviceToEdit[0].quantity / 60 >= 0.25) {

                  } else {
                    $scope.serviceToEdit[0].quantity = +(($scope.serviceToEdit[0].quantity || 0) * 60).toFixed(0);


                    $scope.serviceToEdit[0].quantity = +(($scope.serviceToEdit[0].quantity || 0) / 60 );
                    $scope.serviceToEdit[0].quantity = +(($scope.serviceToEdit[0].quantity || 0) * 60).toFixed(0);
                  }



                }

                if ($scope.serviceToEdit[0].date) {
                  $scope.serviceToEdit[0].date = $filter('date')($scope.serviceToEdit[0].date, 'dd MMM yyyy');
                }

                toggleDataSelector()



              }
            })
          }


          function openModal(company) {
            $uibModal.open({
              templateUrl: '/html/scripts/core/service-agreements/modal/create-new-modal.tpl.html',
              animation: true,
              backdrop: false,
              size: 'md',
              controller: 'serviceAgreementsModalCtrl',
              windowClass: 'create-popup margin-top-modal-dialog',
              resolve: {
                companyData: {
                  companyDataFromTicketPage: company,
                  editMode: true
                }
              }
            });
          }

          $scope.openContractAgreementsModal = function(company) {
            openModal();

          }
        }]);
  }()
);
