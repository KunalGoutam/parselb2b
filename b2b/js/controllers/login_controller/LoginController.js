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
 
var shipmentController = myApp.controller('LoginController', ['$rootScope', '$scope', '$http', '$location', 'HelperService', '$state', 'CONSTANT','ShipmentService','SecurityService',
    function($rootScope, $scope, $http, $location, HelperService, $state, CONSTANT, ShipmentService, SecurityService) {

        $scope.email = '';
        $scope.password = '';

        $scope.doLogin = function() {

            NProgress.start();
            var input = angular.toJson({
                "username": $scope.email,
                "password": $scope.password
            });
            SecurityService.login(input, $scope.loginSC, $scope.loginEC);
        };

        $scope.loginSC = function(data) {
                NProgress.done();
                if (data.responseCode === "1000") {
                    if (data.user.userType === 2) {
                        $rootScope.username = data.user.username;
                        $rootScope.userId = data.user.userId;
                        $rootScope.userType = data.user.userType;
                        $rootScope.appId = data.app.appId;
                        $rootScope.isOneTouchUser = false;
                        $rootScope.clientId = data.clientId;
                        $rootScope.name = data.user.firstName + " " + data.user.lastName;
                        data.user.app = data.app;
                        data.user.app.clientId = data.clientId;
                        HelperService.set("pvruser", angular.toJson(data.user));
                        //$state.go('b2b.dashboard.shipments'); 
                        if (data.app.appId == 7) {
                            $state.go('b2b.dashboard.shipments'); 
                        } if (data.app.appId == 3) {
                            $state.go('b2b.dashboard.jioshipments'); 
                        } if (data.app.appId == 5) {
                            $state.go('b2b.dashboard.otshipments'); 
                        }
                    }else   if (data.user.userType === 8) {
                        $rootScope.username = data.user.username;
                        $rootScope.userId = data.user.userId;
                        $rootScope.appId = data.app.appId;
                        $rootScope.isOneTouchUser = false;
                        $rootScope.clientId = data.clientId;
                        $rootScope.name = data.user.firstName + " " + data.user.lastName;
                        data.user.app = data.app;
                        $rootScope.userType = data.user.userType;
                        data.user.app.clientId = data.clientId;
                        HelperService.set("pvruser", angular.toJson(data.user));
                        if (data.app.appId == 7) {
                            $state.go('b2b.dashboard.shipments'); 
                        } if (data.app.appId == 3) {
                            $state.go('b2b.dashboard.jioshipments'); 
                        } if (data.app.appId == 5) {
                            $state.go('b2b.dashboard.otshipments'); 
                        }
                    } else  if (data.user.userType === 9) {
                        $rootScope.username = data.user.username;
                        $rootScope.userId = data.user.userId;
                        $rootScope.appId = data.app.appId;
                        $rootScope.isOneTouchUser = false;
                        $rootScope.clientId = data.clientId;
                        $rootScope.userType = data.user.userType;
                        $rootScope.name = data.user.firstName + " " + data.user.lastName;
                        data.user.app = data.app;
                        data.user.app.clientId = data.clientId;
                        HelperService.set("pvruser", angular.toJson(data.user));
                        if (data.app.appId == 7) {
                            $state.go('b2b.dashboard.shipments'); 
                        } if (data.app.appId == 3) {
                            $state.go('b2b.dashboard.jioshipments'); 
                        } if (data.app.appId == 5) {
                            $state.go('b2b.dashboard.otshipments'); 
                        }
                    } else  if (data.user.userType === 10) {
                        $rootScope.username = data.user.username;
                        $rootScope.userId = data.user.userId;
                        $rootScope.appId = data.app.appId;
                        $rootScope.isOneTouchUser = false;
                        $rootScope.userType = data.user.userType;
                        $rootScope.clientId = data.clientId;
                        $rootScope.name = data.user.firstName + " " + data.user.lastName;
                        data.user.app = data.app;
                        data.user.app.clientId = data.clientId;
                        HelperService.set("pvruser", angular.toJson(data.user));
                        if (data.app.appId == 7) {
                            $state.go('b2b.dashboard.shipments'); 
                        } if (data.app.appId == 3) {
                            $state.go('b2b.dashboard.jioshipments'); 
                        } if (data.app.appId == 5) {
                            $state.go('b2b.dashboard.otshipments'); 
                        }
                    }else {
                        showAlert(CONSTANT.ERROR, "Login Failed. The credentials doesnot belong to carrier.");
                    }
                } else {
                    if (data.errors[0].code == 'TI.0.1.3') {
                        showAlert(CONSTANT.ERROR, "Login failed. Invalid username or password");
                    } else {
                        showAlert(CONSTANT.ERROR, "Login failed");
                    }
                }
        };

        $scope.loginEC = function(data) {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal error. Please try again.");
        };
    }
]);