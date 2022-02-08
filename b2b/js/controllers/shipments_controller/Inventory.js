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

var inventoryController = myApp.controller('InventoryController', ['$scope', 'ShipmentService', 'DriversService', 'CONSTANT', '$rootScope',
    function($scope, ShipmentService, DriversService, CONSTANT, $rootScope) {

        $scope.date = {
            "fromDate": new Date()
        };
        $scope.menuItems = ['PICKEDUP', 'RETURNED'];
        $scope.activeMenu = $scope.menuItems[0];
        $scope.CONSTANT = CONSTANT;
        $scope.page = {
            "currentPage": 1,
            "totalPage": 0,
            "itemsPerPage": 15
        };
        $scope.selectedDriver = {
            "driver": {}
        };

        /**
         * This method retrieves all the picked shipments from cold storage
         * 
         */
        $scope.viewPickedShipments = function(tableState) {

            $scope.pTState = tableState;
            var pagination = tableState.pagination;
            $scope.index = pagination.start || 0;
            $scope.isPickedUpView = true;
            $scope.isReturnedView = false;
            $scope.shipmentState = CONSTANT.PICKED_SHIPMENTS;
            $scope.viewShipments();
        };

        /**
         * This method retrieves all the returned shipments to cold storage
         * 
         */
        $scope.viewReturnedShipments = function(tableState) {

            $scope.uState = tableState;
            var pagination = tableState.pagination;
            $scope.index = pagination.start || 0;
            $scope.isReturnedView = true;
            $scope.isPickedUpView = false;
            $scope.shipmentState = CONSTANT.RETURNED_SHIPMENTS;
            $scope.viewShipments();
        };

        /**
         * This method retirieves picked up/returned shipments from cold storage
         * 
         */
        $scope.viewShipments = function() {
            $scope.fromDate = formatDate($scope.date.fromDate);
            $scope.userId = $rootScope.userId;
            var input = angular.toJson({

                "dt": $scope.fromDate,
                "type": $scope.shipmentState,
                "index": $scope.index,
                "count": $scope.page.itemsPerPage
            });
            NProgress.start();
            console.log(input);
            ShipmentService.getColdStorage(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
        };

        $scope.retrieveShipmentsSuccessCallBack = function(data) {

            console.log(data);
            NProgress.done();
            if (data.responseCode === "1000") {
                $scope.shipments = [];
                $scope.shipments = data.storages;
                console.log($scope.drivers);
                $scope.setTotalPages(data.count);
                showAlert(CONSTANT.SUCCESS, "Cold Storage items retrieved successfully");
            } else {
                if ($scope.isViewRefresh) return;
                showAlert(CONSTANT.ERROR, "Failed to retrieve cold storage items");
            }
        };

        $scope.retrieveShipmentsErrorBack = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal error. Failed to cold storage items.");
        };

        $scope.tabSelected = function(shipmentState) {
            $scope.shipments = [];
            $scope.filtersChange(shipmentState);
        };

        $scope.filtersChange = function(currentState) {
            $scope.shipments = [];
            $scope.shipmentState = currentState;
            if ($scope.shipmentState === CONSTANT.PICKED_SHIPMENTS) {
                $scope.tab = 1;
                if (typeof $scope.pTState == 'undefined') {
                    $scope.isPickedUpView = true;
                } else {
                    $scope.pTState.pagination.start = 0;
                    $scope.viewPickedShipments($scope.pTState);
                }
            } else if ($scope.shipmentState === CONSTANT.RETURNED_SHIPMENTS) {
                $scope.tab = 2;
                if (typeof $scope.uState == 'undefined') {
                    $scope.isReturnedView = true;
                } else {
                    $scope.uState.pagination.start = 0;
                    $scope.viewReturnedShipments($scope.uState);
                }
            }
        };

        $scope.setTotalPages = function(count) {
            if ($scope.shipmentState === CONSTANT.PICKED_SHIPMENTS) {
                $scope.pTState.pagination.numberOfPages = $scope.getTotalPage(count);
            } else if ($scope.shipmentState === CONSTANT.RETURNED_SHIPMENTS) {
                $scope.uState.pagination.numberOfPages = $scope.getTotalPage(count);
            }
        };

        $scope.getTotalPage = function(totalItems) {
            var tPageQ = Math.floor(totalItems / $scope.page.itemsPerPage);
            var tPageM = totalItems % $scope.page.itemsPerPage;
            if (tPageM > 0) {
                tPageQ = tPageQ + 1;
            }
            return tPageQ;
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
    }


]);