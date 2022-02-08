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

var pbb7assignShipmentController = myApp.controller('AssignShipmentController', ['$scope', 'ShipmentService', 'DriversService', 'CONSTANT', '$rootScope',
    function($scope, ShipmentService, DriversService, CONSTANT, $rootScope) {

        $scope.selectedDriver = {
            "driver": {}
        };
        $scope.app = {
            "pwd": ''
        };
        $scope.selectedRoute = {
            "route": ''
        };
        $scope.selectedVehicle = {
            "vehicle": {}
        };
        $scope.routes = [];
        $scope.selectedShipments = [];
        $scope.shipmentCount = 0;
        $scope.selectedHub = {
            "hub": null
        };
        $scope.hubs = [];
        $scope.userId = 0;
        $scope.date = {
            "fromDate": new Date()
        };
        $scope.selectedSlot = {
            "slot": {},
            "mainSlot": {}
        };
        $scope.model = {};
        $scope.model.allItemsSelected = false;

        $scope.getUnassignedShipments = function() {

            loaderStart();
            $scope.userId = $rootScope.userId;
            var input = angular.toJson({

                "fromDate": formatDate($scope.date.fromDate),
                "toDate": null,
                "type": CONSTANT.UNASSIGNED_SHIPMENTS,
                "locality": null,
                "index": -1,
                "count": -1,
                "carrierId": $scope.userId,
                "slot": $scope.selectedSlot.mainSlot,
                "route": $scope.selectedRoute.route,
            });
            console.log(input);
            ShipmentService.mmassignments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
        };

        $scope.retrieveShipmentsSuccessCallBack = function(data) {

            loaderStop();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.jobs = [];
                $scope.jobs = data.jobs;
                $scope.shipmentCount = data.count;
                showAlert("Shipments retrieved successfully", "success");
            } else {
                showAlert("Failed to retrieve shipments", "error");
            }
            $scope.getDrivers();
        };

        $scope.retrieveShipmentsErrorBack = function() {
            loaderStop();
            showAlert("Internal error. Failed to retrieve shipments.", "error");
        };

        $scope.getDrivers = function() {
            loaderStart();
            /*var input = angular.toJson({
                "date": formatDate(new Date()),
                "toDate": null,
                "managerId": 0,
                "locality": $rootScope.locality.toUpperCase(),
                "index": -1,
                "count": -1,
                "type": CONSTANT.ALL_DRIVERS,
                "driverType": CONSTANT.EXCLUDE_OP_DRIVERS
            });*/
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
                $scope.drivers = [];
                $scope.drivers = data.drivers;
                if ($scope.drivers.length > 0) {
                    //$scope.selectedDriver.driver = $scope.drivers[0];
                } else {
                    showAlert("No drivers found", "success");
                }
                loaderStop();
                showAlert("Drivers retrieved successfully", "success");
            } else {
                loaderStop();
                showAlert("Failed to get drivers", "error");
            }
        };

        $scope.getDriversEC = function() {
            loaderStop();
            showAlert("Internal Error. Failed to get drivers", "error");
        };  

        $scope.getVehicles = function() {
            loaderStart();
            var input = angular.toJson({});
            console.log(input);
            DriversService.getVehicles(input, $scope.getVehicleSC, $scope.getVehicleEC);
        };

        $scope.getVehicleSC = function(data) {

            console.log(data);
            if (data.responseCode === "1000") {
                $scope.vehicles = [];
                $scope.vehicles = data.vehicles;
                if ($scope.vehicles.length > 0) {
                    //$scope.selectedDriver.driver = $scope.drivers[0];
                } else {
                    showAlert("No vehicles found", "success");
                }
                loaderStop();
                showAlert("Vehicles retrieved successfully", "success");
            } else {
                loaderStop();
                showAlert("Failed to get vehicles", "error");
            }
        };

        $scope.getVehicleEC = function() {
            loaderStop();
            showAlert("Internal Error. Failed to get vehicles", "error");
        };  

        $scope.toggleSelection = function(job) {     
            var idx = $scope.selectedShipments.indexOf(job.shipment.shipmentId);     
            if (idx > -1) {       
                $scope.selectedShipments.splice(idx, 1);     
            } else {       
                $scope.selectedShipments.push(job);     
            }   

            for (var i = 0; i < $scope.jobs.length; i++) {
                if (!$scope.jobs[i].isChecked) {
                    $scope.model.allItemsSelected = false;
                    return;
                }
            }

            //If not the check the "allItemsSelected" checkbox
            $scope.model.allItemsSelected = true;
        };

        $scope.selectAll = function() {
            // Loop through all the entities and set their isChecked property
            for (var i = 0; i < $scope.jobs.length; i++) {
                $scope.jobs[i].isChecked = $scope.model.allItemsSelected;
            }
        };

        $scope.setDriver = function(job, selectedDriver) {
            job.selectedDriverID = selectedDriver.userId;
        };

        $scope.setVehicle = function(job, selectedVehicle) {
            job.selectedVehicleID = selectedVehicle.vehicleId;
        };

        $scope.setRoute = function(selectedRoute) {
            $scope.selectedRoute.route = selectedRoute;
        };

        $scope.assignShipments = function() {

            loaderStart();
            var driverId = $scope.selectedDriver.driver.userId;
            var map = {};
            for (var i = 0; i < $scope.selectedShipments.length; i++) {
                map[$scope.selectedShipments[i].shipment.shipmentId] = $scope.selectedShipments[i].selectedDriverID;
            }
            var input = angular.toJson({
                "assignmentMap": map,
                "tjuk": 1,
                "vehicle": $scope.selectedVehicle.vehicle
            });
            console.log(input);
            ShipmentService.assignShipments(input, $scope.assignShipmentsSC, $scope.assignShipmentsEC);
        };

        $scope.assignShipmentsSC = function(data) {
            loaderStop();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.selectedShipments = [];
                $scope.getUnassignedShipments();
            } else {
                showAlert("Failed to assign one or more shipments", "error");
            }
        };

        $scope.assignShipmentsEC = function() {
            loaderStop();
            showAlert("Internal Error. Failed to assign shipments to drivers", "error");
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
                $scope.getUnassignedShipments();
            } else {
                console.log(data);
            }
        };

        $scope.getHubsEC = function() {
            loaderStop();
            console.log("Internal error. Failed to unassign shipment.");
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
                    $scope.selectedSlot.mainSlot = $scope.slots[0];
                    $scope.getUnassignedShipments();
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
        //$scope.getSHubs();
        // $scope.getSlots();

        $scope.getRoutes = function() {
            loaderStart();
            var input = angular.toJson({
                "date": formatDate(new Date()),
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
                if ($scope.routes.length > 0) {
                    $scope.selectedRoute.route = $scope.routes[0];
                } else {
                    showAlert("No Routes found", "success");
                }
            } else {
                showAlert("Failed to get route", "error");
            }
        };

        $scope.getRouteEC = function() {
            showAlert("Internal Error. Failed to get route", "error");
        };
    }
]);