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
 
var pbb3ShipmentsController = myApp.controller('Pbb3ShipmentsController', ['$rootScope', '$scope', '$routeParams', '$http', '$interval', 'HelperService', '$location', 'CONSTANT', '$filter', 'ShipmentService', 'AlertService', 'ShipmentSegmentFilterService', function($rootScope, $scope, $routeParams, $http, $interval, HelperService, $location, CONSTANT, $filter, ShipmentService, AlertService, ShipmentSegmentFilterService) {

    $scope.csvFile = '';
    $scope.markerIcons = {
        0: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        1: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };
    $scope.markers = [];
    $scope.view = 0;
    $scope.currentView = 0;
    $scope.CONSTANT = CONSTANT;
    $scope.selectedDate = new Date();
    $scope.isTabSelected = false;
    $scope.segment_00_06_Name = "12:00 AM to 06:00 AM";
    $scope.segment_06_12_Name = "06:00 AM to 12:00 PM";
    $scope.segment_12_18_Name = "12:00 PM to 06:00 PM";
    $scope.segment_18_24_Name = "06:00 PM to 12:00 AM";

    $scope.viewShipments = function(view, tempVar, currView) {

        $scope.view = view;
        if ($scope.isTabSelected && currView == null) {
            return;
        }
        $scope.tempVar = tempVar;
        if (currView != null) {
            $scope.currentView = currView;
        }
        if (tempVar != CONSTANT.REFRESH_CURRENT_VIEW) {
            $scope.shipmentArr = [];
            $scope.isTabSelected = true;
            loaderStart();
        }
        var selectedDate = $scope.selectedDate;
        selectedDate = $scope.formatDate(selectedDate);
        var input = angular.toJson({
            "carrierId": $rootScope.userId,
            "date": selectedDate
        });
        ShipmentService.retrieveDShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
    };

    $scope.retrieveShipmentsSuccessCallBack = function(data) {

        if (data.responseCode === "1000") {
            if ($scope.currentView != $scope.view) {
                return;
            }
            if ($scope.isCreateShipment) {
                return;
            }
            $scope.shipmentArr = [];
            $scope.shipmentArr = $filter('ShipmentFilter')(CONSTANT, data, $scope.currentView);
            $scope.segmentedShipments = ShipmentSegmentFilterService.getSegmentedShipments($scope.shipmentArr, $scope.selectedDate);
            $scope.segment_00_06 = $scope.segmentedShipments.segment_00_06_segment;
            $scope.segment_06_12 = $scope.segmentedShipments.segment_06_12_segment;
            $scope.segment_12_18 = $scope.segmentedShipments.segment_12_18_segment;
            $scope.segment_18_24 = $scope.segmentedShipments.segment_18_24_segment;
            loaderStop();
            if ($scope.tempVar === CONSTANT.REFRESH_CURRENT_VIEW || $scope.tempVar === CONSTANT.AFTER_DELETE_REFRESH) return;
            AlertService.showAlert($scope.view, $scope.shipmentArr);
            $scope.isTabSelected = false;
        } else {
            loaderStop();
            if ($scope.tempVar === CONSTANT.REFRESH_CURRENT_VIEW || $scope.tempVar === CONSTANT.AFTER_DELETE_REFRESH) return;
            showAlert("Failed to retrieve shipments.", "error");
            $scope.isTabSelected = false;
        }
    };

    $scope.retrieveShipmentsErrorBack = function() {
        loaderStop();
        $scope.isTabSelected = false;
        if ($scope.tempVar === CONSTANT.REFRESH_CURRENT_VIEW || $scope.tempVar === CONSTANT.AFTER_DELETE_REFRESH) return;
        showAlert("Internal error. Failed to retrieve shipments.", "error");
    };

    $scope.deleteShipment = function(job) {

        loaderStart();
        var input = angular.toJson({
            "shipmentId": job.shipmentId
        });
        ShipmentService.deleteDShipment(input, $scope.deleteShipmentSuccessCallBack, $scope.deleteShipmentErrorCallBack);
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

    $scope.trackDriverStatus = function(data, location) {
        $scope.clearMarkers();
        $scope.trackDriverLocation(data, location);
        $('#driverLocationModal').modal('show');
        $scope.timer = $interval(function() {
            $scope.trackDriverLocation(data, location);
        }, 10000);
    };

    $("#driverLocationModal").on("shown.bs.modal", function() {
        google.maps.event.trigger($scope.map, 'resize');
    });

    $('#driverLocationModal').on('hidden.bs.modal', function() {
        $scope.closeShipmentDetails();
    });

    $scope.viewShipmentDetails = function(shipment) {
        $scope.loadArr = [];
        if (shipment.address[0].loads != null) {
            $scope.loadArr = shipment.address[0].loads;
        }
        if (shipment.wfDetails != null && shipment.wfDetails.wfValues != null) {
            $scope.distanceTravelled = shipment.wfDetails.wfValues.DISTANCE_TRAVELLED;
        }
        $scope.pickUpPoint = shipment.address[0].address;
        $scope.dropPoint = shipment.dest[0].gaddress;
        $('#additionalDetails').modal('show');
    };

    $scope.closeShipmentDetails = function() {
        if (angular.isDefined($scope.timer)) {
            $interval.cancel($scope.timer);
            timer = undefined;
        }
    };

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker;
    $scope.addmarker = function(latLng, point) {
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

    $scope.trackDriverLocation = function(data, location) {
        for (var m = 0; m < $scope.shipmentArr.length; m++) {
            if (data.shipment.shipmentId == $scope.shipmentArr[m].shipment.shipmentId) {
                data = $scope.shipmentArr[m];
            }
        }
        var latlng = null;
        if (location == CONSTANT.ON_TRIP_LOCATION) {
            latlng = new google.maps.LatLng(data.driver.lat, data.driver.lng);
        } else {
            if (data.shipment.wfDetails != null && data.shipment.wfDetails.wfValues != null) {
                var cLocation = data.shipment.wfDetails.wfValues.COMPLETED_LOCATION;
                latlng = new google.maps.LatLng(cLocation.split(",")[0], cLocation.split(",")[1]);
            }
        }
        if (latlng == null) return;
        $scope.clearMarkers();
        $scope.addmarker(latlng, 0);
        $scope.map.setCenter(marker.position);
        $scope.map.panTo(marker.position);
    };

    $scope.onLogout = function() {
        loaderStart();
        HelperService.destroy('pvruser');
        $location.path('/');
        if (angular.isDefined($scope.shipmentTimer)) {
            $interval.cancel($scope.shipmentTimer);
            $scope.shipmentTimer = undefined;
        }
        loaderStop();
    };
    
    $scope.formatDate = function(selectedDate) {
        var d = selectedDate;
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    $scope.updateShipmentStatus = function() {
        $scope.shipmentTimer = $interval(function() {
            $scope.viewShipments($scope.view, CONSTANT.REFRESH_CURRENT_VIEW, null);
        }, 10000);
    };
    
    $scope.cancelTimer = function() {
        if (angular.isDefined($scope.shipmentTimer)) {
            $interval.cancel($scope.shipmentTimer);
            $scope.shipmentTimer = undefined;
        }
    };

    $scope.viewShipments(CONSTANT.UNASSIGNED_VIEW, null, CONSTANT.UNASSIGNED_VIEW);
    //$scope.updateShipmentStatus();
    angular.element(document).ready(function() {
        $.Template.layout.activate();
    });
}]);