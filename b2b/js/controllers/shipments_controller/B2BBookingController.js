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
 
var b2bBookShipmentController = myApp.controller('B2BBookShipmentController', ['$rootScope', '$scope', 'ShipmentService',
    function($rootScope, $scope, ShipmentService) {

        $scope.originLat = 0;
        $scope.originLng = 0;
        $scope.cod = 0;
        $scope.address = {
            srcLan: "",
            srcLat: "",
            srcAdd: "",
            srcFromattedAddress: ""
        };
        
        $scope.input = {
            "orderNumber": "",
            "orderId": "",
            "cod": 0,
            "name": "",
            "phone": "",
            "deliveryDt": "",
            "express": 0,
            "slotted": 0
        };
        
        $scope.selectedTime = {
            "time": new Date()
        };
        
        $scope.deliveryDate = new Date();

        /**
        * This method books the shipment based on the user's input.
        * 
        */

        $scope.bookShipment = function() {
            
            loaderStart();
            var selDate = formatDate($scope.deliveryDate);
            var selTime = formatHours($scope.selectedTime.time);
            console.log(selDate + " " + selTime);
            var sinput = angular.toJson({
                    "jobs": [{
                        "orderNumber": $scope.input.orderNumber,
                        "orderId": $scope.input.orderId,
                        "gpickup": $("#txtPickUpPoint").val(),
                        "pickup": $("#txtPickUpPoint").val(),
                        "dest": $("#txtdropPoint").val(),
                        "gdest": $("#txtdropPoint").val(),
                        "cod": $scope.input.cod,
                        "name": $scope.input.name,
                        "phone": $scope.input.phone,
                        "deliveryDt": selDate + " " + selTime,
                        "express": $("#expressCheck").is(":checked") ? 1 : 0,
                        "slotted": $("#slottedCheck").is(":checked") ? 1 : 0,
                        "clientId": $rootScope.clientId
                    }],
                    "carrierId": $rootScope.userId
            });
            console.log(sinput);
            ShipmentService.createbcshipments(sinput, $scope.bookShipmentSC, $scope.bookShipmentEC);
        };

        $scope.bookShipmentSC = function(data) {
            console.log(data);
            loaderStop();
            if (data.responseCode === "1000") {
                showAlert("Shipment booked successfully", "success");
                $scope.resetShipmentDetails();
            } else {
                showAlert("Shipment booking failed", "error");
            }
        };

        $scope.bookShipmentEC = function() {
            loaderStop();
            showAlert("Internal error. Failed to book shipment", "error");
        };

        $scope.resetShipmentDetails = function() {
            $scope.input = {
                "orderNumber": "",
                "orderId": "",
                "cod": 0,
                "name": "",
                "phone": "",
                "deliveryDt": "",
                "express": 0,
                "slotted": 0
            };
        };
        
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
    }
]);