'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketUpdateTabCtrl',
      ['$scope', 'ServicesService', '$uibModal', 'AgreementsService', '$timeout',
        function ($scope, ServicesService, $uibModal, AgreementsService, $timeout) {
          $scope.serviceList = ServicesService.getAllByCompany($scope, $scope.ticketDetails.company.id);
          $scope.areTicketsPresented = false;
          $scope.areTicketsTerminated = false;
          $scope.areTickets = false;

          AgreementsService.getAllServiceAgreements($scope, function (data) {
            $scope.areTickets = data.length;

            var data = data.filter(function(el) {
              return el.company.id === $scope.ticketDetails.company.id;
            })

            if (!data.length) {
              $scope.areTicketsPresented = false;
            } else {
              $scope.areTicketsPresented = true;

              $scope.areTicketsTerminated = data.every(function(el) {
                return el.status === 'EXPIRED'  || el.status === 'TERMINATED'
              })
            }

          });

          console.log("HEEEEERERERERE")
          if ($scope.editExpense) {
            console.log('TICKET EXPENSEEEEEEEE')
          }

          $scope.$watch('editExpense', function(val) {
            console.log(val, "'TICKET EXPENSEEEEEEEE'")


            $timeout(function() {

              $scope.newEditExpense = angular.copy($scope.editExpense);
              if (val && val.note) {
                $scope.updateNote = $scope.newEditExpense.note;
                $scope.openedTab('NOTE')
              } else {

                $scope.updateNote = $scope.ticketUpdate

                console.log($scope.ticketUpdate.note, "RREEEE")
              }

              if (val && val.product) {
                $scope.openedTab('PRODUCT')
                $scope.productToEdit = $scope.newEditExpense.product;
              } else {
                $scope.productToEdit = null;
              }
            }, 100)

          }, true)

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
            console.log('push', company);
            openModal();

          }
        }]);
  }()
);
