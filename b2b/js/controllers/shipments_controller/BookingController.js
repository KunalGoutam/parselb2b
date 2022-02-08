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
 
var bookShipmentController = myApp.controller('BookShipmentController', ['$rootScope', '$scope', 'ShipmentService', '$interval', 'CarrierService',
    function($rootScope, $scope, ShipmentService, $interval, CarrierService) {

        var geocoder = new google.maps.Geocoder();
        $scope.isbikeactive = true;
        $scope.isminiactive = false;
        $scope.ismaxiactive = false;
        $scope.vType = 1;
        $scope.originLat = 0;
        $scope.originLng = 0;
        $scope.lastShipment = false;
        $scope.shipmentcount = 0;

        //optional
        $scope.destinationLat = 0;
        $scope.destinationLng = 0;
        $scope.recpName = '';
        $scope.recpPhone = '';
        $scope.cod = 0;
        $scope.recpFlatNo = '';
        $scope.recpFlatName = '';
        $scope.recpLandmark = '';

        $scope.markerIcons = {
            0: 'img/scooter-2.png',
            1: 'img/mini-2.png',
            2: 'img/truck-2.png'
        };
        $scope.markers = [];
        $scope.walletBalance = 0;

        $scope.address = {
            srcLan: "",
            srcLat: "",
            srcAdd: "",
            srcFromattedAddress: ""
        };

        $scope.setPickUpLng = function() {

            if ($("#txtPickUpPoint").val().length === 0) {
                return;
            }
            geocoder.geocode({
                'address': $("#txtPickUpPoint").val()
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $scope.map.setCenter(results[0].geometry.location);
                } else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
            $scope.getNearByDrivers(true);
        };

        $scope.isLoaderStart = false;
        $scope.getNearByDrivers = function(vehChange) {

            if ($("#txtPickUpPoint") && $("#txtPickUpPoint").val().length === 0) {
                return;
            }
            console.log($("#txtPickUpPoint").val());
            if (vehChange) {
                $scope.isLoaderStart = vehChange;
                loaderStart();
            }
            var input = angular.toJson({
                "vehicleType": $scope.vType,
                "address": $("#txtPickUpPoint").val()
            });
            ShipmentService.retrieveNearByDrivers(input, $scope.getNearByDriversSC, $scope.getNearByDriversEC);
        };

        $scope.getNearByDriversSC = function(data) {
            
            if ($scope.isLoaderStart) {
                loaderStop();
                $scope.isLoaderStart = false;
            }
            $scope.availableDrivers = 0;
            $scope.clearMarkers();
            if (data.responseCode === "1000") {

                $scope.availableDrivers = data.nearby.length;
                if (data.nearest !== null) {
                    $scope.availableDrivers += 1;
                }
                $scope.driverCount = " (" + $scope.availableDrivers + ")";

                //nearby
                for (var i = 0; i < data.nearby.length; i++) {
                    var latlng = new google.maps.LatLng(data.nearby[i][0], data.nearby[i][1]);
                    $scope.addmarker(latlng);
                }

                //nearest
                if (data.nearest !== null) {
                    var latlng = new google.maps.LatLng(data.nearest[0], data.nearest[1]);
                    $scope.addmarker(latlng);
                }

            } else {
                $scope.driverCount = " (0)";
            }
        };

        var marker = null;
        $scope.addmarker = function(latLng) {
            marker = new google.maps.Marker({
                map: $scope.map,
                position: latLng,
                icon: $scope.markerIcons[$scope.vType - 1]
            });
            $scope.markers.push(marker);
        };

        $scope.clearMarkers = function() {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(null);
            }
        };

        $scope.getNearByDriversEC = function() {
            loaderStop();
        };

        $scope.onVehicleTypeChanged = function(data) {
            $scope.driverCount = "";
            if (data == 1) {
                $scope.vType = 1;
                $scope.isbikeactive = true;
                $scope.isminiactive = false;
                $scope.ismaxiactive = false;
            } else if (data == 2) {
                $scope.vType = 2;
                $scope.isbikeactive = false;
                $scope.isminiactive = true;
                $scope.ismaxiactive = false;
            } else {
                $scope.vType = 3;
                $scope.isbikeactive = false;
                $scope.isminiactive = false;
                $scope.ismaxiactive = true;
            }
            if ($("#txtPickUpPoint").val() != '') {
                $scope.getNearByDrivers(true);
            }
        };

        $scope.validateBooking = function() {

            if ($scope.pickUpQty <= 0) {
                showAlert("Quantity cannot be less than zero", "error");
                return;
            }

            if ($scope.pickUpQty > 25) {
                showAlert("Quantity cannot be greater than 25", "error");
                return;
            }

            if ($scope.pickUpQty > $scope.availableDrivers) {
                showAlert("Quantity cannot be greater than number of available drivers", "error");
                return;
            }

            $scope.shipmentcount = $scope.pickUpQty;
            loaderStart();
            $scope.bookShipment();
        };

        /**
        * This method books the shipment based on the user's input.
        * 
        */
        $scope.bookShipment = function() {

            var input = angular.toJson({
                "job": {
                    "vehicleType": $scope.vType,
                    "pickup": $("#txtPickUpPoint").val(),
                    "lat": 0,
                    "lng": 0,
                    "pickDoorNo": "",
                    "pickLandmark": "",
                    "pickHouseName": "",
                    "name": $rootScope.user.firstName,
                    "phone": $rootScope.user.phone,
                    "dest": $("#txtdropPoint").val(),
                    "dlat": 0,
                    "dlng": 0,
                    "destDoorNo": $scope.recpFlatNo,
                    "destLandmark": $scope.recpLandmark,
                    "destHouseName": $scope.recpFlatName,
                    "destName": $scope.recpName,
                    "destNo": $scope.recpPhone,
                    "cod": $scope.cod,
                    "userId": $rootScope.userId,
                    "clientId": 5
                },
                "carrierId": $rootScope.userId
            });
            ShipmentService.bookShipment(input, $scope.bookShipmentSC, $scope.bookShipmentEC);
        };

        $scope.bookShipmentSC = function(data) {
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.shipmentcount = $scope.shipmentcount - 1;
                if ($scope.shipmentcount > 0) {
                    $scope.bookShipment();
                } else {
                    showAlert("Shipment booked successfully", "success");
                    $scope.resetShipmentDetails();
                    loaderStop();
                }
            } else {
                loaderStop();
                if (data.errors[0].code == "POT.0.2.11") {
                    showAlert("No nearby driver to assign job !!! Try again later.", "Error");
                } else {
                    showAlert("One or more shipment booking failed", "error");
                }
            }
        };

        $scope.bookShipmentEC = function() {
            loaderStop();
            showAlert("Internal error. Failed to book shipment", "error");
        };

        $scope.startNearByDriversTimer = function() {
            $scope.nearByDriversTimer = $interval(function() {
                $scope.getNearByDrivers();
            }, 10000);
        };

        $scope.cancelNearByDriversTimer = function() {
            if (angular.isDefined($scope.nearByDriversTimer)) {
                $interval.cancel($scope.nearByDriversTimer);
                $scope.nearByDriversTimer = undefined;
            }
        };

        $scope.startNearByDriversTimer();

        $scope.initialize = function() {

            $scope.autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('txtPickUpPoint')), {
                    types: ['geocode']
                });
            google.maps.event.addListener($scope.autocomplete, 'place_changed', function() {});

            $scope.autocomplete_drop = new google.maps.places.Autocomplete(
                (document.getElementById('txtdropPoint')), {
                    types: ['geocode']
                });
            google.maps.event.addListener($scope.autocomplete_drop, 'place_changed', function() {});

        };

        $scope.initialize();

        $scope.loadGoogleMapOnLoad = function() {

            loaderStart();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.originLat = position.coords.latitude;
                    $scope.originLng = position.coords.longitude;
                    var latlng = new google.maps.LatLng($scope.originLat, $scope.originLng);
                    $scope.map.panTo(latlng);
                    $scope.map.setCenter(latlng);
                    $scope.defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(18.9750, 72.8258), latlng);
                    $scope.map.panTo(new google.maps.LatLng($scope.originLat, $scope.originLng));
                    geocoder.geocode({
                        'latLng': latlng
                    }, function(results, status) {
                        loaderStop();
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                if ($("#txtPickUpPoint")) {
                                    $scope.pickUpPoint = results[0].formatted_address;
                                    $("#txtPickUpPoint").val(results[0].formatted_address);
                                    $scope.$apply();
                                    $scope.getNearByDrivers(true);
                                }
                            }
                        } else {
                            console.log("Geocoder failed due to: " + status);
                        }
                    });
                });
            }
        };

        $scope.loadGoogleMapOnLoad();

        var mapOptions = {
            center: new google.maps.LatLng($scope.address.srcLat, $scope.address.srcLan),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            disableDefaultUI: true,
            zoomControl: true
        };
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        $scope.getWalletBalance = function() {
            if ($rootScope.userId == 0) return;
            var input = angular.toJson({
                "carrierId": $rootScope.userId
            });
            CarrierService.getWalletBalance(input, $scope.getWalletBalanceSC, $scope.getWalletBalanceEC);
        };

        $scope.getWalletBalanceSC = function(data) {
            if (data.responseCode == "1000") {
                $scope.walletBalance = data.amount;
            } else {
                showAlert("Failed to get wallet balance", "error");
            }
        };

        $scope.getWalletBalanceEC = function() {
            showAlert("Internal error. Failed to get wallet balance", "error");
        };

        $scope.getWalletBalance();

        $scope.resetShipmentDetails = function() {
            $scope.originLat = 0;
            $scope.originLng = 0;
            $scope.lastShipment = false;
            $scope.shipmentcount = 0;

            $scope.destinationLat = 0;
            $scope.destinationLng = 0;
            $scope.recpName = '';
            $scope.recpPhone = '';
            $scope.cod = 0;
            $scope.recpFlatNo = '';
            $scope.recpFlatName = '';
            $scope.recpLandmark = '';
            $scope.getNearByDrivers(false);
            $scope.getWalletBalance();
            $scope.clearMarkers();
        };
    }
]);