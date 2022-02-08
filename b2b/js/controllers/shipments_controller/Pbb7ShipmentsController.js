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

var pbb2ShipmentsController = myApp.controller('ShipmentsController', ['$rootScope', '$scope', '$interval', 'CONSTANT', 'ShipmentService', 'APP', 'DriversService', function($rootScope, $scope, $interval, CONSTANT, ShipmentService, APP, DriversService) {

    $scope.csvFile = '';
    $scope.markerIcons = {
        0: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        1: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        2: 'assets/images/scooter.png',

    };
    $scope.markers = [];
    $scope.line = null;
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
    $scope.cancel = {
        "reason": ""
    };
    $scope.access = {
        "pwd": ""
    };
    $scope.menuItems = ['UNASSIGNED', 'PENDING', 'ONGOING', 'COMPLETED', 'PARTIALLY COMPLETED', 'TURNED AWAY', 'CANCELLED', "EXPIRED"];
    $scope.activeMenu = $scope.menuItems[0];

    $scope.daDetails = {
        "name": "",
        "phone": "",
        "route": "",
        "vechile": ""
    };

    /**
     * This method returns all the pending shipments
     * 
     */
    $scope.viewPendingShipments = function(tableState) {

        $scope.pTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isPendingView = true;
        $scope.isCanceledView = $scope.isIRView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isPCView = $scope.isFCView = $scope.isTrunedAwayView = $scope.isUnassignedView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.PENDING_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the unassigned shipments
     * 
     */
    $scope.viewUnassignedShipments = function(tableState) {

        $scope.uState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isUnassignedView = true;
        $scope.isCanceledView = $scope.isIRView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isPCView = $scope.isFCView = $scope.isTrunedAwayView = $scope.isPendingView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.UNASSIGNED_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the ongoing shipments
     * 
     */
    $scope.viewOngoingShipments = function(tableState) {

        $scope.oTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isOnGoingView = true;
        $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isCompletedView = $scope.isPCView = $scope.isFCView = $scope.isTrunedAwayView = $scope.isUnassignedView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.ONGOING_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the completed shipments
     * 
     */
    $scope.viewCompletedShipments = function(tableState) {

        $scope.cTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isCompletedView = true;
        $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isTrunedAwayView = $scope.isPCView = $scope.isFCView = $scope.isUnassignedView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.COMPLETED_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the turnedaway shipments
     * 
     */
    $scope.viewTurnedAwayShipments = function(tableState) {

        $scope.tTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isTrunedAwayView = true;
        $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isPCView = $scope.isFCView = $scope.isUnassignedView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.TURNEDAWAY_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the IR shipments
     * 
     */
    $scope.viewIRShipments = function(tableState) {

        $scope.iRState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isIRView = true;
        $scope.isCanceledView = $scope.isExpiredView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isPCView = $scope.isFCView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
        $scope.shipmentState = CONSTANT.IR_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the expired shipments
     * 
     */
    $scope.viewExpiredShipments = function(tableState) {

        $scope.eState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isExpiredView = true;
        $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isPCView = $scope.isFCView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
        $scope.shipmentState = CONSTANT.EXPIRED_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the canceled shipments
     * 
     */
    $scope.viewCanceledShipments = function(tableState) {

        $scope.canState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isCanceledView = true;
        $scope.isExpiredView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isPCView = $scope.isFCView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
        $scope.shipmentState = CONSTANT.CANCELED_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the canceled shipments
     * 
     */
    $scope.viewFCShipments = function(tableState) {

        $scope.fcTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isFCView = true;
        $scope.isExpiredView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isPCView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
        $scope.shipmentState = CONSTANT.FC_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns all the canceled shipments
     * 
     */
    $scope.viewPCShipments = function(tableState) {

        $scope.pcTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isPCView = true;
        $scope.isExpiredView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isFCView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
        $scope.shipmentState = CONSTANT.PC_SHIPMENTS;
        $scope.viewShipments();
    };

    /**
     * This method returns the shipments based on selected shipment state
     * (Unassigned/Pending/ongoing/completed/turnedaway/canceled/expired)
     */
    $scope.viewShipments = function() {
        if ($scope.txt.searchTxt.length > 0) {
            return;
        }
        var fromDate = formatDate($("#datePicker").data("DateTimePicker").date());
        $scope.userId = $rootScope.userId;
        if ($scope.selectedHub.hub != null) {
            $scope.userId = $scope.selectedHub.hub.userId;
        }
        var input = angular.toJson({

            "fromDate": fromDate,
            "toDate": null,
            "type": $scope.shipmentState,
            "locality": null,
            "index": $scope.index,
            "count": 15,
            "carrierId": $scope.userId,
            "slot": $scope.selectedSlot.mainSlot
        });
        NProgress.start();
        $scope.isViewRefresh = false;
        console.log(input);
        var slotData =   {
            "slotId" : 28,
            "startTime": "06:00:00",
            "stopTime": "22:00:00",
            "duration": 900,
            "code": "06_00_22_00",
            "cutoffTime": null,
            "cutoffDuration": 0
        };
        if( $rootScope.userType == 9 || $rootScope.userType == 10){
            var input = angular.toJson({

                "fromDate": fromDate,
                "toDate": null,
                "type": $scope.shipmentState,
                "locality": null,
                "index": $scope.index,
                "count": 15,
                "carrierId": 12639,
                "slot": slotData
            });
        }

        ShipmentService.filterHubShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
    };

    $scope.retrieveShipmentsSuccessCallBack = function(data) {

        console.log(data);
        NProgress.done();
        if ($scope.isViewRefresh && $scope.txt.searchTxt.length > 0) return;
        if (data.responseCode === "1000") {
            $scope.shipments = [];
            $scope.shipments = data.jobs;
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
            //$scope.setSlotCounts(data.jobs);
            $scope.setTotalPages(data.count);
            if ($scope.isViewRefresh) return;
            showAlert(CONSTANT.SUCCESS, "Shipments retrieved successfully");
        } else {
            if ($scope.isViewRefresh) return;
            showAlert(CONSTANT.ERROR, "Failed to retrieve shipments");
        }
    };

    $scope.retrieveShipmentsErrorBack = function() {
        NProgress.done();
        showAlert(CONSTANT.SUCCESS, "Internal error. Failed to retrieve shipments.");
    };

    $scope.setSlotCounts = function(jobs) {

        for (var i = 0; i < $scope.slots.length; i++) {
            $scope.slots[i].count = 0;
            for (var j = 0; j < jobs.length; j++) {
                if ($scope.slots[i].startTime == jobs[j].shipment.slot.startTime && $scope.slots[i].stopTime == jobs[j].shipment.slot.stopTime) {
                    $scope.slots[i].count += 1;
                }
            }
        }
    };

    $scope.tabSelected = function(shipmentState) {
        $scope.shipments = [];
        $scope.filtersChange(shipmentState);
        $scope.filterOptionOnShipments(shipmentState);
    };
    $scope.hideDA = true;
    $scope.filterOptionOnShipments = function(shipmentState){

         if(shipmentState == 6){
           $scope.hideDA = true;
         }else{
            $scope.hideDA = false;
         }
    }

    $scope.filtersChange = function(currentState) {
        $scope.txt = {
            "searchTxt": ""
        };
        $scope.groceries = [];
        $scope.shipmentState = currentState;
        if ($scope.shipmentState === CONSTANT.PENDING_SHIPMENTS) {
            $scope.tab = 2;
            if (typeof $scope.pTState == 'undefined') {
                $scope.isPendingView = true;
            } else {
                $scope.pTState.pagination.start = 0;
                $scope.viewPendingShipments($scope.pTState);
            }
        } else if ($scope.shipmentState === CONSTANT.ONGOING_SHIPMENTS) {
            $scope.tab = 3;
            if (typeof $scope.oTState == 'undefined') {
                $scope.isOnGoingView = true;
            } else {
                $scope.oTState.pagination.start = 0;
                $scope.viewOngoingShipments($scope.oTState);
            }
        } else if ($scope.shipmentState === CONSTANT.COMPLETED_SHIPMENTS) {
            $scope.tab = 4;
            if (typeof $scope.cTState == 'undefined') {
                $scope.isCompletedView = true;
            } else {
                $scope.cTState.pagination.start = 0;
                $scope.viewCompletedShipments($scope.cTState);
            }
        } else if ($scope.shipmentState === CONSTANT.TURNEDAWAY_SHIPMENTS) {
            $scope.tab = 6;
            if (typeof $scope.tTState == 'undefined') {
                $scope.isTrunedAwayView = true;
            } else {
                $scope.tTState.pagination.start = 0;
                $scope.viewTurnedAwayShipments($scope.tTState);
            }
        } else if ($scope.shipmentState === CONSTANT.UNASSIGNED_SHIPMENTS) {
            $scope.tab = 1;
            if (typeof $scope.uState == 'undefined') {
                $scope.isUnassignedView = true;
            } else {
                $scope.uState.pagination.start = 0;
                $scope.viewUnassignedShipments($scope.uState);
            }
        } else if ($scope.shipmentState === CONSTANT.EXPIRED_SHIPMENTS) {
            $scope.tab = 9;
            if (typeof $scope.eState == 'undefined') {
                $scope.isExpiredView = true;
            } else {
                $scope.eState.pagination.start = 0;
                $scope.viewExpiredShipments($scope.eState);
            }
        } else if ($scope.shipmentState === CONSTANT.IR_SHIPMENTS) {
            $scope.tab = 7;
            if (typeof $scope.iRState == 'undefined') {
                $scope.isIRView = true;
            } else {
                $scope.iRState.pagination.start = 0;
                $scope.viewIRShipments($scope.iRState);
            }
        } else if ($scope.shipmentState === CONSTANT.CANCELED_SHIPMENTS) {
            $scope.tab = 8;
            if (typeof $scope.canState == 'undefined') {
                $scope.isCanceledView = true;
            } else {
                $scope.canState.pagination.start = 0;
                $scope.viewCanceledShipments($scope.canState);
            }
        } else if ($scope.shipmentState === CONSTANT.FC_SHIPMENTS) {
            $scope.tab = 4;
            if (typeof $scope.fcTState == 'undefined') {
                $scope.isFCView = true;
            } else {
                $scope.fcTState.pagination.start = 0;
                $scope.viewFCShipments($scope.fcTState);
            }
        } else if ($scope.shipmentState === CONSTANT.PC_SHIPMENTS) {
            $scope.tab = 5;
            if (typeof $scope.pcTState == 'undefined') {
                $scope.isPCView = true;
            } else {
                $scope.pcTState.pagination.start = 0;
                $scope.viewPCShipments($scope.pcTState);
            }
        }
    };

    $scope.setTotalPages = function(count) {
        if ($scope.shipmentState === CONSTANT.PENDING_SHIPMENTS) {
            $scope.pTState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.ONGOING_SHIPMENTS) {
            $scope.oTState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.COMPLETED_SHIPMENTS) {
            $scope.cTState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.FC_SHIPMENTS) {
            $scope.fcTState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.PC_SHIPMENTS) {
            $scope.pcTState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.TURNEDAWAY_SHIPMENTS) {
            $scope.tTState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.UNASSIGNED_SHIPMENTS) {
            $scope.uState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.EXPIRED_SHIPMENTS) {
            $scope.eState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.IR_SHIPMENTS) {
            $scope.iRState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.CANCELED_SHIPMENTS) {
            $scope.canState.pagination.numberOfPages = $scope.getTotalPage(count);
        }
    };

    $scope.deleteShipment = function(job) {
        $scope.selectedShipmentToDelete = job;
        $scope.delShipmentId = job.shipmentId;
        $('#delShipmentModal').modal('show');
    };

    $scope.deleteMMShipment = function() {
        if ($scope.cancel.reason == "") {
            showAlert(CONSTANT.ERROR, "Please select reason for order cancel");
            return;
        };
        NProgress.start();
        var input = angular.toJson({
            "id": $scope.selectedShipmentToDelete.shipmentId,
            "item": 0,
            "remark": $scope.cancel.reason
        });
        console.log(input);
        ShipmentService.deletemmShipment(input, $scope.deleteShipmentSuccessCallBack, $scope.deleteShipmentErrorCallBack);
    };


    

    $scope.deleteShipmentSuccessCallBack = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            $scope.groceries = [];
            $('#delShipmentModal').modal('hide');
            showAlert(CONSTANT.SUCCESS, "Shipment deleted successfully.");
            $scope.cancel = {
                "reason": ""
            };
            $scope.viewShipments();
        } else {
            showAlert(CONSTANT.ERROR, "Failed to delete shipment.");
        }
    };

    $scope.deleteShipmentErrorCallBack = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to delete shipment.");
    };

    $scope.cancelItem = function(load) {
        $scope.cancelItemSku = load.name;
        $('#cancelItemModal').modal('show');
    };

    $scope.cancelMMItem = function() {
        NProgress.start();
        var input = angular.toJson({
            "id": $scope.selectedShipmentId,
            "sku": $scope.cancelItemSku,
            "item": 1,
            "all": 1
        });
        ShipmentService.deletemmShipment(input, $scope.cancelItemSC, $scope.cancelItemEC);
    };

    $scope.cancelItemSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            $('#cancelItemModal').modal('hide');
            showAlert(CONSTANT.SUCCESS, "Item canceled successfully.");
            if ($scope.groceries != null && $scope.groceries.length == 1 &&
                $scope.groceries[0].loads != null && $scope.groceries[0].loads.length == 1) {
                $scope.groceries = [];
                $scope.viewShipments();
            } else {
                $scope.getLoads();
            }
        } else {
            showAlert(CONSTANT.ERROR, "Failed to cancel item.");
        }
    };

    /*$scope.getDistance = function(job) {
        var googleStr = 'https://maps.googleapis.com/maps/api/distancematrix/json?&origins=';
        var fromPlace = autocompleteFrom.getPlace();
        googleStr += fromPlace.geometry.location.lat() + ',' + fromPlace.geometry.location.lng();
        googleStr += "&destinations="
        var toPlace = autocompleteTo.getPlace();
        googleStr += toPlace.geometry.location.lat() + ',' + toPlace.geometry.location.lng();
        googleStr += '&key=AIzaSyBhku__xgYxFzJ8orT_7A0_MKUULAx_ZiA' + '&callback=JSON_CALLBACK';

        $http.jsonp(googleStr).success(function(data) {
            console.log(data);
        }).error(function(data) {
            $scope.error = true;
        });
    }*/

    $scope.cancelItemEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to cancel item.");
    };

    $scope.undoItem = function(load) {
        $scope.undoItemSku = load.name;
        $scope.undoLoadId = load.loadId;
        $('#undoCancelItemModal').modal('show');
    };

    $scope.undoCancelMMItem = function() {
        NProgress.start();
        var input = angular.toJson({
            "shipmentId": $scope.selectedShipmentId,
            "loadId": $scope.undoLoadId
        });
        ShipmentService.undoCancelItem(input, $scope.undoCancelMMItemSC, $scope.undoCancelMMItemEC);
    };

    $scope.undoCancelMMItemSC = function(data) {
        NProgress.done();
        if (data.responseCode === "1000") {
            showAlert("Undone successfully.", "success");
            $('#undoCancelItemModal').modal('hide');
            $scope.getLoads();
        } else {
            showAlert(CONSTANT.ERROR, "Failed to undo canceled item.");
        }
    };

    $scope.undoCancelMMItemEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to undo canceled item.");
    };

    $scope.getCarrierName = function(job) {
        return job.shipment.user.firstName + " " + job.shipment.user.lastName;
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
    $scope.addMarker = function(latLng, point, options) {
        marker = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#00F',
                fillOpacity: 0.6,
                strokeColor: '#00A',
                strokeOpacity: 0.9,
                strokeWeight: 0.5,
                size: 2
            }
        });
        if (options) {
            if (options.ce) {
                marker.addListener("click", function() {
                    options.infowindow.open({
                        anchor: marker,
                        map: $scope.map,
                        shouldFocus: false,
                    });
                })
            }
        }
        $scope.markers.push(marker);
    };

    $scope.addStartMarker = function(latLng, point, title, options) {
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            icon: $scope.markerIcons[point],
            title: title
        });
        if (options) {
            if (options.ce) {
                marker.addListener("click", function() {
                    $scope.closeLastOpenedInfoWindow();
                    options.infowindow.open({
                        anchor: marker,
                        map: $scope.map,
                        shouldFocus: false,
                    });
                    $scope.lastOpenedInfoWindow = options.infowindow;
                });
            }
        }
        $scope.startMarker = marker;
        return marker;
    };

    $scope.closeLastOpenedInfoWindow = function() {
        if ($scope.lastOpenedInfoWindow) {
            $scope.lastOpenedInfoWindow.close();
        }
    };

    $scope.addEndMarker = function(latLng, point, title, options) {
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            icon: $scope.markerIcons[point],
            title: title
        });
        if (options) {
            if (options.ce) {
                //     google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
                //         return function() {
                //             $scope.closeLastOpenedInfoWindow();
                //             infowindow.setContent(content);
                //             infowindow.open(map, marker);
                //             lastOpenedInfoWindow = infowindow;
                //         };
                //     })(marker, makrerdata[i], infowindow));
                // }
                marker.addListener("click", function() {
                    $scope.closeLastOpenedInfoWindow();
                    options.infowindow.open({
                        anchor: marker,
                        map: $scope.map,
                        shouldFocus: false,
                    });
                    $scope.lastOpenedInfoWindow = options.infowindow;
                });
            }
        }
        $scope.endMarker = marker;
        return marker;
    };

    $scope.addCTMarker = function(latLng, point, title, options) {
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: latLng,
            icon: $scope.markerIcons[point],
            title: title
        });
        $scope.vehicleMarker = marker;
        return marker;
    }

    $scope.clearMarkers = function() {
        if ($scope.markers) {
            for (var i = 0; i < $scope.markers.length; i++) {
                if ($scope.markers[i]) {
                    $scope.markers[i].setMap(null);
                }
            }
        }
        if ($scope.endMarker != null) {
            $scope.endMarker.setMap(null);
        }
        if ($scope.startMarker != null) {
            $scope.startMarker.setMap(null);
        }
        if ($scope.vehicleMarker != null) {
            $scope.vehicleMarker.setMap(null);
        }
    };

    $scope.clearLines = function() {
        if ($scope.line != null) {
            $scope.line.setMap(null);
        }
    };

    $scope.trackDriverStatus = function(data) {
        $scope.clearMarkers();
        $scope.clearLines();
        $scope.isFirstTimeLoc = true;
        $scope.driverId = data.driver.userId;
        $scope.getDriverLocation(data);
    };

    $scope.trackDriverLocation = function(data) {
        $scope.clearMarkers();
        $scope.clearLines();
        $scope.isFirstTimeLoc = true;
        $scope.driverId = data.driver.userId;
        $scope.getDriverLocationLog(data);
    };

    $scope.getDriverLocationLog = function(data) {
        NProgress.start();
        var input = angular.toJson({
            "shipmentId": data.shipment.shipmentId,
            "date": formatDate($("#datePicker").data("DateTimePicker").date())
        });
        if (data.shipment.wfDetails != null && data.shipment.wfDetails.wfValues != null) {
            $scope.daDetails.name = data.driver.firstName + ' ' + data.driver.lastName;
            $scope.daDetails.phone = data.driver.phone;
            if (data.shipment.tja && data.shipment.tja.route)
                $scope.daDetails.route = data.shipment.tja.route;
            if (data.driver.vehicle.vehicleNo)
                $scope.daDetails.vehicle = data.driver.vehicle.vehicleNo;
        }
        DriversService.getDriverLocationDetails(input, $scope.getDriverLocationLogSC, $scope.getDriverLocationLogEC);
    };

    $scope.getDriverLocation = function(data) {
        var latlng = null;
        if ($scope.shipmentState != CONSTANT.COMPLETED_SHIPMENTS &&
            $scope.shipmentState != CONSTANT.FC_SHIPMENTS &&
            $scope.shipmentState != CONSTANT.PC_SHIPMENTS) {
            if ($scope.isFirstTimeLoc) {
                NProgress.start();
            }

            var input = angular.toJson({
                "shipmentId": data.shipment.shipmentId,
                "date": formatDate($("#datePicker").data("DateTimePicker").date())
            });
            DriversService.getDriverLocationLog(input, $scope.getDriverLocationLKSC, $scope.getDriverLocationLKEC);
        } else {
            if (data.shipment.wfDetails != null && data.shipment.wfDetails.wfValues != null) {
                var cLocation = data.shipment.wfDetails.wfValues.COMPLETED_LOCATION;
                latlng = new google.maps.LatLng(cLocation.split(",")[0], cLocation.split(",")[1]);
                $('#driverLocationModal').modal('show');
                $scope.daDetails.name = data.driver.firstName + ' ' + data.driver.lastName;
                $scope.daDetails.phone = data.driver.phone;
                if (data.shipment.tja && data.shipment.tja.route)
                    $scope.daDetails.route = data.shipment.tja.route;
                if (data.driver.vehicle.vehicleNo)
                    $scope.daDetails.vehicle = data.driver.vehicle.vehicleNo;
                options = {
                    ce: true,
                    infowindow: new google.maps.InfoWindow({
                        content: "<h6>CUSTOMER</h6>  - " + data.shipment.dest[0].name + "<br>" +
                            "<h6>CORDS</h6> - " + cLocation + "<br>" + "<h6>END TIME</h6> -" + data.shipment.wfDetails.wfValues.END_TRIP_TIME + "<br>" +
                            '<a href="https://www.google.com/maps/search/?api=1&query=' + cLocation.split(",")[0] + "," + cLocation.split(",")[1] + '" target="_blank" class="btn btn-primary">LOCATION</a><br>',
                    })
                };
                $scope.addEndMarker(latlng, 1, "Invoice No " + data.shipment.orderId, options);
                $scope.map.panTo($scope.endMarker.position);
            }
        }
    };

    $scope.openGoogleMaps = function() {

        var url = "https://www.google.com/maps/search/?api=1&query=" + data.latitude + "," + data.longitude;
        window.open(url, '_blank');
    };

    $scope.getDriverLocationSC = function(data) {

        if (data.responseCode == "1000") {
            var latlng = new google.maps.LatLng(data.lat, data.lng);
            if ($scope.isFirstTimeLoc) {
                NProgress.done();
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
                $scope.clearLines();
                $scope.addMarker(latlng, data.vehicle.vehicleType);
            }
            $scope.markers.push(marker);
            $scope.map.panTo(marker.position);
        }
    };

    $scope.getDriverLocationEC = function() {
        //NProgress.done();        
    };

    $scope.getDriverLocationLogSC = function(data) {

        var addMarker = function(lat, lng, point, title, options) {
            if ((lat == 0) || (lng == 0)) return;
            latlng = new google.maps.LatLng(lat, lng);
            var marker;
            if (point == 0) {
                marker = $scope.addStartMarker(latlng, point, title, options);
            } else if (point == 1) {
                marker = $scope.addEndMarker(latlng, point, title, options);
            } else if (point == 2) {
                marker = $scope.addCTMarker(latlng, point, title, options);
            } else {
                $scope.addMarker(latlng, options);
            }
            $scope.markers.push(marker);
        };
        var cords = [];

        if (data.responseCode == "1000") {
            NProgress.done();
            $scope.isFirstTimeLoc = false;
            if (data.drDetails) {
                $scope.daDetails.name = data.drDetails.name;
                $scope.daDetails.phone = data.drDetails.phone;
                $scope.daDetails.route = data.drDetails.routeNo;
                $scope.daDetails.vehicle = data.drDetails.vehicleNo;
            }
            var logs = data.logs;
            var shLogs = data.shLogs;
            /* var mapOptions = {
                 //center: new google.maps.LatLng(logs[0].lat, logs[0].lng),
                 zoom: 22,
                 mapTypeId: google.maps.MapTypeId.ROADMAP
             };
             $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);*/

            // const contentString =
            //     '<div id="content">' +
            //     '<div id="siteNotice">' +
            //     "</div>" +
            //     '<h1 id="firstHeading" class="firstHeading"> </h1>' +
            //     '<div id="bodyContent">' +
            //     "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
            //     "sandstone rock formation in the southern part of the " +
            //     "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
            //     "south west of the nearest large town, Alice Springs; 450&#160;km " +
            //     "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
            //     "features of the Uluru - Kata Tjuta National Park. Uluru is " +
            //     "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
            //     "Aboriginal people of the area. It has many springs, waterholes, " +
            //     "rock caves and ancient paintings. Uluru is listed as a World " +
            //     "Heritage Site.</p>" +
            //     '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
            //     "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
            //     "(last visited June 22, 2009).</p>" +
            //     "</div>" +
            //     "</div>";

            var latlng;
            if (logs != null && logs.length > 0) {
                for (let i = 0; i < logs.length; i++) {
                    addMarker(logs[i].lat, logs[i].lng);
                    cords.push(new google.maps.LatLng(logs[i].lat, logs[i].lng));
                }
            }
            addMarker(logs[logs.length - 1].lat, logs[logs.length - 1].lng, 2);
            if (shLogs != null && shLogs.length > 0) {
                var loc;
                for (let i = 0; i < shLogs.length; i++) {
                    loc = shLogs[i].location.latitude + "," + shLogs[i].location.longitude;
                    if (shLogs[i].order == 1) {
                        options = {
                            ce: true,
                            infowindow: new google.maps.InfoWindow({
                                content: "START TIME " + shLogs[i].startTime + "<br>" + "CORDS " + loc + "<br>" +
                                    '<a href="https://www.google.com/maps/search/?api=1&query=' + shLogs[i].location.latitude + "," + shLogs[i].location.longitude + '" target="_blank" class="btn btn-primary">LOCATION</a><br>',
                            })
                        };
                    } else {
                        options = {
                            ce: true,
                            infowindow: new google.maps.InfoWindow({
                                content: "<h6>INVOICE NO</h6> - " + shLogs[i].invoiceNo + "<br>" + "<h6>CUSTOMER</h6> - " + shLogs[i].customerName + "<br>" +
                                    "<h6>CORDS</h6> - " + loc + "<br>" + "<h6>END TIME</h6> - " + shLogs[i].endTime + "<br>" +
                                    '<a href="https://www.google.com/maps/search/?api=1&query=' + shLogs[i].location.latitude + "," + shLogs[i].location.longitude + '" target="_blank" class="btn btn-primary">LOCATION</a><br>',
                            })
                        };
                    }
                    addMarker(shLogs[i].location.latitude, shLogs[i].location.longitude, (shLogs[i].order != 1) ? 1 : 0, '', options);
                }
            }
            // addMarker(data.start.latitude, data.start.longitude, 0, data.startTime);
            // addMarker(data.completed.latitude, data.completed.longitude, 1, data.completedTime);
            $('#driverLocationModal').modal('show');
            $scope.map.panTo($scope.vehicleMarker.position);
            if (cords.length > 0) {
                $scope.line = new google.maps.Polyline({
                    path: cords,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                $scope.line.setMap($scope.map)
            }
        }
    };

    $scope.getDriverLocationLogEC = function() {
        NProgress.done();
    };

    $scope.getDriverLocationLKSC = function(data) {

        if (data.responseCode == "1000") {
            NProgress.done();
            $scope.isFirstTimeLoc = false;
            var logs = data.logs;
            if (logs == null || logs.length <= 0) return;
            var latlng = new google.maps.LatLng(logs[logs.length - 1].lat, logs[logs.length - 1].lng);;
            //$scope.addMarker(latlng);
            // addMarker(logs[logs.length - 1].lat, logs[logs.length - 1].lng, 2);
            $scope.addCTMarker(latlng, 2, '', null);
            $('#driverLocationModal').modal('show');
            $scope.map.panTo($scope.vehicleMarker.position);
        }
    };

    $scope.getDriverLocationLKEC = function() {
        //NProgress.done();        
    };

    $scope.updateShipmentStatus = function() {
        /*$scope.shipmentTimer = $interval(function() {
            var input = angular.toJson({
                "fromDate": $scope.fromDate,
                "toDate": null,
                "type": $scope.shipmentState,
                "locality": null,
                "index": $scope.index,
                "count": 15,
                "carrierId": $rootScope.userId,
                "slot": $scope.selectedSlot.mainSlot
            });
            $scope.isViewRefresh = true;
            if ($scope.txt.searchTxt.length > 0) {
                return;
            }
            ShipmentService.filterHubShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
        }, 60000);*/
    };

    $scope.cancelTimer = function() {
        if (angular.isDefined($scope.shipmentTimer)) {
            $interval.cancel($scope.shipmentTimer);
            $scope.shipmentTimer = undefined;
        }
    };

    //$scope.updateShipmentStatus();

    $scope.setETA = function(shipment) {

        if (shipment.wfDetails == null) {
            shipment.wfDetails.eta = "Not Applicable";
        } else if (shipment.wfDetails != null && (shipment.wfDetails.eta == null || shipment.wfDetails.eta == "")) {
            shipment.wfDetails.eta = "Not Applicable";
        }
    };

    $scope.unassignShipment = function(shipmentId) {
        NProgress.start();
        var shipId = [];
        shipId.push(shipmentId);
        var input = angular.toJson({
            "shipmentIds": shipId
        });
        ShipmentService.taToUa(input, $scope.unassignShipmentSC, $scope.unassignShipmentEC);
    };

    $scope.unassignShipmentSC = function(data) {
        NProgress.done();
        if (data.responseCode == "1000") {
            $scope.viewShipments();
            showAlert(CONSTANT.SUCCESS, "Shipment unassigned successfully");
        } else {
            showAlert(CONSTANT.ERROR, "Failed to unassign shipment");
        }
    };

    $scope.unassignShipmentEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to unassign shipment.");
    };

    $scope.unassignShipmentPU = function(job) {
        $('#unassignShipmentModal').modal('show');
        $scope.unassignShipId = job.shipment.shipmentId;
        $scope.unAssignDriver = job.driver.firstName + " " + job.driver.lastName;
    };

    $scope.unassignShipmentPendingToUA = function() {

        NProgress.start();
        var shipId = [];
        shipId.push($scope.unassignShipId);
        var input = angular.toJson({
            "shipmentIds": shipId
        });
        ShipmentService.unassignShipment(input, $scope.unassignShipmentPUSC, $scope.unassignShipmentPUEC);
    };

    $scope.unassignShipmentPUSC = function(data) {
        NProgress.done();
        if (data.responseCode == "1000") {
            $scope.viewShipments();
            $('#unassignShipmentModal').modal('hide');
            showAlert(CONSTANT.SUCCESS, "Shipment unassigned successfully");
        } else {
            showAlert(CONSTANT.ERROR, "Failed to unassign shipment");
        }
    };

    $scope.unassignShipmentPUEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to unassign shipment.");
    };

    $scope.getSHubs = function() {
        console.log("Get Hubs");
        NProgress.start();
        var input = angular.toJson({
            "carrierId": $rootScope.userId
        });
        console.log(input);
        ShipmentService.getSubHubs(input, $scope.getHubsSC, $scope.getHubsEC);
    };

    $scope.getHubsSC = function(data) {

        if (data.responseCode == "1000") {
            $scope.hubs = data.carriers;
            console.log(data);
            var parentHub = {
                "userId": $rootScope.userId,
                "firstName": "All Hubs"
            };
            if ($scope.hubs.length > 0) {
                console.log($scope.hubs[0]);
                $scope.selectedHub.hub = $scope.hubs[0];
                $scope.userId = $scope.selectedHub.hub.userId;
            } else {
                $scope.hubs = [];
                console.log("Empty");
                $scope.selectedHub.hub = parentHub;
            }
            $scope.hubs.push(parentHub);
            $scope.getSlots();
        } else {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Failed to load hubs");
            console.log(data);
        }
    };

    $scope.getHubsEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to unassign shipment.");
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

    $scope.downloadPOD = function(job) {
        var link = document.createElement("a");
        var shipmentId = job.shipment.shipmentId;
        var carrierId = job.shipment.carrier.userId;
        if (link.download !== undefined) {
            var url = $rootScope.baseUrl + '/adm/dlpod/' + shipmentId;
            link.setAttribute("href", url);
            link.setAttribute("download", "POD" + ".zip");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    $scope.downloadAllPOD = function(job) {
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

        $scope.groceries = [];
        NProgress.start();
        var input = angular.toJson({
            "shipmentId": $scope.selectedShipmentId
        });
        console.log(input);
        ShipmentService.getLoads(input, $scope.getLoadsSC, $scope.getLoadsEC);
    };

    $scope.getLoadsSC = function(data) {
        NProgress.done();
        $("html, body").animate({
            scrollTop: $(document).height()
        }, 1000);
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
                    showAlert(CONSTANT.INFO, "No Items found");
                }
            } else {
                showAlert(CONSTANT.INFO, "No Items found");
            }
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get load details");
            console.log(data);
        }
    };

    $scope.getLoadsEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get load details.");
    };

    $scope.page = {
        "currentPage": 1,
        "totalPage": 0,
        "itemsPerPage": 15
    };

    $scope.getTotalPage = function(totalItems) {
        var tPageQ = Math.floor(totalItems / $scope.page.itemsPerPage);
        var tPageM = totalItems % $scope.page.itemsPerPage;
        if (tPageM > 0) {
            tPageQ = tPageQ + 1;
        }
        return tPageQ;
    };

    $scope.openSlotModal = function(shipment) {
        if ($scope.slots.length == 0) {
            showAlert(CONSTANT.INFO, "Slots not configured for this user");
            return;
        }
        $scope.selectedShipments = [];
        $scope.selectedShipment = shipment.shipmentId;
        $scope.selectedShipments.push($scope.selectedShipment);
        $scope.selectedSlot.slot = shipment.slot;
        $('#slotModal').modal('show');
    };

    $scope.getSlots = function() {
        NProgress.start();
        var input = angular.toJson({
            "carrierId": $rootScope.userId
        });
        console.log(input);
        ShipmentService.getSlotsByClient(input, $scope.getSlotsSC, $scope.getSlotsEC);
    };

    $scope.getSlotsSC = function(data) {
        console.log(data);
        NProgress.done();
        $scope.slots = [];
        if (data.responseCode == "1000") {
            $scope.slots = data.slots;
            if ($scope.slots != null && $scope.slots.length > 0) {
                $scope.selectedSlot.slot = $scope.slots[0];
                $scope.selectedSlot.mainSlot = $scope.slots[0];
                $scope.isUnassignedView = true;
            } else {
                showAlert(CONSTANT.INFO, "Slots not configured for this user");
            }
            $('#slotModal').modal('hide');
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get slots");
        }
    };

    $scope.getSlotsEC = function() {
        showAlert(CONSTANT.ERROR, "Internal Error. Failed to get slots");
    };

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
            $scope.viewShipments();
            showAlert(CONSTANT.SUCCESS, "Slot applied successfully");
            $('#slotModal').modal('hide');
        } else {
            if (data.errors[0].code == "TI.0.3.316") {
                showAlert(CONSTANT.ERROR, "Cannot change to current slot. Shipments has already started for this slot.");
            } else if (data.errors[0].code == "TI.0.3.315") {
                showAlert(CONSTANT.ERROR, "Cannot change to previuos slot");
            } else if (data.errors[0].code == "TI.0.3.319") {
                showAlert(CONSTANT.ERROR, "Cannot change slot to previuos day");
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

    $scope.searchShipments = function() {
        if ($scope.txt.searchTxt.length == 0) {
            return;
        }
        NProgress.start();
        var input = angular.toJson({ "filterParm": $scope.txt.searchTxt, "type": 1 });
        ShipmentService.filterShipment(input, $scope.searchShipmentsSC, $scope.searchShipmentsEC);
    };

    $scope.formatAmount = function(amt) {
        return amt.toFixed(2);
    }

    $scope.getDistance = function(job) {
        if (job.shipment.shipmentId == 20902) return 10.5;
        if (job.shipment.shipmentId == 20904) return 9.6;
        if (job.shipment.shipmentId == 20903) return 9.1;
        if (job.shipment.shipmentId == 19175) return 9.6;
        if (job.shipment.shipmentId == 19174) return 9.1;
        if (job.shipment.shipmentId == 19173) return 10.5;

        if (job.shipment.wfDetails.wfValues.DISTANCE_TRAVELLED > 0) {
            return job.shipment.wfDetails.wfValues.DISTANCE_TRAVELLED / 1000;
        }
    }

    $scope.getTotalDistance = function(job) {
        return job.driver.totalDistanceTravelled;
    }

    $scope.formatDatee = function(data) {
        return data.split(' ')[0];
    }

    $scope.searchShipmentsSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.shipments = [];
            $scope.shipments = data.jobs;
            if ($scope.shipments != null && $scope.shipments.length > 0) {
                $scope.setSearchView($scope.shipments[0].sstatus);
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
                $scope.setTotalPages($scope.shipments.length);
            } else {
                showAlert(CONSTANT.INFO, "No shipment found");
            }
        } else {
            showAlert(CONSTANT.ERROR, "Failed to search shipments");
        }
    };

    $scope.searchShipmentsEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal Error. Failed to search shipments");
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
            showAlert(CONSTANT.INFO, "No items has been picked up for this shipment. Cannot be moved to on going status");
        } else {
            $("#continueShipModal").modal("show");
        }
    };

    $scope.continueIRConfirm = function() {
        if ($scope.access.pwd.length == 0) {
            showAlert(CONSTANT.ERROR, "Please enter access code");
            return;
        }
        NProgress.start();
        var input = angular.toJson({ "shipmentId": $scope.selectedIRShipment.shipmentId, "key": $scope.access.pwd });
        ShipmentService.continueIR(input, $scope.continueIRSC, $scope.continueIREC);
    };

    $scope.continueIRSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.viewShipments();
            $("#continueShipModal").modal("hide");
            showAlert(CONSTANT.SUCCESS, "IR shipment moved to on going status");
        } else if (data.errors[0].code == "TI.0.4.158") {
            showAlert(CONSTANT.ERROR, "Invalid access code");
        } else {
            showAlert(CONSTANT.ERROR, "Failed to continue IR shipment");
        }
    };

    $scope.continueIREC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal Error. Failed to continue IR shipment");
    };

    $scope.resetShipments = function() {
        if ($scope.txt.searchTxt.length == 0) {
            $scope.filtersChange($scope.shipmentState);
        }
    };

    $scope.setSearchView = function(status) {

        switch (status) {
            case 0:
                $scope.tab = 1;
                $scope.shipmentState = CONSTANT.UNASSIGNED_SHIPMENTS;
                $scope.isUnassignedView = true;
                $scope.isCanceledView = $scope.isIRView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isTrunedAwayView = $scope.isPendingView = $scope.isExpiredView = false;
                break;
            case 1:
                $scope.tab = 2;
                $scope.shipmentState = CONSTANT.PENDING_SHIPMENTS;
                $scope.isPendingView = true;
                $scope.isCanceledView = $scope.isIRView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isTrunedAwayView = $scope.isUnassignedView = $scope.isExpiredView = false;
                break;
            case 8:
                $scope.tab = 2;
                $scope.shipmentState = CONSTANT.PENDING_SHIPMENTS;
                $scope.isPendingView = true;
                $scope.isCanceledView = $scope.isIRView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isTrunedAwayView = $scope.isUnassignedView = $scope.isExpiredView = false;
                break;
            case 3:
                //completed
                $scope.tab = 4;
                $scope.shipmentState = CONSTANT.FC_SHIPMENTS;
                $scope.isFCView = true;
                $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isTrunedAwayView = $scope.isUnassignedView = isPCView = isCompletedView = $scope.isExpiredView = false;
                break;
            case 3:
                //completed
                $scope.tab = 5;
                $scope.shipmentState = CONSTANT.PC_SHIPMENTS;
                $scope.isPCView = true;
                $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isTrunedAwayView = $scope.isUnassignedView = isFCView = isCompletedView = $scope.isExpiredView = false;
                break;
            case 4:
                //TA
                $scope.tab = 6;
                $scope.shipmentState = CONSTANT.TURNEDAWAY_SHIPMENTS;
                $scope.isTrunedAwayView = true;
                $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isUnassignedView = $scope.isExpiredView = false;
                break;
            case 5:
                //exp
                $scope.tab = 9;
                $scope.shipmentState = CONSTANT.EXPIRED_SHIPMENTS;
                $scope.isExpiredView = true;
                $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
                break;
            case 6:
                //canceled
                $scope.tab = 8;
                $scope.shipmentState = CONSTANT.CANCELED_SHIPMENTS;
                $scope.isCanceledView = true;
                $scope.isExpiredView = $scope.isIRView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
                break;
            case 10:
                //IR
                $scope.tab = 7;
                $scope.shipmentState = CONSTANT.IR_SHIPMENTS;
                $scope.isIRView = true;
                $scope.isCanceledView = $scope.isExpiredView = $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
                break;
            default:
                //Ongoing
                $scope.tab = 3;
                $scope.shipmentState = CONSTANT.ONGOING_SHIPMENTS;
                $scope.isOnGoingView = true;
                $scope.isCanceledView = $scope.isIRView = $scope.isPendingView = $scope.isCompletedView = $scope.isTrunedAwayView = $scope.isUnassignedView = $scope.isExpiredView = false;
        }
    };

    $('#continueShipModal').on('hidden.bs.modal', function() {
        $scope.access = {
            "pwd": ""
        };
    });

    $('#slotModal').on('hidden.bs.modal', function() {
        $scope.access = {
            "pwd": ""
        };
    });

    $(document).ready(function() {

        $('#datePicker').datetimepicker({
            format: 'DD-MM-YYYY',
            ignoreReadonly: true,
            defaultDate: new Date()
        });
    });

    $scope.getRoutes = function() {
        loaderStart();
        var input = angular.toJson({
            "date": formatDate($scope.date.fromDate),
        });
        console.log(input);
        ShipmentService.getRoutes(input, $scope.getRouteSC, $scope.getRouteEC);
    };

    $scope.getRouteSC = function(data) {
        console.log(data);
        loaderStop();
        $scope.slots = [];
        if (data.responseCode == "1000") {
            $scope.routes = [];
            $scope.routes = data.routes;
            $scope.routes.splice(0, 0, 'All');
            if ($scope.routes.length > 0) {
                // $scope.selectedRoute.route = $scope.routes[0];
            } else {
                showAlert("No Routes found", "success");
            }
        } else {
            showAlert("Failed to get route", "error");
        }
    };

    $scope.getDrivers = function() {
        NProgress.start();
        var input = angular.toJson({
            "date": formatDate(new Date()),
            "toDate": null,
            "managerId": 0,
            "locality": $rootScope.locality.toUpperCase(),
            "index": -1,
            "count": -1,
            "type": 1
        });
        console.log(input);
        DriversService.getFDrivers(input, $scope.getDriversSC, $scope.getDriversEC);
    };

    $scope.getDriversSC = function(data) {

        console.log(data);
        if (data.responseCode === "1000") {
            NProgress.done();
            $scope.drivers = [];
            $scope.drivers = data.drivers;
            if ($scope.drivers.length > 0) {
                //$scope.selectedDriver.driver = $scope.drivers[0];
            } else {
                showAlert(CONSTANT.SUCCESS, "No drivers found");
                return;
            }
            showAlert(CONSTANT.SUCCESS, "Drivers retrieved successfully");
        } else {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Failed to get drivers");
        }
    };

    $scope.getDriversEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal Error. Failed to get drivers");
    };  

    $scope.getSHubs();
    $scope.getRoutes();
    $scope.getDrivers();
    
}]);