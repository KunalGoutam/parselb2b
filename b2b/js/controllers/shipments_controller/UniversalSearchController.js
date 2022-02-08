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
 
var universalSearchController = myApp.controller('UniversalSearchController', ['$rootScope', '$scope', '$interval', 'CONSTANT', 'ShipmentService', 'APP', 'DriversService', function($rootScope, $scope, $interval, CONSTANT, ShipmentService, APP, DriversService) {

    $scope.csvFile = '';
    $scope.markerIcons = {
        0: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        1: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };
    $scope.markers = [];
    $scope.CONSTANT = CONSTANT;
    $scope.date = {
        "fromDate": new Date(),
        "toDate": new Date(),
        "slotDate": new Date()
    };
    //$scope.isPendingView = true;
    $scope.index = 0;
    $scope.shipmentState = 0;
    $scope.isViewRefresh = false;
    $scope.fromDate = null;
    $scope.userId = 0;
    $scope.selectedHub = {
        "hub": null
    };
    $scope.hubs = [];
    $scope.isUnassignedView = false;
    $scope.destArr = [];
    $scope.pickArr = [];
    $scope.selectedShipmentId = 0;
    $scope.ranges = ["10", "100", "250", "500"];
    $scope.selectedRange = $scope.ranges[0];
    $scope.slots = [];
    $scope.selectedSlot = {
        "slot": {},
        "mainSlot": {}
    };
    $scope.selectedShipments = [];
    $scope.selectedShipment = 0;
    $scope.selectedShipmentToCancel = {};
    $scope.txt = {
        "searchTxt": ""
    };
    $scope.selectedIRShipment = {};
    $scope.selectedItemToDelete = {};

    
    $scope.deleteShipment = function(job) {
        $scope.selectedShipmentToDelete = job;
        $scope.delShipmentId = job.shipmentId;
        $('#delShipmentModal').modal('show');
    };
    
    $scope.deleteMMShipment = function() {
        loaderStart();
        var input = angular.toJson({
            "id": $scope.selectedShipmentToDelete.shipmentId,
            "item": 0
        });
        ShipmentService.deletemmShipment(input, $scope.deleteShipmentSuccessCallBack, $scope.deleteShipmentErrorCallBack);
    };

    $scope.deleteShipmentSuccessCallBack = function(data) {
        loaderStop();
        if (data.responseCode === "1000") {
            $scope.groceries = [];
            $('#delShipmentModal').modal('hide');
            showAlert("Shipment deleted successfully.", "success");
            $scope.viewShipments();
        } else {
            showAlert("Failed to delete shipment.", "error");
        }
    };

    $scope.deleteShipmentErrorCallBack = function() {
        loaderStop();
        showAlert("Internal error. Failed to delete shipment.", "error");
    };
    
    $scope.cancelItem = function(load) {
        $scope.cancelItemSku = load.name;
        $('#cancelItemModal').modal('show');
    };
    
    $scope.cancelMMItem = function() {
        loaderStart();
        var input = angular.toJson({
            "id": $scope.selectedShipmentId,
            "sku": $scope.cancelItemSku,
            "item": 1,
            "all": 1
        });
        ShipmentService.deletemmShipment(input, $scope.cancelItemSC, $scope.cancelItemEC);
    };

    $scope.cancelItemSC = function(data) {
        loaderStop();
        if (data.responseCode === "1000") {
            $('#cancelItemModal').modal('hide');
            showAlert("Item canceled successfully.", "success");
            if ($scope.groceries != null && $scope.groceries.length == 1 
                    && $scope.groceries[0].loads != null && $scope.groceries[0].loads.length == 1) {
                $scope.groceries = [];
                $scope.viewShipments();
            } else {
                $scope.getLoads();
            }
        } else {
            showAlert("Failed to cancel item.", "error");
        }
    };

    $scope.cancelItemEC = function() {
        loaderStop();
        showAlert("Internal error. Failed to cancel item.", "error");
    };
    
    $scope.undoItem = function(load) {
        $scope.undoItemSku = load.name;
        $scope.undoLoadId = load.loadId;
        $('#undoCancelItemModal').modal('show');
    };
    
    $scope.undoCancelMMItem = function() {
        loaderStart();
        var input = angular.toJson({
            "shipmentId": $scope.selectedShipmentId,
            "loadId": $scope.undoLoadId
        });
        ShipmentService.undoCancelItem(input, $scope.undoCancelMMItemSC, $scope.undoCancelMMItemEC);
    };

    $scope.undoCancelMMItemSC = function(data) {
        loaderStop();
        if (data.responseCode === "1000") {
            showAlert("Undone successfully.", "success");
            $('#undoCancelItemModal').modal('hide');
            $scope.getLoads();
        } else {
            showAlert("Failed to undo canceled item.", "error");
        }
    };

    $scope.undoCancelMMItemEC = function() {
        loaderStop();
        showAlert("Internal error. Failed to undo canceled item.", "error");
    };

    $("#driverLocationModal").on("shown.bs.modal", function() {
        google.maps.event.trigger($scope.map, 'resize');
    });

    $('#driverLocationModal').on('hidden.bs.modal', function() {
        $scope.closeShipmentDetails();
    });

    $scope.closeShipmentDetails = function() {
        if (angular.isDefined($scope.timer)) {
            $interval.cancel($scope.timer);
            $scope.timer = undefined;
        }
    };

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker;
    $scope.addMarker = function(latLng, point) {
        marker = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            icon: $scope.markerIcons[point]
        });
        $scope.markers.push(marker);
    };

    $scope.clearMarkers = function() {
        for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(null);
        }
    };

    $scope.trackDriverStatus = function(data) {
        $scope.clearMarkers();
        $scope.isFirstTimeLoc = true;
        $scope.driverId = data.driver.userId;
        $scope.getDriverLocation(data);
    };

    $scope.getDriverLocation = function(data) {
        var latlng = null;
        if ($scope.isFirstTimeLoc && $scope.shipmentState == CONSTANT.ONGOING_SHIPMENTS) {
            loaderStart();
        }
        if ($scope.shipmentState == CONSTANT.ONGOING_SHIPMENTS) {
            var input = angular.toJson({
                "driverId": $scope.driverId
            });
            DriversService.getDriverLocation(input, $scope.getDriverLocationSC, $scope.getDriverLocationEC);
        } else {
            if (data.shipment.wfDetails != null && data.shipment.wfDetails.wfValues != null) {
                var cLocation = data.shipment.wfDetails.wfValues.COMPLETED_LOCATION;
                latlng = new google.maps.LatLng(cLocation.split(",")[0], cLocation.split(",")[1]);
                $('#driverLocationModal').modal('show');
                $scope.addMarker(latlng, data.driver.vehicle.vehicleType);
            }
        }
    };

    $scope.getDriverLocationSC = function(data) {

        if (data.responseCode == "1000") {
            var latlng = new google.maps.LatLng(data.lat, data.lng);
            if ($scope.isFirstTimeLoc) {
                loaderStop();
                var mapOptions = {
                    center: new google.maps.LatLng(data.lat, data.lng),
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
                $scope.addMarker(latlng, data.vehicle.vehicleType);
                $scope.isFirstTimeLoc = false;
                $('#driverLocationModal').modal('show');
                $scope.timer = $interval(function() {
                    $scope.getDriverLocation();
                }, 4000);
            } else {
                $scope.clearMarkers();
                $scope.addMarker(latlng, data.vehicle.vehicleType);
            }
            $scope.markers.push(marker);
            $scope.map.panTo(marker.position);
        }
    };

    $scope.getDriverLocationEC = function() {
        //loaderStop();        
    };

    $scope.cancelTimer = function() {
        if (angular.isDefined($scope.shipmentTimer)) {
            $interval.cancel($scope.shipmentTimer);
            $scope.shipmentTimer = undefined;
        }
    };

    $scope.setETA = function(shipment) {

        if (shipment.wfDetails == null) {
            shipment.wfDetails.eta = "Not Applicable";
        } else if (shipment.wfDetails != null && (shipment.wfDetails.eta == null || shipment.wfDetails.eta == "")) {
            shipment.wfDetails.eta = "Not Applicable";
        }
    };

    $scope.unassignShipment = function(shipmentId) {
        loaderStart();
        var shipId = [];
        shipId.push(shipmentId);
        var input = angular.toJson({
            "shipmentIds": shipId
        });
        ShipmentService.taToUa(input, $scope.unassignShipmentSC, $scope.unassignShipmentEC);
    };

    $scope.unassignShipmentSC = function(data) {
        loaderStop();
        if (data.responseCode == "1000") {
            $scope.viewShipments();
            showAlert("Shipment unassigned successfully", "success");
        } else {
            showAlert("Failed to unassign shipment", "error");
        }
    };

    $scope.unassignShipmentEC = function() {
        loaderStop();
        showAlert("Internal error. Failed to unassign shipment.", "error");
    };

    $scope.unassignShipmentPU = function(job) {
        $('#unassignShipmentModal').modal('show');
        $scope.unassignShipId = job.shipment.shipmentId;
        $scope.unAssignDriver = job.driver.firstName + " " + job.driver.lastName;
    };
    
    $scope.unassignShipmentPendingToUA = function() {
        
        loaderStart();
        var shipId = [];
        shipId.push($scope.unassignShipId);
        var input = angular.toJson({
            "shipmentIds": shipId
        });
        ShipmentService.unassignShipment(input, $scope.unassignShipmentPUSC, $scope.unassignShipmentPUEC);
    };

    $scope.unassignShipmentPUSC = function(data) {
        loaderStop();
        if (data.responseCode == "1000") {
            $scope.viewShipments();
            $('#unassignShipmentModal').modal('hide');
            showAlert("Shipment unassigned successfully", "success");
        } else {
            showAlert("Failed to unassign shipment", "error");
        }
    };

    $scope.unassignShipmentPUEC = function() {
        loaderStop();
        showAlert("Internal error. Failed to unassign shipment.", "error");
    };

    $scope.viewSignature = function(job) {
        var link = document.createElement("a");
        var shipmentId = job.shipment.shipmentId;
        var carrierId = job.shipment.carrier.userId;
        if (link.download !== undefined) {
            var url = $rootScope.baseUrl + '/adm/dl/' + carrierId + '/' + shipmentId + '/sign';
            link.setAttribute("href", url);
            link.setAttribute("download", "signature" + ".png");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    $scope.setShipId = function(job) {
        $scope.selectedShipmentId = job.shipment.shipmentId;
        $scope.getLoads();
    };

    $scope.getLoads = function() {

        $("html, body").animate({
            scrollTop: $(document).height()
        }, 1000);
        $scope.groceries = [];
        loaderStart();
        var input = angular.toJson({
            "shipmentId": $scope.selectedShipmentId
        });
        console.log(input);
        ShipmentService.getLoads(input, $scope.getLoadsSC, $scope.getLoadsEC);
    };

    $scope.getLoadsSC = function(data) {
        loaderStop();
        console.log(data);
        $scope.recipientName = "";
        $scope.recipientPhone = "";
        $scope.dropAddress = "";
        $scope.groceries = [];
        if (data.responseCode == "1000") {
            if (data.load != null) {
                $scope.recipientName = data.load.name;
                $scope.recipientPhone = data.load.phone;
                $scope.dropAddress = data.load.address;

                if (data.load.groceries != null && data.load.groceries.length > 0) {
                    $scope.groceries = data.load.groceries;
                } else {
                    showAlert("No Items found", "information");
                }
            } else {
                showAlert("No Items found", "information");
            }
        } else {
            showAlert("Failed to get load details", "error");
            console.log(data);
        }
    };

    $scope.getLoadsEC = function() {
        loaderStop();
        showAlert("Internal error. Failed to get load details.", "error");
    };
    
    $scope.openSlotModal = function(shipment) {
        if ($scope.slots.length == 0) {
            showAlert("Slots not configured for this user", "information");
            return;
        }
        $scope.selectedShipments = [];
        $scope.selectedShipment = shipment.shipmentId;
        $scope.selectedShipments.push($scope.selectedShipment);
        $scope.selectedSlot.slot = shipment.slot;
        $('#slotModal').modal('show');
    };

    $scope.getSlots = function() {
        loaderStart();
        var input = angular.toJson({
            "carrierId": $rootScope.userId
        });
        console.log(input);
        ShipmentService.getSlotsByClient(input, $scope.getSlotsSC, $scope.getSlotsEC);
    };

    $scope.getSlotsSC = function(data) {
        console.log(data);
        loaderStop();
        $scope.slots = [];
        if (data.responseCode == "1000") {
            $scope.slots = data.slots;
            if ($scope.slots != null && $scope.slots.length > 0) {
                $scope.selectedSlot.slot = $scope.slots[0];
                $scope.selectedSlot.mainSlot = $scope.slots[0];
                $scope.isUnassignedView = true;
            } else {
                showAlert("Slots not configured for this user", "info");
            }
            $('#slotModal').modal('hide');
        } else {
            showAlert("Failed to get slots", "error");
        }
    };

    $scope.getSlotsEC = function() {
        showAlert("Internal Error. Failed to get slots", "error");
    };

    $scope.applySlot = function() {

        loaderStart();
        var input = angular.toJson({
            "slot": $scope.selectedSlot.slot,
            "shipmentIds": $scope.selectedShipments,
            "date": formatDate($scope.date.slotDate)
        });
        console.log(input);
        ShipmentService.changeSlot(input, $scope.applySlotSC, $scope.applySlotEC);
    };

    $scope.applySlotSC = function(data) {

        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.selectedShipments = [];
            $scope.viewShipments();
            showAlert("Slot applied successfully", "success");
            $('#slotModal').modal('hide');
        } else {
            if (data.errors[0].code == "TI.0.3.316") {
                showAlert("Cannot change to current slot. Shipments has already started for this slot.", "error");
            } else if (data.errors[0].code == "TI.0.3.315") {
                showAlert("Cannot change to previuos slot", "error");
            } else if (data.errors[0].code == "TI.0.3.319") {
                showAlert("Cannot change slot to previuos day", "error");
            } else {
                showAlert("Failed to apply slot", "error");
            }
        }
    };

    $scope.applySlotEC = function() {
        loaderStop();
        showAlert("Internal Error. Failed to apply slot", "error");
    };
    
    $scope.searchShipments = function() {
        if ( $scope.txt.searchTxt.length == 0) {
            return;
        }
        loaderStart();
        var input = angular.toJson({"filterParm": $scope.txt.searchTxt, "type":1});
        ShipmentService.filterShipment(input, $scope.searchShipmentsSC, $scope.searchShipmentsEC);
    };
    
    $scope.searchShipmentsSC = function(data) {
        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.shipments = [];
            $scope.shipments = data.jobs;
            if ($scope.shipments != null && $scope.shipments.length > 0) {
                for (var i = 0; i < $scope.shipments.length; i++) {
                    $scope.setETA($scope.shipments[i].shipment);
                }
                for (var j = 0; j < $scope.shipments.length; j++) {
                    $scope.shipments[j].tCod = 0;
                    $scope.shipments[j].tCodCollected = 0;
                    if ($scope.shipments[j].shipment.history != null && $scope.shipments[j].shipment.history.length > 0) {
                        for (var k = 0; k < $scope.shipments[j].shipment.history.length; k++) {
                            $scope.shipments[j].tCod += $scope.shipments[j].shipment.history[k].cod;
                            $scope.shipments[j].tCodCollected += $scope.shipments[j].shipment.history[k].codCollected;
                        }
                    }
                }
            } else {
                showAlert("No shipment found", "information");
            }
        } else {
            showAlert("Failed to search shipments", "error");
        }
    };
    
    $scope.searchShipmentsEC = function() {
        loaderStop();
        showAlert("Internal Error. Failed to search shipments", "error");
    };
    
    $scope.continueIR = function(shipment) {
        $scope.selectedIRShipment = shipment;
        $scope.isValid = false;
        if (shipment.history != null) {
            for (var i = 0; i < shipment.history.length; i++) {
                if (shipment.history[i].pickupQuantity > 0) {
                    $scope.isValid = true;
                }
            }
        }
        if (!$scope.isValid) {
            showAlert("No items has been picked up for this shipment. Cannot be moved to on going status", "information");
        } else {
            $("#continueShipModal").modal("show");
            //$scope.continueIRConfirm(shipment);
        }
    };
    
    $scope.continueIRConfirm = function() {
        loaderStart();
        var input = angular.toJson({"shipmentId": $scope.selectedIRShipment.shipmentId});
        ShipmentService.continueIR(input, $scope.continueIRSC, $scope.continueIREC);
    };
    
    $scope.continueIRSC = function(data) {
        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.viewShipments();
            $("#continueShipModal").modal("hide");
            showAlert("IR shipment moved to on going status", "success");
        } else {
            showAlert("Failed to continue IR shipment", "error");
        }
    };
    
    $scope.continueIREC = function() {
        loaderStop();
        showAlert("Internal Error. Failed to continue IR shipment", "error");
    };
     
    angular.element(document).ready(function() {
        $.Template.layout.activate();
    });

    $scope.getSHubs();
}]);