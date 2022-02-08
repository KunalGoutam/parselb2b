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
 
var pbb7reassignShipmentController = myApp.controller('Pbb7ReAssignShipmentController', ['$scope', 'ShipmentService', 'DriversService', 'CONSTANT', '$rootScope',
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
        $scope.date = {
            "fromDate": new Date()
        };
        $scope.txt = {
            "searchTxt": ""
        };
        $scope.selectedSlot = {
            "slot": {},
            "mainSlot": {}
        };
        $scope.page = {
            "currentPage": 1,
            "totalPage": 0,
            "itemsPerPage": 20
        };
        $scope.isAssignedView = false;

        /**
         * This method returns the assigned shipments for the logged in client
         * 
         */
        $scope.getAssignedShipments = function(tableState) {

            NProgress.start();
            $scope.userId = $rootScope.userId;
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            $scope.index = pagination.start || 0;
            var input = angular.toJson({

                "fromDate": formatDate($scope.date.fromDate),
                "toDate": null,
                "type": CONSTANT.ASSIGNED_SHIPMENTS,
                "locality": null,
                "index": $scope.index,
                "count": $scope.page.itemsPerPage,
                "carrierId": $scope.userId,
                "slot": $scope.selectedSlot.mainSlot
            });
            console.log(input);
            ShipmentService.filterHubShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
        };

        $scope.retrieveShipmentsSuccessCallBack = function(data) {

            NProgress.done();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.jobs = [];
                $scope.jobs = data.jobs;
                $scope.shipmentCount = data.count;
                $scope.tableState.pagination.numberOfPages = $scope.getTotalPage(data.count);
                showAlert(CONSTANT.SUCCESS, "Shipments retrieved successfully");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to retrieve shipments");
            }
        };

        $scope.retrieveShipmentsErrorBack = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal error. Failed to retrieve shipments.");
        };

        $scope.getTotalPage = function(totalItems) {
            var tPageQ = Math.floor(totalItems / $scope.page.itemsPerPage);
            var tPageM = totalItems % $scope.page.itemsPerPage;
            if (tPageM > 0) {
                tPageQ = tPageQ + 1;
            }
            return tPageQ;
        };

        $scope.refresh = function() {
            if ($scope.txt.searchTxt.length == 0) {
                $scope.tableState.pagination.start = 0;
                $scope.getAssignedShipments($scope.tableState);
            } else {
                $scope.searchShipments();
            }
        };

        $scope.txtChange = function() {
            if ($scope.txt.searchTxt.length == 0) {
                $scope.tableState.pagination.start = 0;
                $scope.getAssignedShipments($scope.tableState);
            } 
        };

        $scope.changeSlot = function() {
            if ($scope.txt.searchTxt.length == 0) {
                $scope.tableState.pagination.start = 0;
                $scope.getAssignedShipments($scope.tableState);
            } else {
                $scope.searchShipments();
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
            $scope.getSlots();
            if (data.responseCode === "1000") {
                $scope.drivers = [];
                $scope.drivers = data.drivers;
                if ($scope.drivers.length > 0) {
                    $scope.selectedDriver.driver = $scope.drivers[0];
                } else {
                    showAlert(CONSTANT.SUCCESS, "No drivers found");
                }
                //NProgress.done();
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

        $scope.toggleSelection = function(job) {     
            var idx = $scope.selectedShipments.indexOf(job.shipment.shipmentId);     
            if (idx > -1) {       
                $scope.selectedShipments.splice(idx, 1);     
            } else {       
                $scope.selectedShipments.push(job);     
            }   
        };

        /**
         * This method reassigns the selected shipment to selected driver
         * 
         */
        $scope.reassignShipments = function() {

            NProgress.start();
            var driverId = $scope.selectedDriver.driver.userId;
            var shipmentIds = [];
            for (var i = 0; i < $scope.selectedShipments.length; i++) {
                shipmentIds.push($scope.selectedShipments[i].shipment.shipmentId);
            }
            var input = angular.toJson({
                "shipmentIds": shipmentIds,
                "driverId": driverId
            });
            console.log(input);
            ShipmentService.reassignShipments(input, $scope.reassignShipmentsSC, $scope.reassignShipmentsEC);
        };

        $scope.reassignShipmentsSC = function(data) {
            NProgress.done();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.selectedShipments = [];
                $scope.getAssignedShipments($scope.tableState);
                showAlert(CONSTANT.SUCCESS, "Shipments reassigned successfully");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to assign one or more shipments");
            }
        };

        $scope.reassignShipmentsEC = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal Error. Failed to assign shipments to drivers");
        };

        $scope.searchShipments = function() {
            if ($scope.txt.searchTxt.length == 0) {
                return;
            }
            NProgress.start();
            var input = angular.toJson({
                "driverName": $scope.txt.searchTxt
            });
            ShipmentService.searchDriverAssignedShipment(input, $scope.searchShipmentsSC, $scope.searchShipmentsEC);
        };

        $scope.searchShipmentsSC = function(data) {
            NProgress.done();
            console.log(data);
            $scope.selectedShipments = [];
            if (data.responseCode === "1000") {
                $scope.jobs = [];
                for (var job in data.jobs) {
                    for (var j = 0; j < data.jobs[job].length; j++) {
                        $scope.jobs.push(data.jobs[job][j]);
                    }
                }
                if ($scope.jobs.length > 0) {
                    showAlert(CONSTANT.INFO, "Assigned shipments retrieved successfully");
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
            //NProgress.done();
            $scope.slots = [];
            if (data.responseCode == "1000") {
                $scope.slots = data.slots;
                if ($scope.slots != null && $scope.slots.length > 0) {
                    $scope.selectedSlot.mainSlot = $scope.slots[0];
                    $scope.isAssignedView = true;
                    //$scope.getAssignedShipments($scope.tableState);
                } else {
                    showAlert(CONSTANT.INFO, "Slots not configured for this user");
                }
                $('#slotModal').modal('hide');
            } else {
                NProgress.done();
                showAlert(CONSTANT.ERROR, "Failed to get slots");
            }
        };

        $scope.getSlotsEC = function() {
            showAlert(CONSTANT.ERROR, "Internal Error. Failed to get slots");
        };
        
        $scope.getDrivers();
    }
]);