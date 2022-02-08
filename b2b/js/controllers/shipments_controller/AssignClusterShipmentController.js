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
 
var assignShipmentController = myApp.controller('AssignClusterShipmentController', ['$scope', 'ShipmentService', 'DriversService', 'CONSTANT', '$rootScope',
    function($scope, ShipmentService, DriversService, CONSTANT, $rootScope) {

        $scope.selectedDriver = {
            "driver": {}
        };
        $scope.app = {
            "pwd": ''
        };
        $scope.selectedShipments = [];
        $scope.shipmentCount = 0;
            $scope.selectedHub = {
            "hub": null
        };
        $scope.hubs = [];
        $scope.userId = 0;
        $scope.groups = [];
        $scope.selectedGroup = {
            "group": {}
        };
        
        $scope.getUnassignedShipments = function() {

            loaderStart();
            var input = angular.toJson({});
            ShipmentService.getClusterUnassignShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack, $rootScope.userId);
        };

        $scope.retrieveShipmentsSuccessCallBack = function(data) {

            loaderStop();
            console.log(data);
            $scope.groups = [];
            if (data.responseCode === "1000") {
                $scope.jobs = [];
                $scope.unassignShipmentsMap = data.unassignShipments;
                if ($scope.unassignShipmentsMap != null) {
                    for (var i in $scope.unassignShipmentsMap) {
                        $scope.groups.push(i);
                    }
                    if ($scope.groups.length > 0) {
                        $scope.selectedGroup.group = $scope.groups[0];
                    }
                }
                showAlert("Shipments retrieved successfully", "success");
            } else {
                showAlert("Failed to retrieve shipments", "error");
            }
        };

        $scope.retrieveShipmentsErrorBack = function() {
            loaderStop();
            showAlert("Internal error. Failed to retrieve shipments.", "error");
        };

        $scope.getDrivers = function() {
            loaderStart();
            var input = angular.toJson({});
            console.log(input);
            DriversService.getDriversNotInJob(input, $scope.getDriversSC, $scope.getDriversEC);
        };

        $scope.getDriversSC = function(data) {

            console.log(data);
            if (data.responseCode === "1000") {
                $scope.drivers = [];
                $scope.drivers = data.users;
                if ($scope.drivers != null && $scope.drivers.length > 0) {
                    $scope.selectedDriver.driver = $scope.drivers[0];
                } else {
                    showAlert("No drivers found", "success");
                }
                loaderStop();
                $scope.getUnassignedShipments();
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
         
        $scope.assignShipments = function() {
            
            loaderStart();
            var driverId = $scope.selectedDriver.driver.userId;
            var map = {};
            map[$scope.selectedGroup.group] = driverId;
            var input = angular.toJson({"assignmentMap": map});
            console.log(input);
            ShipmentService.assignClusterShipments(input, $scope.assignShipmentsSC, $scope.assignShipmentsEC);
        };
        
        $scope.assignShipmentsSC = function(data) {
            loaderStop();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.getDrivers();
                showAlert("Cluster assigned to driver successfully", "success");
            } else {
                showAlert("Failed to assign shipments", "error");
            }
        };
        
        $scope.assignShipmentsEC = function() {
            loaderStop();
            showAlert("Internal Error. Failed to assign shipments to drivers", "error");
        };

        $scope.getDrivers();
    }
]);