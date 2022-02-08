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

var assignShipmentSlotController = myApp.controller('AssignShipmentSlotController', ['$scope', 'ShipmentService', 'CONSTANT', '$rootScope',
    function($scope, ShipmentService, CONSTANT, $rootScope) {

        $scope.selectedShipments = [];
        $scope.shipmentCount = 0;
        $scope.slots = [];
        $scope.selectedSlot = {
            "slot": {}
        };
        $scope.date = {
            "slotDate": new Date()
        };
        $scope.access = {
            "pwd": ""
        };

        /**
         * This method retrives the unassigned shipments done based on selected date.
         * 
         */
        $scope.getUnassignedShipments = function() {

            NProgress.start();
            $scope.userId = $rootScope.userId;
            var input = angular.toJson({

                "fromDate": formatDate($scope.date.slotDate),
                "toDate": null,
                "type": CONSTANT.UNASSIGNED_SHIPMENTS,
                "locality": null,
                "index": -1,
                "count": -1,
                "carrierId": $scope.userId
            });
            ShipmentService.filterHubShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
        };

        $scope.retrieveShipmentsSuccessCallBack = function(data) {

            NProgress.done();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.jobs = [];
                $scope.jobs = data.jobs;
                showAlert(CONSTANT.SUCCESS, "Shipments retrieved successfully");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to retrieve shipments");
            }
        };

        $scope.retrieveShipmentsErrorBack = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal error. Failed to retrieve shipments.");
        };

        /**
         * This method retrives the slots for the logged in user.
         * 
         */
        $scope.getSlots = function() {
            NProgress.start();
            var input = angular.toJson({ "carrierId": $rootScope.userId });
            console.log(input);
            ShipmentService.getSlotsByClient(input, $scope.getSlotsSC, $scope.getSlotsEC);
        };

        $scope.getSlotsSC = function(data) {
            NProgress.done();
            console.log(data);
            $scope.slots = [];
            if (data.responseCode == "1000") {
                $scope.slots = data.slots;
                if ($scope.slots != null && $scope.slots.length > 0) {
                    $scope.selectedSlot.slot = $scope.slots[0];
                    $scope.getUnassignedShipments();
                    showAlert(CONSTANT.SUCCESS, "Slots retrieved successfully");
                } else {
                    showAlert(CONSTANT.INFO, "No slots found for this user");
                }

            } else {
                showAlert(CONSTANT.ERROR, "Failed to get slots");
            }
        };

        $scope.getSlotsEC = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal Error. Failed to get slots");
        };

        $scope.openChangeSlotModal = function() {
            $('#changeSlotModal').modal('show');
        };

        /**
         * This method changes the slot for slected shipment.
         * 
         */
        $scope.applySlot = function() {

            if ($scope.access.pwd.length == 0) {
                showAlert(CONSTANT.ERROR, "Please enter access code");
                return;
            }
            NProgress.start();
            var input = angular.toJson({
                "slot": $scope.selectedSlot.slot,
                "shipmentIds": $scope.selectedShipments,
                "date": formatDate($scope.date.slotDate),
                "key": $scope.access.pwd
            });
            console.log(input);
            ShipmentService.changeSlot(input, $scope.applySlotSC, $scope.applySlotEC);
        };

        $scope.applySlotSC = function(data) {

            NProgress.done();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.selectedShipments = [];
                $scope.getUnassignedShipments();
                $('#changeSlotModal').modal('hide');
                showAlert(CONSTANT.SUCCESS, "Slot changed successfully");
            } else {
                if (data.errors[0].code == "TI.0.3.310") {
                    showAlert(CONSTANT.ERROR, "Cannot change to previuos slot");
                } else if (data.errors[0].code == "TI.0.3.311") {
                    showAlert(CONSTANT.ERROR, "Cannot change to current slot. Shipments has already started for this slot.");
                } else if (data.errors[0].code == "TI.0.3.440") {
                    showAlert(CONSTANT.ERROR, "Invalid access code");
                } else {
                    showAlert(CONSTANT.ERROR, "Failed to apply slot");
                }
            }
        };

        $scope.applySlotEC = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal Error. Failed to apply slot");
        };

        $scope.toggleSelection = function(shipmentId) {     
            var idx = $scope.selectedShipments.indexOf(shipmentId);     
            if (idx > -1) {       
                $scope.selectedShipments.splice(idx, 1);     
            } else {       
                $scope.selectedShipments.push(shipmentId);     
            }   
        };

        $('#changeSlotModal').on('hidden.bs.modal', function() {
            $scope.access = {
                "pwd": ""
            };
        });

        $scope.getSlots();


    }
]);