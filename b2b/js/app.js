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
'use strict';

var myApp = angular.module('myApp', [
    'ui.router',
    'ngWebsocket',
    'myApp.constants',
    'myApp.filters',
    'myApp.directives',
    'ngSanitize',
    'ui.select',
    'smart-table',
   
]);

var directives = angular.module('myApp.directives', []);
var filters = angular.module('myApp.filters', []);
var constants = angular.module('myApp.constants', []);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'partials/login_view/login.html',
            controller: 'LoginController'
        }).state('cashreconreport', {
            url: '/cashreconreport?driverId=',
            templateUrl: 'partials/payment_view/cash-recon-report.html',
            controller: 'CashReconReportController'
        }).state('b2b', {
            url: '/home',
            templateUrl: 'partials/base/base.html',
            controller: 'DashboardController'
        }).state('b2b.dashboard', {
            url: '/dashboard',
            templateUrl: 'partials/base/dashboard.html',
            controller: 'DashboardController'
        }).state('b2b.dashboard.shipments', {
            url: '/shipments',
            templateUrl: 'partials/shipments/shipments.html',
            controller: 'ShipmentsController'
        }).state('b2b.dashboard.jioshipments', {
            url: '/jioshipments',
            templateUrl: 'partials/shipments/jioshipment_view/shipments.html',
            controller: 'Pbb2ShipmentsController'
        }).state('b2b.dashboard.otshipments', {
            url: '/otshipments',
            templateUrl: 'partials/shipments/ot_view/shipments.html',
            controller: 'OTShipmentsController'
        }).state('b2b.dashboard.viewpendingshipments', {
            url: '/pendingshipments',
            templateUrl: 'partials/shipments/pendingshipments.html',
            controller: 'PendingShipmentsController'
        }).state('b2b.dashboard.slotconfiguration', {
            url: '/slotconfiguration',
            templateUrl: 'partials/shipments/slot-configuration.html',
            controller: 'AssignShipmentSlotController'
        }).state('b2b.dashboard.assignshipments', {
            url: '/assignshipments',
            templateUrl: 'partials/shipments/assign-shipment.html',
            controller: 'Pbb7AssignShipmentController'
        }).state('b2b.dashboard.reassignshipments', {
            url: '/reassignshipments',
            templateUrl: 'partials/shipments/reassign-shipment.html',
            controller: 'Pbb7ReAssignShipmentController'
        }).state('b2b.dashboard.cashrecon', {
            url: '/cashrecon',
            templateUrl: 'partials/payment_view/cash-recon.html',
            controller: 'AmountCollectedController'
        }).state('b2b.dashboard.inventory', {
            url: '/inventory',
            templateUrl: 'partials/inventory_view/inventory.html',
            controller: 'InventoryController'
        }).state('b2b.dashboard.oldreturn', {
            url: '/oldreturn',
            templateUrl: 'partials/inventory_view/oldreturn.html',
            controller: 'OldReturnController'
        }).state('b2b.dashboard.creditnote', {
            url: '/creditnote',
            templateUrl: 'partials/inventory_view/creditnote.html',
            controller: 'CreditNoteController'
        }).state('b2b.dashboard.quantum-reports', {
            url: '/reports',
            templateUrl: 'partials/reports-section/sku-reports.html',
            controller: 'QuantumReportsController'
        }).state('b2b.dashboard.sku-reports', {
            url: '/skureports',
            templateUrl: 'partials/reports-section/return-sku-reports.html',
            controller: 'SKUReportsController'
        }).state('b2b.dashboard.da-performance', {
            url: '/daperformance',
            templateUrl: 'partials/driver_performance_view/driver-performance-report.html',
            controller: 'DriverPerformanceReportController'
        }).state('b2b.dashboard.da-distance', {
            url: '/dadistancetracker',
            templateUrl: 'partials/driver_performance_view/driver-distance.html',
            controller: 'DriverDistanceController'
        }).state('b2b.dashboard.drivers', {
            url: '/drivers',
            templateUrl: 'partials/usermanagement/drivers.html',
            controller: 'DriversController'
        }).state('b2b.dashboard.managers', {
            url: '/managers',
            templateUrl: 'partials/usermanagement/managers.html',
            controller: 'ManagersController'
        }).state('b2b.dashboard.da-arrival', {
            url: '/arrival',
            templateUrl: 'partials/driver_performance_view/driver-arrival.html',
            controller: 'DriverArrivalController'
        }).state('b2b.dashboard.return_management', {
            url: '/return_management',
            templateUrl: 'partials/return_management/return_management.html',
            controller: 'InventoryController'
        }).state('b2b.dashboard.approve_route', {
            url: '/approve_route',
            templateUrl: 'partials/approve_adhoc_routes/approve_route.html',
            controller: 'Pbb7AssignShipmentController'
        }).state('b2b.dashboard.escalation', {
            url: '/escalation',
            templateUrl: 'partials/escalation/escalation.html',
            controller: 'Pbb7AssignShipmentController'
        }).state('b2b.dashboard.escalationDC', {
            url: '/escalationdc',
            templateUrl: 'partials/escalation/escalation_dc.html',
            controller: 'Pbb7AssignShipmentController'
        }).state('b2b.dashboard.adhoc_route', {
            url: '/adhoc_route',
            templateUrl: 'partials/adhoc_routes/adhoc_route.html',
            controller: 'Pbb7AssignShipmentController'
        }).state('b2b.dashboard.approve_adhoc_drivers', {
            url: '/approve_adhoc_drivers',
            templateUrl: 'partials/approve_adhoc_driver/approve_adhoc_drivers.html',
            controller: 'Pbb7AssignShipmentController'
        }).state('b2b.dashboard.confirm_dispatch', {
            url: '/confirm_dispatch',
            templateUrl: 'partials/confirm_dispatch/confirm_dispatch.html',
            controller: 'Pbb7AssignShipmentController'
        });

    $urlRouterProvider.otherwise('/');
}]);

