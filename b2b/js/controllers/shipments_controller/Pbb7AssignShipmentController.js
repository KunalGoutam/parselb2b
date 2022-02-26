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

var pbb7assignShipmentController = myApp.controller('Pbb7AssignShipmentController', ['$scope', 'ShipmentService', 'DriversService', 'CONSTANT', '$rootScope',
    function($scope, ShipmentService, DriversService, CONSTANT, $rootScope) {

        $scope.selectedDriver = {
            "driver": {}
        };

        $scope.selectedDc = {
            "dc": ''
        };

        $scope.app = {
            "pwd": ''
        };
        $scope.selectedRoute = {
            "route": ''
        };
        $scope.selectedVehicle = {
            "vehicle": {}
        };
        $scope.routes = [];
        $scope.selectedShipments = [];
        $scope.shipmentCount = 0;
        $scope.selectedHub = {
            "hub": null
        };
        $scope.hubs = [];
        $scope.userId = 0;
        $scope.date = {
            "fromDate": new Date()
        };
        $scope.selectedSlot = {
            "slot": {},
            "mainSlot": {}
        };
        $scope.model = {};
        $scope.model.allItemsSelected = false;

        /**
         * This method returns all the unassigned shipments based on the logged in client
         * 
         */
        $scope.getUnassignedShipments = function() {

            NProgress.start();
            $scope.userId = $rootScope.userId;
            // var input = angular.toJson({

            //     "fromDate": formatDate($scope.date.fromDate),
            //     "toDate": null,
            //     "type": CONSTANT.UNASSIGNED_SHIPMENTS,
            //     "locality": null,
            //     "index": -1,
            //     "count": -1,
            //     "carrierId": $scope.userId,
            //     "slot": $scope.selectedSlot.mainSlot,
            //     "route": $scope.selectedRoute.route,

            // });
            var input = angular.toJson({

                "date": formatDate($scope.date.fromDate),
                "slotId": 28,
                "route": ($scope.selectedRoute.route == 'All') ? '' : $scope.selectedRoute.route,
                "type": 1

            });
            console.log(input);
            ShipmentService.mmassignments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack);
        };

        $scope.retrieveShipmentsSuccessCallBack = function(data) {

            NProgress.done();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.jobs = [];
                $scope.jobs = data.jobs;
                $scope.shipmentCount = data.count;
                showAlert(CONSTANT.SUCCESS, "Route approved Successfully");
            } else {
                showAlert(CONSTANT.ERROR, "Failed to retrieve shipments");
            }
        };

        $scope.escalation = function(obj){
            showAlert(CONSTANT.SUCCESS, "Route Close successfully");
            if(obj == 'tr1'){                
                $scope.tr1 = true;
            }else if(obj == 'tr2'){                
                $scope.tr2 = true;
            }else if(obj == 'tr3'){                
                $scope.tr3 = true;
            }else if(obj == 'tr4'){                
                $scope.tr4 = true;
            }
        }

        $scope.escalationdc = function(obj){
            showAlert(CONSTANT.SUCCESS, "Escalate successfully");
            if(obj == 'tr1'){                
                $scope.tr1 = true;
            }else if(obj == 'tr2'){                
                $scope.tr2 = true;
            }else if(obj == 'tr3'){                
                $scope.tr3 = true;
            }else if(obj == 'tr4'){                
                $scope.tr4 = true;
            }
        }

        $scope.confirmDispatch = function(obj){
            showAlert(CONSTANT.SUCCESS, "Dispatch confirm successfully");
           
        }

        $scope.sendLinkViaSMS = function(){
            showAlert(CONSTANT.SUCCESS, "SMS sent successfully");
        }

        $scope.retrieveShipmentsErrorBack = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal error. Failed to retrieve shipments.");
        };

        /**
         * This method returns the available drivers
         * (
         */
        $scope.getDrivers = function() {
            NProgress.start();
            var input = angular.toJson({
                "date": formatDate(new Date()),
                "toDate": null,
                "managerId": 0,
                "locality": $rootScope.locality.toUpperCase(),
                "index": -1,
                "count": -1,
                "type": 1
            });
            console.log(input);
            DriversService.getFDrivers(input, $scope.getDriversSC, $scope.getDriversEC);
        };

        $scope.getDriversSC = function(data) {

            console.log(data);
            if (data.responseCode === "1000") {
                NProgress.done();
                $scope.drivers = [];
                $scope.drivers = data.drivers;
                if ($scope.drivers.length > 0) {
                    //$scope.selectedDriver.driver = $scope.drivers[0];
                } else {
                    showAlert(CONSTANT.SUCCESS, "No drivers found");
                    return;
                }
                showAlert(CONSTANT.SUCCESS, "Drivers retrieved successfully");
            } else {
                NProgress.done();
                showAlert(CONSTANT.ERROR, "Failed to get drivers");
            }
        };

        $scope.getDriversEC = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal Error. Failed to get drivers");
        };  

        $scope.getVehicles = function() {
            loaderStart();
            var input = angular.toJson({});
            console.log(input);
            DriversService.getTJUKVehicle(input, $scope.getVehicleSC, $scope.getVehicleEC);
        };

        $scope.getVehicleSC = function(data) {

            console.log(data);
            if (data.responseCode === "1000") {
                $scope.vehicles = [];
                $scope.vehicles =  [{
                    "name": "MH03CH0242",
                    "id": 1,
                    "class": "BIKE",
                    "type": 1
                },
                {
                    "name": "MH03CH0256",
                    "id": 2,
                    "class": "MINI",
                    "type": 2
                },
                {
                    "name": "MH03CH0245",
                    "id": 3,
                    "class": "TRUCK",
                    "type": 3
                }
            ];

                if ($scope.vehicles.length > 0) {
                    //$scope.selectedDriver.driver = $scope.drivers[0];
                } else {
                    showAlert("No vehicles found", "success");
                }
                loaderStop();
                showAlert("Vehicles retrieved successfully", "success");
            } else {
                loaderStop();
                showAlert("Failed to get vehicles", "error");
            }
        };

        $scope.getVehicleEC = function() {
            loaderStop();
            showAlert("Internal Error. Failed to get vehicles", "error");
        }; 

        $scope.toggleSelection = function(job) {     
            var idx = $scope.selectedShipments.indexOf(job.shipment.shipmentId);     
            if (idx > -1) {
                $scope.selectedShipments.splice(idx, 1);     
            } else {       
                $scope.selectedShipments.push(job.shipment.shipmentId);     
            }   

            for (var i = 0; i < $scope.jobs.length; i++) {
                if (!$scope.jobs[i].isChecked) {
                    $scope.model.allItemsSelected = false;
                    return;
                }
            }
            $scope.model.allItemsSelected = true;

        };
        $scope.selectAll = function() {
            // Loop through all the entities and set their isChecked property
            let selected = [];
            for (var i = 0; i < $scope.jobs.length; i++) {
                $scope.jobs[i].isChecked = $scope.model.allItemsSelected;
                if ($scope.jobs[i].isChecked) {
                    selected.push($scope.jobs[i].shipment.shipmentId);
                }
            }
            $scope.selectedShipments = selected;
        };

        $scope.setDriver = function() {
            // job.selectedDriverID = selectedDriver.userId;
        };

        $scope.setVehicle = function() {
            //job.selectedVehicleID = selectedVehicle.vehicleId;
        };

        $scope.setRoute = function(selectedRoute) {
            $scope.selectedRoute.route = selectedRoute;
        };

      

       
        /**
         * This method assigns the shipment to selected driver
         * 
         */
        $scope.assignShipments = function() {

            if ($scope.selectedDriver.driver == null || $scope.selectedDriver.driver == undefined ||
                !$scope.selectedDriver.driver.userId) {
                showAlert(CONSTANT.ERROR, "Select Driver");
                return;
            }

            if ($scope.selectedDriver.vechile.vehicleNo == null || $scope.selectedDriver.vechile.vehicleNo == undefined ||
                !$scope.selectedDriver.vechile.vehicleNo) {
                showAlert(CONSTANT.ERROR, "Select Vehicle");
                return;
            }
            if ($scope.selectedShipments.length <= 0) {
                showAlert(CONSTANT.ERROR, "Select any one order to assign");
                return;
            }
            NProgress.start();
            var driverId = $scope.selectedDriver.driver.userId;
            var map = {};
            for (var i = 0; i < $scope.selectedShipments.length; i++) {
                map[$scope.selectedShipments[i]] = driverId;
            }
            var input = angular.toJson({
                "assignmentMap": map,
                "tjuk": 1,
                "vehicle": {"vehicleId": $scope.selectedDriver.vechile.vehicleNo.vechile.vehicleId,"vehicleNo":$scope.selectedDriver.vechile.vehicleNo.vechile.vehicleNo}
            });
            console.log(input);
            ShipmentService.assignShipments(input, $scope.assignShipmentsSC, $scope.assignShipmentsEC);
        };

        $scope.assignShipmentsSC = function(data) {
            NProgress.done();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.selectedShipments = [];
                $scope.getUnassignedShipments();
            } else {
                showAlert(CONSTANT.ERROR, "Failed to assign one or more shipments");
            }
        };

        $scope.assignShipmentsEC = function() {
            NProgress.done();
            showAlert(CONSTANT.ERROR, "Internal Error. Failed to assign shipments to drivers");
        };

        //API to get List of DC's
        $scope.getListOfDc = function(){
            var input = {
             "managerId" :  $rootScope.userId
            };

            DriversService.getDC(input, $scope.getDCListSC, $scope.getDCListEC);
        }

        $scope.getDCListSC = function(data) {
            if (data.responseCode == "1000") {
                console.log(data.dc);
                $scope.dcList =(data.dc.replace(/[\[\]']+/g,'')).split(',');
              }
        }

        $scope.submitAdhocRoute = function() {
            var input = {
                "routeName":$scope.date.route,
                "managerId":$rootScope.userId,
                "dc":$scope.selectedDc.dc,
                "routeType":1,
                "stores":$scope.selectedStore
            };
                 console.log(input);
               DriversService.createRoute(input, $scope.adHocRouteSubmissionSC, $scope.adHocRouteSubmissionEC);
        }

        $scope.adHocRouteSubmissionSC = function(data) {
            if (data.responseCode == "1000") {
                console.log(data);  
                showAlert(CONSTANT.SUCCESS, "Successfully submitted.");             
              }
        }

        $scope.fetchStoreData = function(selectedDC) {
            var input = {
               "dc":selectedDC.trim()
              }
              console.log(input);
              DriversService.getListOfStores(input, $scope.fetchStoreDataSC, $scope.fetchStoreDataEC);
        }
        $scope.fetchStoreDataSC = function(data) {
            if (data.dc!=null) {
                console.log(data.storeInfo );
                $scope.storeInfo =  data.storeInfo;
                 var storeInfoData = {};
                for(var i =0; i< $scope.storeInfo.length ; i++){
                    storeInfoData[i] =  Object.values($scope.storeInfo[i]);    
                }
              //  $scope.storeInfoData =  Object.values($scope.storeInfo);       
                console.log(storeInfoData); 
                $scope.iterateStoreInfo = storeInfoData;
              }
        }
        $scope.selectedStore = [];
        $scope.submitSelectedStore = function(obj){
            console.log(obj);
           
            $scope.selectedStore.push(obj.storeInfo[0]);

            console.log($scope.selectedStore);
        }



        $scope.getListOfDc();

        $scope.getSHubs = function() {
            console.log("Get Hubs");
            NProgress.start();
            var input = angular.toJson({
                "carrierId": $rootScope.userId
            });
            console.log(input);
            ShipmentService.getSubHubs(input, $scope.getHubsSC, $scope.getHubsEC);
        };

        $scope.getHubsSC = function(data) {
            NProgress.done();
            if (data.responseCode == "1000") {
                $scope.hubs = data.carriers;
                console.log(data);
                var parentHub = {
                    "userId": $rootScope.userId,
                    "firstName": "All Hubs"
                };
                if ($scope.hubs.length > 0) {
                    console.log($scope.hubs[0]);
                    $scope.selectedHub.hub = $scope.hubs[0];
                    $scope.userId = $scope.selectedHub.hub.userId;
                } else {
                    $scope.hubs = [];
                    console.log("Empty");
                    $scope.selectedHub.hub = parentHub;
                }
                $scope.hubs.push(parentHub);
                $scope.getUnassignedShipments();
            } else {
                console.log(data);
            }
        };

        $scope.getHubsEC = function() {
            NProgress.done();
            console.log(CONSTANT.ERROR, "Internal error. Failed to unassign shipment.");
        };

        $scope.getSlots = function() {
            NProgress.start();
            var input = angular.toJson({
                "carrierId": $rootScope.userId
            });
            console.log(input);
            ShipmentService.getSlotsByClient(input, $scope.getSlotsSC, $scope.getSlotsEC);
        };

        $scope.getSlotsSC = function(data) {
            console.log(data);
            NProgress.done();
            $scope.slots = [];
            if (data.responseCode == "1000") {
                $scope.slots = data.slots;
                if ($scope.slots != null && $scope.slots.length > 0) {
                    $scope.selectedSlot.mainSlot = $scope.slots[0];
                    // $scope.getUnassignedShipments();
                } else {
                    showAlert(CONSTANT.INFO, "Slots not configured for this user");
                }
                $('#slotModal').modal('hide');
            } else {
                showAlert(CONSTANT.ERROR, "Failed to get slots");
            }
        };

        $scope.getSlotsEC = function() {
            showAlert(CONSTANT.ERROR, "Internal Error. Failed to get slots");
        };

        $scope.getRoutes = function() {
            loaderStart();
            var input = angular.toJson({
                "date": formatDate($scope.date.fromDate),
            });
            console.log(input);
            ShipmentService.getRoutes(input, $scope.getRouteSC, $scope.getRouteEC);
        };

        $scope.getRouteSC = function(data) {
            console.log(data);
            loaderStop();
            $scope.slots = [];
            if (data.responseCode == "1000") {
                $scope.routes = [];
                $scope.routes = data.routes;
                $scope.routes.splice(0, 0, 'All');
                if ($scope.routes.length > 0) {
                    // $scope.selectedRoute.route = $scope.routes[0];
                } else {
                    showAlert("No Routes found", "success");
                }
            } else {
                showAlert("Failed to get route", "error");
            }
        };

        $scope.getRouteEC = function() {
            showAlert("Internal Error. Failed to get route", "error");
        };

        //$scope.getSHubs();
        $scope.getSlots();
        $scope.getRoutes();
        $scope.getDrivers();
        $scope.getVehicles();

        $scope.onLoad = function() {
            $scope.getSlots();
            $scope.getRoutes();
            $scope.getDrivers();
        }; 

        $scope.onRouteChange = function() {
            $scope.getUnassignedShipments();
        }; 

    }
]);