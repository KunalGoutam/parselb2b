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

var amountCollectedController = myApp.controller('DriverDistanceController', ['$scope', 'CONSTANT', 'DriversService', '$rootScope', '$state', function($scope, CONSTANT, DriversService, $rootScope, $state) {

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

    $scope.getDistanceReport = function() {
        NProgress.start();
        var input = { "date": formatDate($scope.date.fromDate) };
        console.log(input);
        DriversService.getDistanceTravelled(input, $scope.getDistanceReportSC, $scope.getDistanceReportEC);
    };

    $scope.getDistanceReportSC = function(data) {
        NProgress.done();
        // console.log(data);
        if (data.responseCode === "1000") {
            $scope.ddts = data.ddts;
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get drivers");
        }
    };

    $scope.getDistanceReportEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get response");
    };

    $scope.getDistance = function(job) {

        if (job > 0) {
            return job / 1000;
        }
    };

    $scope.onLoad = function() {
        //  $scope.getDrivers();
        $scope.getDistanceReport();
    }

    $scope.onDateChange = function() {
        $scope.onLoad();
    }

    $scope.onLoad();
}]);