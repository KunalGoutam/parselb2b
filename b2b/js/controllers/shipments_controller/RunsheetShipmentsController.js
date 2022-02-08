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
 
var pbb2ShipmentsController = myApp.controller('RunSheetShipmentsController', ['$rootScope', '$scope', '$interval', 'CONSTANT', 'ShipmentService', 'APP', 'DriversService', function($rootScope, $scope, $interval, CONSTANT, ShipmentService, APP, DriversService) {
    
    $scope.csvFile = '';
    $scope.markerIcons = {
        0: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        1: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };
    $scope.markers = [];
    $scope.CONSTANT = CONSTANT;
    $scope.date = {
        "fromDate": new Date(),
        "toDate": new Date()
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
    $scope.isOnGoingView = true;
    $scope.selectedSheet = {
        "sheet": ""
    }

    $scope.getRunSheet = function() {
        loaderStart();
        var input = angular.toJson({
            "date": formatDate($scope.date.fromDate)
        });
        console.log(input);
        ReportService.getRunSheet(input, $scope.getRunSheetSC, $scope.getRunSheetEC);
    };

    $scope.getRunSheetSC = function(data) {
        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.sheets = data.names;
        } else {
            showAlert("Failed to get runsheets", "error");
        }
    };

    $scope.getRunSheetEC = function() {
        loaderStop();
        showAlert("Internal Error. Failed to get runsheets", "error");
    };

    $scope.getRunSheet();

    $scope.viewPendingShipments = function(tableState) {

        $scope.pTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isPendingView = true;
        $scope.isOnGoingView = $scope.isCompletedView = $scope.isTrunedAwayView = $scope.isUnassignedView = $scope.isExpiredView =false;
        $scope.shipmentState = CONSTANT.PENDING_SHIPMENTS;
        $scope.viewShipments();
    };

    $scope.viewUnassignedShipments = function(tableState) {

        $scope.uState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isUnassignedView = true;
        $scope.isOnGoingView = $scope.isCompletedView = $scope.isTrunedAwayView = $scope.isPendingView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.UNASSIGNED_SHIPMENTS;
        $scope.viewShipments();
    };

    $scope.viewOngoingShipments = function(tableState) {

        $scope.oTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isOnGoingView = true;
        $scope.isPendingView = $scope.isCompletedView = $scope.isTrunedAwayView = $scope.isUnassignedView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.ONGOING_SHIPMENTS;
        $scope.viewShipments();
    };

    $scope.viewCompletedShipments = function(tableState) {

        $scope.cTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isCompletedView = true;
        $scope.isPendingView = $scope.isOnGoingView = $scope.isTrunedAwayView = $scope.isUnassignedView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.COMPLETED_SHIPMENTS;
        $scope.viewShipments();
    };

    $scope.viewTurnedAwayShipments = function(tableState) {

        $scope.tTState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isTrunedAwayView = true;
        $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isUnassignedView = $scope.isExpiredView = false;
        $scope.shipmentState = CONSTANT.TURNEDAWAY_SHIPMENTS;
        $scope.viewShipments();
    };
    
    $scope.viewExpiredShipments = function(tableState) {

        $scope.eState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        $scope.isExpiredView = true;
        $scope.isPendingView = $scope.isOnGoingView = $scope.isCompletedView = $scope.isUnassignedView = $scope.isTrunedAwayView = false;
        $scope.shipmentState = CONSTANT.EXPIRED_SHIPMENTS;
        $scope.viewShipments();
    };

    $scope.viewShipments = function() {

        $scope.fromDate = formatDate($scope.date.fromDate);
        $scope.userId = $rootScope.userId;
        if ($scope.selectedHub.hub != null) {
            $scope.userId = $scope.selectedHub.hub.userId;
        } 
        var input = angular.toJson({

            "date": $scope.fromDate,
            "name": $scope.selectedSheet.sheet
        });
        loaderStart();
        $scope.isViewRefresh = false;
        console.log(input);
        ShipmentService.filterHubShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
    };

    $scope.retrieveShipmentsSuccessCallBack = function(data) {

        console.log(data);
        loaderStop();
        if (data.responseCode === "1000") {
            $scope.shipments = [];
            $scope.shipments = data.jobs;
            for (var i = 0; i < $scope.shipments.length; i++) {
                $scope.setETA($scope.shipments[i].shipment);
            }
            $scope.setTotalPages(data.count);
            if ($scope.isViewRefresh) return;
            showAlert("Shipments retrieved successfully", "success");
        } else {
            if ($scope.isViewRefresh) return;
            showAlert("Failed to retrieve shipments", "error");
        }
    };

    $scope.retrieveShipmentsErrorBack = function() {
        loaderStop();
        showAlert("Internal error. Failed to retrieve shipments.", "error");
    };

    $scope.filtersChange = function(currentState) {
        $scope.shipmentState = currentState;
        if ($scope.shipmentState === CONSTANT.PENDING_SHIPMENTS) {
            if (typeof $scope.pTState == 'undefined') {
                $scope.isPendingView = true;
            } else {
                $scope.pTState.pagination.start = 0;
                $scope.viewPendingShipments($scope.pTState);
            }
        } else if ($scope.shipmentState === CONSTANT.ONGOING_SHIPMENTS) {
            if (typeof $scope.oTState == 'undefined') {
                $scope.isOnGoingView = true;
            } else {
                $scope.oTState.pagination.start = 0;
                $scope.viewOngoingShipments($scope.oTState);
            }
        } else if ($scope.shipmentState === CONSTANT.COMPLETED_SHIPMENTS) {
            if (typeof $scope.cTState == 'undefined') {
                $scope.isCompletedView = true;
            } else {
                $scope.cTState.pagination.start = 0;
                $scope.viewCompletedShipments($scope.cTState);
            }
        } else if ($scope.shipmentState === CONSTANT.TURNEDAWAY_SHIPMENTS) {
            if (typeof $scope.tTState == 'undefined') {
                $scope.isTrunedAwayView = true;
            } else {
                $scope.tTState.pagination.start = 0;
                $scope.viewTurnedAwayShipments($scope.tTState);
            }
        } else if ($scope.shipmentState === CONSTANT.UNASSIGNED_SHIPMENTS) {
            if (typeof $scope.uState == 'undefined') {
                $scope.isUnassignedView = true;
            } else {
                $scope.uState.pagination.start = 0;
                $scope.viewUnassignedShipments($scope.uState);
            }
        } else if ($scope.shipmentState === CONSTANT.EXPIRED_SHIPMENTS) {
            if (typeof $scope.eState == 'undefined') {
                $scope.isExpiredView = true;
            } else {
                $scope.uState.pagination.start = 0;
                $scope.viewExpiredShipments($scope.uState);
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
        } else if ($scope.shipmentState === CONSTANT.TURNEDAWAY_SHIPMENTS) {
            $scope.tTState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.UNASSIGNED_SHIPMENTS) {
            $scope.uState.pagination.numberOfPages = $scope.getTotalPage(count);
        } else if ($scope.shipmentState === CONSTANT.EXPIRED_SHIPMENTS) {
            $scope.eState.pagination.numberOfPages = $scope.getTotalPage(count);
        }
    };

    $scope.deleteShipment = function(job) {

        loaderStart();
        var input = angular.toJson({
            "shipmentId": job.shipmentId
        });
        ShipmentService.deleteShipment(input, $scope.deleteShipmentSuccessCallBack, $scope.deleteShipmentErrorCallBack);
    };

    $scope.deleteShipmentSuccessCallBack = function(data) {
        loaderStop();
        if (data.responseCode === "1000") {
            showAlert("Shipment deleted successfully.", "success");
            $scope.viewShipments($scope.view, CONSTANT.AFTER_DELETE_REFRESH, $scope.currentView);
        } else {
            showAlert("Failed to delete shipment.", "error");
        }
    };

    $scope.deleteShipmentErrorCallBack = function() {
        loaderStop();
        showAlert("Internal error. Failed to delete shipment.", "error");
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

    $scope.updateShipmentStatus = function() {
        $scope.shipmentTimer = $interval(function() {
            var input = angular.toJson({
                "fromDate": $scope.fromDate,
                "toDate": null,
                "type": $scope.shipmentState,
                "locality": null,
                "index": $scope.index,
                "count": 10,
                "carrierId": $scope.userId
            });
            $scope.isViewRefresh = true;
            ShipmentService.filterHubShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
        }, 60000);
    };

    $scope.cancelTimer = function() {
        if (angular.isDefined($scope.shipmentTimer)) {
            $interval.cancel($scope.shipmentTimer);
            $scope.shipmentTimer = undefined;
        }
    };

    $scope.updateShipmentStatus();

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
    
    $scope.unassignShipmentPU = function(shipmentId) {
        loaderStart();
        var shipId = [];
        shipId.push(shipmentId);
        var input = angular.toJson({
            "shipmentIds": shipId
        });
        ShipmentService.unassignShipment(input, $scope.unassignShipmentPUSC, $scope.unassignShipmentPUEC);
    };

    $scope.unassignShipmentPUSC = function(data) {
        loaderStop();
        if (data.responseCode == "1000") {
            $scope.viewShipments();
            showAlert("Shipment unassigned successfully", "success");
        } else {
            showAlert("Failed to unassign shipment", "error");
        }
    };

    $scope.unassignShipmentPUEC = function() {
        loaderStop();
        showAlert("Internal error. Failed to unassign shipment.", "error");
    };
    
    $scope.getSHubs = function() {
        console.log("Get Hubs");
        loaderStart();
        var input = angular.toJson({
            "carrierId": $rootScope.userId
        });
        console.log(input);
        ShipmentService.getSubHubs(input, $scope.getHubsSC, $scope.getHubsEC);
    };

    $scope.getHubsSC = function(data) {
        loaderStop();
        if (data.responseCode == "1000") {
            $scope.hubs = data.carriers;
            console.log(data);
            var parentHub = {"userId": $rootScope.userId, "firstName": "All Hubs"};
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
            $scope.isUnassignedView = true;
        } else {
            console.log(data);
        }
    };

    $scope.getHubsEC = function() {
        loaderStop();
        console.log("Internal error. Failed to unassign shipment.");
    };
    
    $scope.viewSignature = function(job) {
        var link = document.createElement("a");
        var shipmentId = job.shipment.shipmentId;
        var carrierId = job.shipment.carrier.userId;
        if (link.download !== undefined) {
            var url = $rootScope.baseUrl + '/adm/dl/'+ carrierId+ '/' + shipmentId + '/sign';
            link.setAttribute("href", url);
            link.setAttribute("download", "signature" + ".png");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    angular.element(document).ready(function() {
        $.Template.layout.activate();
    });
    
    //$scope.getSHubs();
}]);