myApp.run(['$rootScope', 'HelperService', '$state', 'SocketService', '$http', function($rootScope, HelperService, $state, SocketService, $http) {

    $http.get('resources/Config.properties').then(function(response) {
        if (Number(response.data.ENV) === 1) {
            $rootScope.baseUrl = "https://pvr.parsel.in/pbb";
            HelperService.set("ENV", 1);
        } else if (Number(response.data.ENV) === 2) {
            // $rootScope.baseUrl = "https://live.parsel.in/pbb";
            HelperService.set("ENV", 2);
        } else if (Number(response.data.ENV) === 3) {
            $rootScope.baseUrl = "http://ec2-3-109-211-83.ap-south-1.compute.amazonaws.com/pbb";
            HelperService.set("ENV", 3);
        } else if (Number(response.data.ENV) === 4) {
            $rootScope.baseUrl = "https://live.parsel.in/pbb";
            HelperService.set("ENV", 4);
        } else if (Number(response.data.ENV) === 5) {
            $rootScope.baseUrl = "https://dev.parsel.in/pbb";
            $rootScope.wsUrl = 'wss://dev.parsel.in/PVRSocket/pvrsock?uId=';
            HelperService.set("ENV", 5);
        } else if (Number(response.data.ENV) === 6) {
            $rootScope.baseUrl = "http://dev.parsel.in:8080/pbb";
            HelperService.set("ENV", 6);
        } else if (Number(response.data.ENV) === 7) {
            $rootScope.baseUrl = "https://pvr.parsel.in/pbbt";
            HelperService.set("ENV", 7);
        } else if (Number(response.data.ENV) === 8) {
            $rootScope.baseUrl = "https://infibeam.parsel.in/pbb";
            HelperService.set("ENV", 8);
        } else if (Number(response.data.ENV) === 9) {
            $rootScope.baseUrl = "http://61.12.78.204/pbb";
            HelperService.set("ENV", 9);
        } else if (Number(response.data.ENV) === 10) {
            $rootScope.baseUrl = "http://3.7.184.103/pbb";
            HelperService.set("ENV", 10);
        }
    });

    $rootScope.userId = 0;
    $rootScope.appId = 0;
    $rootScope.username = "";
    $rootScope.clientId = 0;
    $rootScope.locality = "";
    $rootScope.isMyntra = false;
    $rootScope.name = "";
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (HelperService.isLogged('pvruser')) {
            var user = HelperService.get('pvruser');
            var userObj = angular.fromJson(user);
            $rootScope.userId = userObj.userId;
            $rootScope.appId = userObj.app.appId;
            $rootScope.userType =  userObj.userType;
            $rootScope.clientId = userObj.app.clientId;
            $rootScope.locality = userObj.locality;
            $rootScope.name = userObj.firstName + " " + userObj.lastName;
            $rootScope.currentPage = toState;
            if ($rootScope.appId == 5) {
                $rootScope.isOneTouchUser = true;
            }
            if ($rootScope.userId == 2516) {
                $rootScope.isMyntra = true;
            }
            $rootScope.user = userObj;
            $rootScope.username = userObj.email;
            var env = HelperService.get('ENV');
            if (env == 1) {
                $rootScope.baseUrl = "https://pvr.parsel.in/pbb";
                $rootScope.wsUrl = 'wss://pvr.parsel.in/PVRSocket/pvrsock?uId=';
                // SocketService.initializeConnection();
            } else if (env == 2) {
                // $rootScope.baseUrl = "https://live.parsel.in/pbb";
                $rootScope.wsUrl = 'ws://live.parsel.in/PVRSocket/pvrsock?uId='; // 'ws://live.parsel.in:8080/PVRSocket/pvrsock?uId=';
                //  SocketService.initializeConnection();
            } else if (env == 3) {
                $rootScope.baseUrl = "http://ec2-3-109-211-83.ap-south-1.compute.amazonaws.com/pbb";
                $rootScope.wsUrl = 'ws://ec2-3-109-211-83.ap-south-1.compute.amazonaws.com/PVRSocket/pvrsock?uId='; // 'ws://live.parsel.in:8080/PVRSocket/pvrsock?uId=';
                //  SocketService.initializeConnection();
            } else if (env == 4) {
                $rootScope.baseUrl = "https://live.parsel.in/pbb";
                //$rootScope.wsUrl = 'ws://52.74.192.212:8080/PVRSocket/pvrsock?uId='; // 'ws://live.parsel.in:8080/PVRSocket/pvrsock?uId=';
                //SocketService.initializeConnection();
            } else if (env == 5) {
                $rootScope.baseUrl = "https://dev.parsel.in/pbb";
            } else if (env == 6) {
                $rootScope.baseUrl = "http://dev.parsel.in:8080/pbb";
            } else if (env == 7) {
                $rootScope.baseUrl = "https://pvr.parsel.in/pbbt";
            } else if (env == 8) {
                $rootScope.baseUrl = "https://infibeam.parsel.in/pbb";
            } else if (env == 9) {
                $rootScope.baseUrl = "http://61.12.78.204/pbb";
            } else if (env == 10) {
                $rootScope.baseUrl = "http://3.7.184.103/pbb";
            }
            if (angular.element("#shipments").scope() != undefined) {
                angular.element("#shipments").scope().cancelTimer();
            } else if (angular.element("#pbb2shipment").scope() != undefined) {
                angular.element("#pbb2shipment").scope().cancelTimer();
            } else if (angular.element("#pbb3shipment").scope() != undefined) {
                angular.element("#pbb3shipment").scope().cancelTimer();
            } else if (angular.element("#shipmentBooking").scope() != undefined) {
                angular.element("#shipmentBooking").scope().cancelNearByDriversTimer();
            } else if (angular.element("#pqShipments").scope() != undefined) {
                angular.element("#pqShipments").scope().cancelTimer();
            } else if (angular.element("#liveops").scope() != undefined) {
                angular.element("#liveops").scope().cancelTimer();
            }
        } else {
            var isNavigatingToIndex = toState.name === "index";
            if (!isNavigatingToIndex) {
                $state.go("index");
            }
        }
    });
}]);