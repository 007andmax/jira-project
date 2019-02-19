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

          //TimePicker start
          $scope.showTimePicker = false;
          $scope.startDate = null;
          $scope.endDate = null;
          refreshTime();
          $scope.currentDate = new Date();
          $scope.attachment = 'inline';
          $scope.bindHtml = 'true';


          $scope.getMinutes = function () {
            var result = {};
            for (var i = 0; i < 60; i ++) {
              result[i] = i < 10 ? ('0' + i) : i;
            }
            return result;
          };

          $scope.$watch('startDate.hour', function (newValue, oldValue) {
            var now = parseInt(newValue);
            var then = parseInt(oldValue);
            console.log(1,now, then, $scope.startDate);
            if (now > 9 && then < 9 || now < 3 && then > 9) {
              $scope.startDate.time = $scope.startDate.time === "AM" ? "PM" : "AM";
            }
          });

          $scope.$watch('endDate.hour', function (newValue, oldValue) {
            var now = parseInt(newValue);
            var then = parseInt(oldValue);
            console.log(2,now, then, $scope.startDate);
            if (now > 9 && then < 9 || now < 3 && then > 9) {
              $scope.endDate.time = $scope.endDate.time === "AM" ? "PM" : "AM";
            }
          });

          $scope.saveTime = function () {
            $scope.saveStartDate = $scope.startDate;
            $scope.saveEndDate = $scope.endDate;
            $scope.showTimePicker = false;
          };

          $scope.cancelTime = function () {
            refreshTime();
            $scope.showTimePicker = false;
          };


          function refreshTime() {
            $scope.currentDate = new Date();
            $scope.startDate = {
              hour: $scope.currentDate.getHours(),
              minute: $scope.currentDate.getMinutes()
            };
            $scope.endDate = {
              hour: $scope.currentDate.getHours(),
              minute: $scope.currentDate.getMinutes()
            };
            $scope.saveStartDate = $scope.startDate;
            $scope.saveEndDate = $scope.endDate;
          }

          //TimePicker end



          var closeDropdowns = $rootScope.debounce(closeDropdowns, 100)

          // $scope.$watch(function() {
          //   setTimeout(checkForOpenDropdown, 100)
          // });

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

          $scope.$watch(function() {
            setTimeout(function() {
              checkForOpenDropdown()
            }, 0)
          })

          function closeDropdowns() {
            var ticketAddContent = document.querySelector('.ticket-add-content');

            if (ticketAddContent) {
              ticketAddContent.click();
            }

          }

          function checkForOpenDropdown() {
            var date = document.querySelector('.new-date-picker .bootstrap-datetimepicker-widget');
            var dateInput = document.querySelector('.new-date-picker input');

            var serviceInputs = document.querySelectorAll('.new-service-input');

            for (var i = 0; i < serviceInputs.length; i++) {
              var inp = serviceInputs[i];
              var sId = inp.getAttribute('aria-owns');
              var dropdown = document.getElementById(sId);
              var pos = inp.getBoundingClientRect();
              var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

              dropdown.style.position = 'fixed';
              dropdown.style.top = (pos.top) + 'px';
              dropdown.style.left = pos.left + 'px';
              dropdown.style.width = inp.offsetWidth + 'px';

              dropdown.classList.add('new-service-dropdown');

            }

            if (!date) {
              setTimeout(checkForOpenDropdown, 100);
              return;
            }



            if (!dateInput) return;

            dateInput = dateInput.getBoundingClientRect();


            var arr = [date];
            arr.forEach(function(el) {
              if (!el) return;
              var pos = el.getBoundingClientRect();
              var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
              var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              el.style.position = 'fixed';
              el.style.top = dateInput.top  + 40 + 'px';
              el.style.left = (dateInput.right - el.offsetWidth) - scrollLeft +  200 +  'px';
              el.style.right = 'auto';
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
