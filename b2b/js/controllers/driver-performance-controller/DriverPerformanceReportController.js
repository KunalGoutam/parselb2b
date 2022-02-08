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

var amountCollectedController = myApp.controller('DriverPerformanceReportController', ['$scope', 'CONSTANT', 'DriversService', '$rootScope', '$state', '$location', function($scope, CONSTANT, DriversService, $rootScope, $state, $location) {

    $scope.date = {
        "fromDate": new Date(),
        "toDate": new Date()
    };
    $scope.selectedDriver = {
        driver: {}
    };
    $scope.drivers = [];
    $scope.initializeReportData = function() {
        $scope.reports = {
            "assigned": 0,
            "delivered": 0,
            "rejected": 0,
            "turnedAway": 0,
            "cod": 0,
            "mpos": 0,
            "wallet": 0,
            "paylink": 0,
            "prepaid": 0
        };
    };

    /**
     * This method retrieves the drivers based on logged in manager
     */

    $scope.getDrivers = function() {
        var input = {
            "fromDate": formatDate($("#datePicker").data("DateTimePicker").date()),
            "toDate": formatDate($("#datePicker").data("DateTimePicker").date()),
            "managerId": $rootScope.userId
        };
        console.log(input);
        NProgress.start();
        $scope.initializeReportData();
        DriversService.getQuantumDrivers(input, $scope.getDriversSC, $scope.getDriversEC);
    };

    $scope.getDriversSC = function(data) {
        NProgress.done();
        $scope.drivers = [];
        if (data.responseCode == "1000") {
            console.log(data);
            if (data.drivers != null && data.drivers.length > 0) {
                $scope.drivers = data.drivers;
                $scope.selectedDriver.driver = data.drivers[0];
                showAlert(CONSTANT.SUCCESS, "Drivers Retrieved successfully");
            } else {
                showAlert(CONSTANT.SUCCESS, "No drivers found");
            }
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get drivers");
        }
    };

    $scope.getDriversEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get drivers");
    };

    /**
     * This method retieves the shipment summary
     */
    $scope.getReports = function() {
        /*var driversIds = [];
        driversIds.push($scope.selectedDriver.driver.userId);
        var input = {
            "fromDate": formatDate($("#datePicker").data("DateTimePicker").date()),
            "toDate": formatDate($("#datePicker").data("DateTimePicker").date()),
            "driverIds": driversIds
        };
        console.log(input);
        NProgress.start();
        $scope.initializeReportData();
        ReportService.getQuantumReports(input, $scope.getReportsSC, $scope.getReportsEC);*/
        window.open($rootScope.baseUrl + '/drivr/dldap?date=' + formatDate($scope.date.fromDate));
    };

    $scope.getReportsSC = function(data) {
        NProgress.done();
        if (data.responseCode == "1000") {
            console.log(data);
            if (data.qdrs != null && data.qdrs.length > 0) {
                $scope.reports.assigned = data.qdrs[0].assigned;
                $scope.reports.delivered = data.qdrs[0].delivered;
                $scope.reports.rejected = data.qdrs[0].rejected;
                $scope.reports.turnedAway = data.qdrs[0].turnedAway;
                $scope.reports.cod = data.qdrs[0].cod;
                $scope.reports.mpos = data.qdrs[0].mpos;
                $scope.reports.wallet = data.qdrs[0].wallet;
                $scope.reports.paylink = data.qdrs[0].paylink;
                $scope.reports.prepaid = data.qdrs[0].prepaid;
            }
            showAlert(CONSTANT.SUCCESS, "Reports generated successfully");
        } else {
            showAlert(CONSTANT.ERROR, "Failed to get reports");
        }
    };

    $scope.getReportsEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal error. Failed to get reports");
    };

    $(document).ready(function() {

        $('#datePicker').datetimepicker({
            format: 'DD-MM-YYYY',
            ignoreReadonly: true,
            defaultDate: new Date()
        });

        // $scope.getDrivers();
        //$scope.initializeReportData();
    });
}]);