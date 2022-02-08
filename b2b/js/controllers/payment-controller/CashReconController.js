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

var amountCollectedController = myApp.controller('AmountCollectedController', ['$scope', 'CONSTANT', 'DriversService', '$rootScope', '$state', function($scope, CONSTANT, DriversService, $rootScope, $state) {

    $scope.date = {
        "fromDate": new Date()
    };
    $scope.selectedDriver = { "driver": {} };

    $scope.amount = {
        "amtCollected": 0,
        "actualAmount": 0
    };

    $scope.app = {
        "cash": "",
        "data": ""
    };

    $scope.distributors = [];

    $scope.iirs = [];

    $scope.formatAmount = function(amt) {
        return amt.toFixed(2);
    }

    $scope.yourDynamicURL = '/b2b/index.html#/cashreconreport?driverId=';

    $scope.sendtosap = function(data) {
        NProgress.start();
        var input = { "driverId": data.driverId, "date": formatDate($scope.date.fromDate) };
        console.log(input);
        DriversService.sendtoSAP(input, $scope.sendToSapSC, $scope.sendToSapEC);
    };

    $scope.sendToSapSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode === "1000") {

        } else {
            showAlert("Failed to save", "error");
        }
    };

    $scope.sendToSapEC = function() {
        NProgress.done();
        showAlert("Internal Error. Failed to save", "error");
    };

    $scope.openDialog = function(data) {


        $("#addAmountModal").on("shown.bs.modal", function() {
            $scope.app.data = data;
        });

        $('#addAmountModal').on('hidden.bs.modal', function() {
            $scope.app.cash = "";
            $scope.app.data = "";
        });

        $('#addAmountModal').modal('show');
    };

    $scope.save = function() {
        NProgress.start();
        $scope.app.data.reconciledAmount = $scope.app.cash;
        var input = angular.toJson({
            "reconcile": $scope.app.data
        });
        DriversService.saveHandedAmount(input, $scope.validateCashReconSC, $scope.validateCashReconEC);
    };

    $scope.validateCashReconSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode === "1000") {
            $('#addAmountModal').modal('hide');
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
        var input = { "date": formatDate($scope.date.fromDate) };
        console.log(input);
        DriversService.getReconcile(input, $scope.getReconcileSC, $scope.getReconcileEC);
    };

    $scope.getReconcileSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode === "1000") {
            $scope.iirs = data.iirs;
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get drivers");
        }
    };

    $scope.getReconcileEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get response");
    };

    $scope.getFromDate = function(date) {
        return formatDate(date);
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
        //  $scope.getDrivers();
        $scope.getReconcile();
    }

    $scope.onDateChange = function() {
        $scope.onLoad();
    }

    $scope.onLoad();
}]);