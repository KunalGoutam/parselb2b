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
 
var inventoryController = myApp.controller('ReturnedSkuController', ['$scope', 'ShipmentService', 'DriversService', 'CONSTANT', '$rootScope',
    function($scope, ShipmentService, DriversService, CONSTANT, $rootScope) {

        $scope.date = {
            "fromDate": new Date()
        };
        $scope.slots = [];
        $scope.selectedSlot = {
            "slot": {}
        };
        $scope.isReturnedView = false;
        $scope.viewReturnedShipments = function(tableState) {

            $scope.uState = tableState;
            var pagination = tableState.pagination;
            $scope.index = pagination.start || 0;
            $scope.shipmentState = CONSTANT.RETURNED_SHIPMENTS;
            $scope.viewShipments();
        };

        $scope.viewShipments = function() {
            $scope.fromDate = formatDate($scope.date.fromDate);
            $scope.userId = $rootScope.userId;
            var input = angular.toJson({

                "dt": $scope.fromDate,
                "type": $scope.shipmentState,
                "index": $scope.index,
                "count": 15,
                "slot": $scope.selectedSlot.slot.startTime + "-" + $scope.selectedSlot.slot.stopTime
            });
            loaderStart();
            console.log(input);
            ShipmentService.getColdStorageRecords(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
        };

        $scope.retrieveShipmentsSuccessCallBack = function(data) {

            console.log(data);
            loaderStop();
            if (data.responseCode === "1000") {
                $scope.shipments = [];
                $scope.shipments = data.storages;
                console.log($scope.drivers);
                $scope.setTotalPages(data.count);
                showAlert("Cold Storage items retrieved successfully", "success");
            } else {
                if ($scope.isViewRefresh) return;
                showAlert("Failed to retrieve cold storage items", "error");
            }
        };

        $scope.retrieveShipmentsErrorBack = function() {
            loaderStop();
            showAlert("Internal error. Failed to cold storage items.", "error");
        };

        $scope.setTotalPages = function(count) {
            if ($scope.shipmentState === CONSTANT.PICKED_SHIPMENTS) {
                $scope.pTState.pagination.numberOfPages = $scope.getTotalPage(count);
            } else if ($scope.shipmentState === CONSTANT.RETURNED_SHIPMENTS) {
                $scope.uState.pagination.numberOfPages = $scope.getTotalPage(count);
            }
        };

        $scope.updateColdStorage = function() {
            loaderStart();
            $scope.updatedCS = [];
            
            for (var i = 0; i < $scope.shipments.length; i++) {
                var returnObj = { 
                     "shipmentId" : 0,
                     "returnSapCode" : 0,
                     "returnQty" : 0,
                     "sku" : "",
                     "type" : 2
                };
                returnObj.shipmentId = $scope.shipments[i].shipmentId;
                returnObj.returnSapCode = $scope.shipments[i].returnSapCode;
                returnObj.returnQty = $scope.shipments[i].returnQty;
                returnObj.sku = $scope.shipments[i].sku;
                returnObj.type = 2;
                $scope.updatedCS.push(returnObj);
            }
            var input = angular.toJson({
                "storages": $scope.updatedCS
            });
            console.log(input);
            ShipmentService.updateColdStorage(input, $scope.updateColdStorageSC, $scope.updateColdStorageEC);
        };

        $scope.updateColdStorageSC = function(data) {

            console.log(data);
            loaderStop();
            if (data.responseCode === "1000") {
                $scope.viewShipments();
                showAlert("Cold Storage items updated successfully", "success");
            } else {
                if ($scope.isViewRefresh) return;
                showAlert("Failed to update cold storage items", "error");
            }
        };

        $scope.updateColdStorageEC = function() {
            loaderStop();
            showAlert("Internal error. Failed to update storage items.", "error");
        };

        $scope.filtersChange = function() {
            $scope.shipments = [];
            if (typeof $scope.uState == 'undefined') {
                $scope.isReturnedView = true;
            } else {
                $scope.uState.pagination.start = 0;
                $scope.viewReturnedShipments($scope.uState);
            }
        };

        $scope.getSlots = function() {
            loaderStart();
            var input = angular.toJson({"carrierId": $rootScope.userId});
            console.log(input);
            ShipmentService.getSlotsByClient(input, $scope.getSlotsSC, $scope.getSlotsEC);
        };
        
        $scope.getSlotsSC = function(data) {
            loaderStop();
            console.log(data);
            $scope.slots = [];
            if (data.responseCode == "1000") {
                $scope.slots = data.slots;
                if ($scope.slots != null && $scope.slots.length > 0) {
                    $scope.selectedSlot.slot = $scope.slots[0];
                    showAlert("Slots retrieved successfully", "success");
                    $scope.isReturnedView = true;
                } else {
                    showAlert("No slots found for this user", "information");
                }
                
            } else {
                showAlert("Failed to get slots", "error");
            }
        };
        
        $scope.getSlotsEC = function() {
            loaderStop();
            showAlert("Internal Error. Failed to get slots", "error");
        };

        $scope.downloadReturnedSKUXls = function() {
            
            var link = document.createElement("a");
            var fromDate = formatDate($scope.date.fromDate);
            window.open($rootScope.baseUrl + '/adm/csitemsreport/' + fromDate + '/' + $scope.selectedSlot.slot.startTime + '-' + $scope.selectedSlot.slot.stopTime + '/' + 2);
        };

        $scope.getSlots();
    }
]);