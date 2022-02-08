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

var amountCollectedController = myApp.controller('CashReconReportController', ['$scope', 'CONSTANT', 'DriversService', '$rootScope', '$state', '$location', function($scope, CONSTANT, DriversService, $rootScope, $state, $location) {

    $scope.date = {
        "fromDate": new Date()
    };
    $scope.selectedDriver = { "driver": {} };

    $scope.amount = {
        "amtCollected": 0,
        "actualAmount": 0
    };

    $scope.distributors = [];

    $scope.iirs = [];

    $scope.app = {
        "pwd": "",
        "data": ""
    };

    $scope.formatAmount = function(amt) {
        return amt.toFixed(2);
    }

    $scope.openDialog = function(data) {

        if ($rootScope.currentPage != undefined && ($rootScope.currentPage.name == 'b2b.dashboard.cashrecon')) {
            return;
        }
        $("#creditNoteModal").on("shown.bs.modal", function() {
            $scope.app.data = data;
        });

        $('#creditNoteModal').on('hidden.bs.modal', function() {
            $scope.app.pwd = "";
            $scope.app.data = "";
        });

        $('#creditNoteModal').modal('show');
    };

    $scope.saveComment = function() {
        NProgress.start();
        $scope.app.data.approved = $scope.app.pwd;
        var input = angular.toJson({
            "ird": $scope.app.data
        });
        DriversService.saveApprovedBy(input, $scope.validateCashReconSC, $scope.validateCashReconEC);
    };

    $scope.validateCashReconSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode === "1000") {
            $('#creditNoteModal').modal('hide');
            $scope.getReconcile();
        } else {
            showAlert("Failed to save", "error");
        }
    };

    $scope.validateCashReconEC = function() {
        NProgress.done();
        showAlert("Internal Error. Failed to save", "error");
    };


    $scope.getReports = function() {
        window.open($rootScope.baseUrl + '/adm/dlinfireconcile/' + formatDate($scope.date.fromDate));
    };
    /**
     * Method to get drivers
     * 
     */
    $scope.getDrivers = function() {
        NProgress.start();
        var input = { "date": formatDate($scope.date.fromDate), "carrierId": $rootScope.userId };
        console.log(input);
        DriversService.getDriversByClient(input, $scope.getDriversByClientSC, $scope.getDriversByClientEC);
    };

    $scope.getDriversByClientSC = function(data) {
        NProgress.done();
        console.log(data);
        $scope.drivers = [];
        $scope.selectedDriver = { "driver": {} };
        $scope.amount = {
            "amtCollected": 0,
            "actualAmount": 0
        };
        if (data.responseCode === "1000") {
            $scope.drivers = data.drivers;
            if ($scope.drivers != null && $scope.drivers.length > 0) {
                $scope.selectedDriver.driver = $scope.drivers[0];
                showAlert(CONSTANT.SUCCESS, "Drivers retrieved successfully");
                $scope.getAmountCollectedByDriver();
            } else {
                showAlert(CONSTANT.INFO, "No drivers found");
            }
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get drivers");
        }
    };

    $scope.getDriversByClientEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get drivers");
    };

    $scope.getReconcile = function() {
        NProgress.start();
        var input = {
            "date": ($location.search()).date,
            "driverId": ($location.search()).driverId
        };
        console.log(input);
        DriversService.reconcileDetails(input, $scope.getReconcileSC, $scope.getReconcileEC);
    };

    $scope.getReconcileSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.iirs = data.details;
            if (data.details != null && data.details.length > 0) {
                // $scope.date = data.details[0].date;
                $scope.da = data.details[0].driverName;
            }

        } else {
            showAlert(CONSTANT.ERROR, "Failed to get drivers");
        }
    };

    $scope.getReconcileEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get response");
    };

    /**
     * This method retrives the total amount of all the shipments done by selected driver.
     * 
     */
    $scope.getAmountCollectedByDriver = function() {

        NProgress.start();
        var input = { "date": formatDate($scope.date.fromDate), "driverId": $scope.selectedDriver.driver.driverId, "carrierId": $rootScope.userId };
        console.log(input);
        DriversService.getAmtCollectedByDriver(input, $scope.getAmountCollectedByDriverSC, $scope.getAmountCollectedByDriverEC);
    };

    $scope.getAmountCollectedByDriverSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode == "1000") {
            $scope.amount.amtCollected = data.amount;
            //$scope.getShipmentDetails();
            showAlert(CONSTANT.SUCCESS, "Amount collected retrieved successfully");
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get amount collected");
        }
    };

    $scope.getAmountCollectedByDriverEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get amount collected");
    };

    /**
     * This method saves the total amount collected by selected driver.
     * 
     */
    $scope.saveActualAmount = function() {
        NProgress.start();
        var input = { "date": formatDate($scope.date.fromDate), "driverId": $scope.selectedDriver.driver.driverId, "carrierId": $rootScope.userId, "amount": $scope.amount.actualAmount };
        console.log(input);
        DriversService.saveActualAmount(input, $scope.saveActualAmountSC, $scope.saveActualAmountEC);
    };

    $scope.saveActualAmountSC = function(data) {
        NProgress.done();
        if (data.responseCode == "1000") {
            $scope.amount.actualAmount = 0;
            showAlert(CONSTANT.SUCCESS, "Actual amount saved successfully");
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get save actual amount");
        }
    };

    $scope.saveActualAmountEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get save actual amount");
    };

    $scope.onLoad = function() {
        //$scope.getDrivers();
        $scope.getReconcile();
    }

    $scope.onDateChange = function() {
        $scope.onLoad();
    }

    $scope.onLoad();
}]);