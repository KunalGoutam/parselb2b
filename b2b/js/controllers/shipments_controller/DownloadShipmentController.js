/*******************************************************
 * Copyright (C) 2015-2018 {Dropbase Software Pvt. Ltd.} 
 * 
 * This file is part of PARSEL.
 * 
 * PARSEL cannot be copied and/or distributed without the express
 * permission of {Dropbase Software Pvt. Ltd}
 *
 * Proprietary and confidential

 *******************************************************/
 
var downloadShipmentController = myApp.controller('DownloadShipmentController', ['$scope', 'ShipmentService', 'CONSTANT', '$rootScope',
    function($scope, ShipmentService, CONSTANT, $rootScope) {

        $scope.selectedShipments = [];
        $scope.shipmentCount = 0;
        $scope.slots = [];
        $scope.selectedSlot = {
            "slot": {}
        };
        $scope.date = {
            "fromDate": new Date()
        };
        
        $scope.getSlots = function() {
            loaderStart();
            var input = angular.toJson({"carrierId": $rootScope.userId});
            console.log(input);
            ShipmentService.getSlotsByClient(input, $scope.getSlotsSC, $scope.getSlotsEC);
        };
        
        $scope.getSlotsSC = function(data) {
            loaderStop();
            console.log(data);
            $scope.slots = [];
            if (data.responseCode == "1000") {
                $scope.slots = data.slots;
                if ($scope.slots != null && $scope.slots.length > 0) {
                    $scope.selectedSlot.slot = $scope.slots[0];
                    showAlert("Slots retrieved successfully", "success");
                } else {
                    showAlert("No slots found for this user", "information");
                }
                
            } else {
                showAlert("Failed to get slots", "error");
            }
        };
        
        $scope.getSlotsEC = function() {
            loaderStop();
            showAlert("Internal Error. Failed to get slots", "error");
        };
        
        $scope.downloadShipments = function() {
            
            var link = document.createElement("a");
            var fromDate = formatDate($scope.date.fromDate);
            console.log('https://infibeam.parsel.in/pbb' + '/adm/slotreport/' + fromDate + '/' + $scope.selectedSlot.slot.startTime + '/' + $scope.selectedSlot.slot.stopTime);
            window.open('https://infibeam.parsel.in/pbb' + '/adm/slotreport/' + fromDate + '/' + $scope.selectedSlot.slot.startTime + '/' + $scope.selectedSlot.slot.stopTime);
        };
        
        $scope.getSlots();
    }
]);