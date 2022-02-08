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
 
var allShipmentsController = myApp.controller('AllShipmentsController', ['$rootScope', '$scope', '$interval', 'CONSTANT', 'ShipmentService', 'APP', 'DriversService', function($rootScope, $scope, $interval, CONSTANT, ShipmentService, APP, DriversService) {

    $scope.date = {
        "fromDate": new Date(),
        "toDate": new Date()
    };

    $scope.index = 0;
    /**
    * This method retrives the shipments done based on selected date.
    * 
    */
    $scope.viewShipments = function(tableState) {

        $scope.fromDate = formatDate($scope.date.fromDate);
        $scope.tableState = tableState;
        var pagination = tableState.pagination;
        $scope.index = pagination.start || 0;
        var input = angular.toJson({

            "fromDate": $scope.fromDate,
            "toDate": null,
            "type": CONSTANT.CREATED_SHIPMENTS,
            "locality": null,
            "index": $scope.index,
            "count": 10,
            "userId": $rootScope.userId
        });
        loaderStart();
        ShipmentService.retrievecashipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
    };

    $scope.retrieveShipmentsSuccessCallBack = function(data) {

        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.jobs = [];
            $scope.jobs = data.jobs;
            $scope.getTotalPage(data.count);
            showAlert("Shipments retrieved successfully", "success");
        } else {
            showAlert("Failed to retrieve shipments", "error");
        }
    };

    $scope.retrieveShipmentsErrorBack = function() {
        loaderStop();
        showAlert("Internal error. Failed to retrieve shipments.", "error");
    };
    
    $scope.getTotalPage = function(totalItems) {
        var tPageQ = Math.floor(totalItems / $scope.page.itemsPerPage);
        var tPageM = totalItems % $scope.page.itemsPerPage;
        if (tPageM > 0) {
            tPageQ = tPageQ + 1;
        }
        $scope.tableState.pagination.numberOfPages = tPageQ;
        return tPageQ;
    };
    
    $scope.applyFilter = function() {
        $scope.tableState.pagination.start = 0;
        $scope.viewShipments($scope.tableState);
    };
    
    $scope.getStatus = function(job) {
        if (job.driver == null) {
            return "Unassigned";
        }
        
        if (job.status.completed == 0) {
            return "Completed";
        }
        
        if (job.status.cancelled == 0) {
            return "Cancelled";
        }
        
        if (job.status.expired == 0) {
            return "Expired";
        }
        var statusArr = job.status.flow.split("-");
        if (statusArr[statusArr.length - 1] == "AS" ||
                            statusArr[statusArr.length - 1] == "RC" ||
                            statusArr[statusArr.length - 1] == "CP") {
            return "Pending";
        }
        
        if (statusArr[statusArr.length - 1] == "ST" ||
                            statusArr[statusArr.length - 1] == "ET") {
            return "Ongoing";
        }
        
        if (statusArr[statusArr.length - 1] == "TA") {
            return "Turned Away";
        }
    };

    angular.element(document).ready(function() {
        $.Template.layout.activate();
    });
}]);