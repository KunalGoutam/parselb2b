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


var dashboardController = myApp.controller('DashboardController', ['$rootScope', '$scope', 'ShipmentService', '$state', 'CONSTANT', function($rootScope, $scope, ShipmentService, $state, CONSTANT) {


    $scope.openAssignMenu = function() {
        if ($rootScope.currentPage != undefined && ($rootScope.currentPage.name == 'b2b.dashboard.assignshipments')) {
            return;
        }
        $("#pwdModal").on("shown.bs.modal", function() {

        });

        $('#pwdModal').on('hidden.bs.modal', function() {
            $scope.app = {
                "pwd": ""
            };
        });

        $('#pwdModal').modal('show');
    };

    $scope.validateShipmentAssign = function() {
        NProgress.start();
        var input = angular.toJson({
            "carrierId": $rootScope.userId,
            "password": $scope.app.pwd
        });
        ShipmentService.validateShipmentAssign(input, $scope.validateAssignMenuSC, $scope.validateAssignMenuEC);
    };

    $scope.validateAssignMenuSC = function(data) {
        NProgress.done();
        console.log(data);
        if (data.responseCode === "1000") {
            $('#pwdModal').modal('hide');
            if ($rootScope.appId == 7) {
                $state.go('b2b.dashboard.assignshipments');
            } else if ($rootScope.appId == 3) {
                $state.go('b2b.dashboard.assignshipments');
            }
        } else {
            if (data.errors[0].code == "TI.0.3.135") {
                showAlert(CONSTANT.ERROR, "Invalid password. Please try again");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to validate.");
            }

        }
    };

    $scope.validateAssignMenuEC = function() {
        NProgress.done();
        showAlert(CONSTANT.ERROR, "Internal Error. Failed to validate user");
    };

    $scope.openCashReconMenu = function() {

        if ($rootScope.currentPage != undefined && ($rootScope.currentPage.name == 'b2b.dashboard.cashrecon')) {
            return;
        }
        $("#reconpwdModal").on("shown.bs.modal", function() {

        });

        $('#reconpwdModal').on('hidden.bs.modal', function() {
            $scope.app = {
                "pwd": ""
            };
        });

        $('#reconpwdModal').modal('show');
    };

    $scope.validateCashRecon = function() {
        loaderStart();
        var input = angular.toJson({
            "carrierId": $rootScope.userId,
            "password": $scope.app.pwd
        });
        ShipmentService.validateShipmentAssign(input, $scope.validateCashReconSC, $scope.validateCashReconEC);
    };

    $scope.validateCashReconSC = function(data) {
        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $('#reconpwdModal').modal('hide');
            /*if ($rootScope.appId == 7) {
                $state.go('pvr.pbb7assignshipments');
            } else {
                $state.go('pvr.assignshipments');
            }*/
            $state.go('b2b.dashboard.cashrecon');
        } else {
            if (data.errors[0].code == "TI.0.3.135") {
                showAlert("Invalid password. Please try again", "error");
            } else {
                showAlert("Failed to validate.", "error");
            }

        }
    };

    $scope.validateCashReconEC = function() {
        loaderStop();
        showAlert("Internal Error. Failed to validate user", "error");
    };


}]);