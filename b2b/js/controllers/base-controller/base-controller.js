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


var baseController = myApp.controller('BaseController', ['$scope', 'HelperService', '$state', '$rootScope', 'ShipmentService', '$http', 'CONSTANT', function($scope, HelperService, $state, $rootScope, ShipmentService, $http, CONSTANT) {

    $scope.notificationsCount = '';
    $scope.CONSTANT = CONSTANT;
    $scope.page = {
        "currentPage": 1,
        "totalPage": 0,
        "itemsPerPage": 10
    };

    $scope.app = {
        "pwd": ""
    };

    $scope.logout = function() {

        loaderStart();
        HelperService.destroy('pvruser');
        $state.go('index');
        loaderStop();
    };

    $scope.showNotifications = function() {

        $scope.nsNotification = angular.fromJson(HelperService.getNSNotification());
        $scope.neNotification = angular.fromJson(HelperService.getNENotification());
        $('#notificationModal').modal('show');
        $scope.notificationsCount = '';
    };

    $scope.showNotificationCount = function(count) {
        $scope.notificationsCount = count;
        $scope.$apply();
    };

    $scope.getTotalPage = function(totalItems) {
        var tPageQ = Math.floor(totalItems / $scope.page.itemsPerPage);
        var tPageM = totalItems % $scope.page.itemsPerPage;
        if (tPageM > 0) {
            tPageQ = tPageQ + 1;
        }
        return tPageQ;
    };

    $scope.getCarrierName = function(firstName, lastName) {
        if (lastName == null || lastName.trim() == '') {
            return firstName;
        } else {
            return firstName + " " + lastName;
        }
    };

    $scope.openAssignMenu = function() {

        if ($rootScope.currentPage != undefined && ($rootScope.currentPage.name == 'pvr.assignshipments' || $rootScope.currentPage.name == 'pvr.pbb7assignshipments')) {
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
        loaderStart();
        var input = angular.toJson({
            "carrierId": $rootScope.userId,
            "password": $scope.app.pwd
        });
        ShipmentService.validateShipmentAssign(input, $scope.validateAssignMenuSC, $scope.validateAssignMenuEC);
    };

    $scope.validateAssignMenuSC = function(data) {
        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $('#pwdModal').modal('hide');
            if ($rootScope.appId == 7) {
                $state.go('pvr.pbb7assignshipments');
            } else {
                $state.go('pvr.assignshipments');
            }
        } else {
            if (data.errors[0].code == "TI.0.3.135") {
                showAlert("Invalid password. Please try again", "error");
            } else {
                showAlert("Failed to validate.", "error");
            }

        }
    };

    $scope.validateAssignMenuEC = function() {
        loaderStop();
        showAlert("Internal Error. Failed to validate user", "error");
    };

    $scope.openOpsValidateMenu = function() {

        if ($rootScope.currentPage != undefined && ($rootScope.currentPage.name == 'pvr.liveops')) {
            return;
        }
        $("#opsPwdModal").on("shown.bs.modal", function() {

        });

        $('#opsPwdModal').on('hidden.bs.modal', function() {
            $scope.app = {
                "pwd": ""
            };
        });

        $('#opsPwdModal').modal('show');
    };

    $scope.validateOpsAccess = function() {
        loaderStart();
        var input = angular.toJson({
            "carrierId": $rootScope.userId,
            "password": $scope.app.pwd
        });
        ShipmentService.validateOpsAccess(input, $scope.validateOpsAccessSC, $scope.validateOpsAccessEC);
    };

    $scope.validateOpsAccessSC = function(data) {
        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $('#opsPwdModal').modal('hide');
            $state.go('pvr.liveops');
        } else {
            if (data.errors[0].code == "TI.0.3.135") {
                showAlert("Invalid password. Please try again", "error");
            } else {
                showAlert("Failed to validate.", "error");
            }

        }
    };

    $scope.validateOpsAccessEC = function() {
        loaderStop();
        showAlert("Internal Error. Failed to validate user", "error");
    };

    $scope.openColdStorageMenu = function() {

        if ($rootScope.currentPage != undefined && ($rootScope.currentPage.name == 'pvr.coldstorageinventory')) {
            return;
        }
        $("#CSPwdModal").on("shown.bs.modal", function() {

        });

        $('#CSPwdModal').on('hidden.bs.modal', function() {
            $scope.app = {
                "pwd": ""
            };
        });

        $('#CSPwdModal').modal('show');
    };

    $scope.validateCSInventoryMenu = function() {
        loaderStart();
        var input = angular.toJson({
            "carrierId": $rootScope.userId,
            "password": $scope.app.pwd
        });
        ShipmentService.validateShipmentAssign(input, $scope.validateCSInventoryMenuSC, $scope.validateCSInventoryMenuEC);
    };

    $scope.validateCSInventoryMenuSC = function(data) {
        loaderStop();
        console.log(data);
        if (data.responseCode === "1000") {
            $('#CSPwdModal').modal('hide');
            $state.go('pvr.coldstorageinventory');
        } else {
            if (data.errors[0].code == "TI.0.3.135") {
                showAlert("Invalid password. Please try again", "error");
            } else {
                showAlert("Failed to validate.", "error");
            }

        }
    };

    $scope.validateCSInventoryMenuEC = function() {
        loaderStop();
        showAlert("Internal Error. Failed to validate user", "error");
    };
}]);