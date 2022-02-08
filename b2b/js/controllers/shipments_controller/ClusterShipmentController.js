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
 
var cShipmentController = myApp.controller('ClusterShipmentsController', ['$rootScope', '$scope', '$routeParams', '$http', '$interval', 'HelperService', '$location', 'CONSTANT', 'ValidationService', '$filter', 'ShipmentService', 'AlertService', 'ShipmentSegmentFilterService', function($rootScope, $scope, $routeParams, $http, $interval, HelperService, $location, CONSTANT, ValidationService, $filter, ShipmentService, AlertService, ShipmentSegmentFilterService) {

    
    $scope.getUnassignedShipments = function() {

            loaderStart();
            var input = angular.toJson({});
            ShipmentService.getClusterUnassignShipments(input, $scope.retrieveShipmentsSuccessCallBack, $scope.retrieveShipmentsErrorBack, $rootScope.userId);
        };

        $scope.retrieveShipmentsSuccessCallBack = function(data) {

            loaderStop();
            console.log(data);
            if (data.responseCode === "1000") {
                $scope.jobs = [];
                if (data.unassignShipments != null) {
                    $scope.unassignShipmentsMap = data.unassignShipments;
                    showAlert("Shipments retrieved successfully", "success");
                } else {
                    showAlert("No shipments found", "success");
                }
            } else {
                showAlert("Failed to retrieve shipments", "error");
            }
        };

        $scope.retrieveShipmentsErrorBack = function() {
            loaderStop();
            showAlert("Internal error. Failed to retrieve shipments.", "error");
        };

        $scope.getUnassignedShipments();

    angular.element(document).ready(function() {
        $.Template.layout.activate();
    });
}]);