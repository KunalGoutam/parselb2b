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
 
var dShipmentController = myApp.controller('DShipmentController', ['$rootScope', '$scope', '$routeParams', '$http', '$interval', 'HelperService', '$location', 'CONSTANT', 'ValidationService', '$filter', 'ShipmentService', 'AlertService', 'ShipmentSegmentFilterService', function($rootScope, $scope, $routeParams, $http, $interval, HelperService, $location, CONSTANT, ValidationService, $filter, ShipmentService, AlertService, ShipmentSegmentFilterService) {

    $scope.csvFile = '';
    $scope.markerIcons = {
        0: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        1: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };
    $scope.markers = [];
    $scope.view = 0;
    $scope.currentView = 0;
    $scope.isCreateShipment = false;
    $scope.createShipmentArr = [];
    $scope.idCounter = 0;
    $scope.compDate = new Date();
    //Do not change the below variable name
    $scope.selected = new Date();
    $scope.deliveryDate = new Date();
    $scope.slotDuration = 180;
    $scope.CONSTANT = CONSTANT;
    $scope.validationService = ValidationService;
    $scope.selectedDate = new Date();
    $scope.isTabSelected = false;
    $scope.segment_00_06_Name = "12:00 AM to 06:00 AM";
    $scope.segment_06_12_Name = "06:00 AM to 12:00 PM";
    $scope.segment_12_18_Name = "12:00 PM to 06:00 PM";
    $scope.segment_18_24_Name = "06:00 PM to 12:00 AM";

    $scope.viewShipments = function(view, tempVar, currView, isTableView) {

        $scope.isTableView = isTableView;
        if ($scope.isTableView) {
            $scope.isBookShipmentView = false;
        } else {
            return;
        }
        $scope.view = view;
        if ($scope.isTabSelected && currView == null) {
            return;
        }
        $scope.tempVar = tempVar;
        if (currView != null) {
            $scope.currentView = currView;
        }
        if (tempVar != CONSTANT.REFRESH_CURRENT_VIEW) {
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
            $scope.isTabSelected = false;
            if ($scope.tempVar === CONSTANT.REFRESH_CURRENT_VIEW || $scope.tempVar === CONSTANT.AFTER_DELETE_REFRESH) return;
            showAlert("Failed to retrieve shipments.", "error");
        }
    };

    $scope.retrieveShipmentsErrorBack = function() {
        loaderStop();
        $scope.isTabSelected = false;
        if ($scope.tempVar === CONSTANT.REFRESH_CURRENT_VIEW || $scope.tempVar === CONSTANT.AFTER_DELETE_REFRESH) return;
        showAlert("Internal error. Failed to retrieve shipments.", "error");
    };

    $scope.onBookShipment = function() {
        $scope.isTableView = false;
        $scope.isBookShipmentView = true;
        var pAautocomplete = new google.maps.places.Autocomplete(
            (document.getElementById("txtPickUpPoint")), {
                types: ['geocode']
            });
    };

    $scope.tempArr = [];
    $scope.addNewShipment = function() {
        loaderStart();
        $scope.idCounter = $scope.idCounter + 1;
        var length = $scope.createShipmentArr.length + 1;
        $scope.dropId = "dropId_" + $scope.idCounter;
        $scope.createShipmentArr.push({
            "id": length,
            "drop": $scope.dropId,
            "dropId": $scope.dropId,
            "customerName": "custName_" + length,
            "customerNameId": "custNameId_" + $scope.idCounter,
            "customerPhone": "custPhone_" + length,
            "customerPhoneId": "custPhoneId_" + $scope.idCounter,
            "cod": "cod_" + length,
            "codId": "codId_" + $scope.idCounter,
            "express": "express_" + length,
            "slotted": "slotted_" + length,
            "commentId": "comment_" + $scope.idCounter,
            "orderNumberId": "orderNumber_" + $scope.idCounter,
            "vendorPhoneId": "vendorPhone_" + $scope.idCounter
        });
        $scope.tempArr.push({
            "drop": $scope.dropId
        });
    };

    $scope.setAutoComplete = function() {
        for (var k = 0; k < $scope.tempArr.length; k++) {
            var dAautocomplete = new google.maps.places.Autocomplete(
                (document.getElementById($scope.tempArr[k].drop)), {
                    types: ['geocode']
                });
            if (k == $scope.tempArr.length - 1) {
                loaderStop();
                $scope.tempArr = [];
            }
        }
    };

    $scope.createShipments = function() {

        $scope.isCreateShipment = true;

        if (!ValidationService.validateSlotDuration($scope.slotDuration)) {
            return;
        }

        if (!ValidationService.validateShipmentInput($scope.createShipmentArr)) {
            var result = confirm("One or more shipments does not have input values. Those shipments will not be created.\nAre you sure want to continue");
            if (!result) return;
        }
        loaderStart();
        $scope.jobs = [];
        var hrs = '';
        var mins = '';
        if ($scope.selected.getHours().toString().length < 2) {
            hrs = '0' + $scope.selected.getHours();
        } else {
            hrs = $scope.selected.getHours();
        }
        if ($scope.selected.getMinutes().toString().length < 2) {
            mins = '0' + $scope.selected.getMinutes();
        } else {
            mins = $scope.selected.getMinutes();
        }
        var delDateTime = $scope.deliveryDate.getFullYear() + "-" + Number($scope.deliveryDate.getMonth() + 1) + "-" +
            $scope.deliveryDate.getDate() + " " + hrs + ":" +
            mins + ":" + "00";
        for (var i = 0; i < $scope.createShipmentArr.length; i++) {
            if ($("#txtPickUpPoint").val() != '' && $("#" + $scope.createShipmentArr[i].dropId).val() != '' && $("#" + $scope.createShipmentArr[i].customerPhoneId).val() != '' && $("#" + $scope.createShipmentArr[i].codId).val() != '' && $("#" + $scope.createShipmentArr[i].customerNameId).val() != '' && $("#" + $scope.createShipmentArr[i].vendorPhoneId).val() != '' && $("#" + $scope.createShipmentArr[i].orderNumberId).val() != '') {
                if ($("#" + $scope.createShipmentArr[i].commentId).val() == '') {
                    $("#" + $scope.createShipmentArr[i].commentId).val(' ');
                }
                $scope.jobs.push({
                    "pickup": $("#txtPickUpPoint").val(),
                    "dest": $("#" + $scope.createShipmentArr[i].commentId).val(),
                    "gdest": $("#" + $scope.createShipmentArr[i].dropId).val(),
                    "cod": $("#" + $scope.createShipmentArr[i].codId).val(),
                    "phone": $("#" + $scope.createShipmentArr[i].customerPhoneId).val(),
                    "name": $("#" + $scope.createShipmentArr[i].customerNameId).val(),
                    "deliveryDt": delDateTime,
                    "express": $("#" + $scope.createShipmentArr[i].express).is(":checked") ? 1 : 0,
                    "clientId": 1,
                    "duration": $scope.slotDuration,
                    "custPhone": $("#" + $scope.createShipmentArr[i].vendorPhoneId).val(),
                    "orderNo": $("#" + $scope.createShipmentArr[i].orderNumberId).val()
                });
            }
        }
        if ($scope.jobs.length == 0) {
            $rootScope.showalert("No shipments created.One or more shipment does not have all inputs.", "alert-danger");
            loaderStop();
            return;
        }
        var input = angular.toJson({
            "jobs": $scope.jobs,
            "carrierId": $rootScope.userId
        });

        ShipmentService.createDShipments(input, $scope.createDShipmentSuccessCallBack, $scope.createDShipmentErrorCallBack);
    };

    $scope.createDShipmentSuccessCallBack = function(data) {
        loaderStop();
        $scope.isCreateShipment = false;
        if (data.responseCode === "1000") {
            showAlert("Shipments created successfully.", "success");
            $scope.resetShipmentValues();
        } else {
            showAlert("Failed to create shipments.", "error");
        }
    };

    $scope.createDShipmentErrorCallBack = function() {
        loaderStop();
        $scope.isCreateShipment = false;
        showAlert("Internal error. Failed to create shipments.", "error");
    };

    $scope.removeShipment = function(index) {
        $scope.createShipmentArr.splice(index, 1);
    };

    $scope.resetShipmentValues = function() {
        $scope.createShipmentArr = [];
        $scope.addNewShipments();
        $scope.selected = new Date();
        $scope.deliveryDate = new Date();
    };

    $scope.addNewShipments = function() {
        var shipmentCount = $scope.createShipmentArr.length;
        if (shipmentCount >= CONSTANT.SHIPMENTS_MAX) {
            showAlert("Only 50 shipments can be created at a time.", "error");
            return;
        }
        var numOfShipmentsToCreate = 5;
        if (shipmentCount >= 46) {
            numOfShipmentsToCreate = CONSTANT.SHIPMENTS_MAX - shipmentCount;
        }

        for (var j = 0; j < numOfShipmentsToCreate; j++) {
            $scope.addNewShipment();
        }
        setTimeout($scope.setAutoComplete, 3000);
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
            $scope.viewShipments($scope.view, CONSTANT.AFTER_DELETE_REFRESH, $scope.currentView, $scope.isTableView);
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
        $scope.trackDriverLocation(latlng);
        $('#driverLocationModal').modal('show');
        $scope.timer = $interval(function() {
            $scope.trackDriverLocation(latlng);
        }, 4000);
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
            timer = undefined;
        }
    }

    $scope.initializeMap = function() {
        var mysrclat = 0;
        var mysrclong = 0;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                mysrclat = position.coords.latitude;
                mysrclong = position.coords.longitude;
                var location = new google.maps.LatLng(mysrclat, mysrclong);
                var geocoder = geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'latLng': location
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $("#txtPickUpPoint").val(results[1].formatted_address);
                        }
                    } else {}
                });
            });
        } else {}
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

    $scope.trackDriverLocation = function(latlng) {
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

    $scope.updateShipmentStatus = function() {
        $scope.shipmentTimer = $interval(function() {
            //$scope.viewShipments($scope.view, CONSTANT.REFRESH_CURRENT_VIEW, null, $scope.isTableView);
        }, 10000);
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
    
    $scope.initializeMap();
    $scope.onBookShipment();
    $scope.addNewShipments();
    //$scope.updateShipmentStatus();
    angular.element(document).ready(function() {
        $.Template.layout.activate();
    });
}]);