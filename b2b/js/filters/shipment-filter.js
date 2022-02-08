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

filters.filter('ShipmentFilter', ['$filter', function($filter) {
    return function(CONSTANT, data, currentView) {

        var shipmentArr = [];
        if (currentView == CONSTANT.PENDING_VIEW) {
            shipmentArr = $filter('PendingShipments')(data);
        } else if (currentView == CONSTANT.COMPLETED_VIEW) {
            shipmentArr = $filter('CompletedShipments')(data);
        } else if (currentView == CONSTANT.TURNAWAY_VIEW) {
            shipmentArr = $filter('TurnAwayShipments')(data);
        } else if (currentView == CONSTANT.ONGOING_VIEW) {
            shipmentArr = $filter('OnGoingShipments')(data);
        } else if (currentView == CONSTANT.UNASSIGNED_VIEW) {
            shipmentArr = $filter('UnassignedShipments')(data);
        }
        return shipmentArr;
    };
}]);

filters.filter('PendingShipments', ['CONSTANT', function(CONSTANT) {

    return function(data) {
        var pendingShipmentArr = [];
        var date = null;
        for (var i = 0; i < data.pending.length; i++) {
            if (data.pending[i].driver != null && data.pending[i].status != null) {
                if (data.pending[i].status.flow == CONSTANT.ASSIGNED) {
                    pendingShipmentArr.push(data.pending[i]);
                    if (data.pending[i].shipment.wfDetails == null) {
                        data.pending[i].shipment.wfDetails = {"eta": "Not Applicable"}
                    } else if (data.pending[i].shipment.wfDetails != null && (data.pending[i].shipment.wfDetails.eta == null || data.pending[i].shipment.wfDetails.eta == "")) {
                        data.pending[i].shipment.wfDetails = {"eta": "Not Applicable"}
                    }
                    date = new Date(data.pending[i].shipment.createdDate);
                    data.pending[i].shipment.createdTime = date.getHours() + ":" + date.getMinutes();
                }
            }
        }
        return pendingShipmentArr;
    };
}]);

filters.filter('OnGoingShipments', ['CONSTANT', '$rootScope', function(CONSTANT, $rootScope) {

    return function(data) {
        var onGoingShipmentArr = [];
        var date = null;
        for (var i = 0; i < data.pending.length; i++) {
            if (data.pending[i].driver != null && data.pending[i].status != null) {
                if (data.pending[i].shipment.wfDetails == null) {
                    data.pending[i].shipment.wfDetails = {"eta": "Not Applicable"}
                } else if (data.pending[i].shipment.wfDetails != null && (data.pending[i].shipment.wfDetails.eta == null || data.pending[i].shipment.wfDetails.eta == "")) {
                    data.pending[i].shipment.wfDetails = {"eta": "Not Applicable"}
                }
                if ($rootScope.appId == 4) {
                    if (data.pending[i].status.flow == CONSTANT.REACHED || data.pending[i].status.flow == CONSTANT.PBB3_COLLECT_PARCEL || data.pending[i].status.flow == CONSTANT.PBB3_START_TRIP || data.pending[i].status.flow == CONSTANT.PBB3_END_TRIP) {
                        if (data.pending[i].shipment.wfDetails != null && data.pending[i].shipment.wfDetails.wfValues != null && data.pending[i].shipment.wfDetails.wfValues.START_TRIP_TIME == null) {
                            data.pending[i].shipment.wfDetails.wfValues.START_TRIP_TIME = "Trip Not yet Started.";
                        }
                        onGoingShipmentArr.push(data.pending[i]);
                    }
                } else if ($rootScope.appId == 2 || $rootScope.appId == 1 || $rootScope.appId == 3 || $rootScope.appId == 5) {
                    if (data.pending[i].status.flow == CONSTANT.START_TRIP || data.pending[i].status.flow == CONSTANT.END_TRIP) {
                        onGoingShipmentArr.push(data.pending[i]);
                    }
                }
                date = new Date(data.pending[i].shipment.createdDate);
                data.pending[i].shipment.createdTime = date.getHours() + ":" + date.getMinutes();
            }
        }
        return onGoingShipmentArr;
    };
}]);

filters.filter('CompletedShipments', ['CONSTANT', function(CONSTANT) {

    return function(data) {
        var completedShipmentArr = [];
        var date = null;
        for (var i = 0; i < data.completed.length; i++) {
            if (data.completed[i].shipment.wfDetails != null && data.completed[i].shipment.wfDetails.wfValues != null) {
                var distanceTravelled = data.completed[i].shipment.wfDetails.wfValues.DISTANCE_TRAVELLED;
                if (!isNaN(distanceTravelled)) {
                    distanceTravelled = Number(distanceTravelled) / 1000;
                    data.completed[i].shipment.wfDetails.wfValues.DISTANCE_TRAVELLED = Number(Math.round(distanceTravelled * 10) / 10) + " Kms";
                }
                date = new Date(data.completed[i].shipment.createdDate);
                data.completed[i].shipment.createdTime = date.getHours() + ":" + date.getMinutes();
            }
        }
        completedShipmentArr = data.completed;
        return completedShipmentArr;
    };
}]);

filters.filter('TurnAwayShipments', function() {
    return function(data) {
        return data.turnedAway;
    };
});

filters.filter('UnassignedShipments', ['CONSTANT', function(CONSTANT) {

    return function(data) {
        var unAssignedShipmentArr = [];
        var date = null;
        for (var i = 0; i < data.pending.length; i++) {
            if (data.pending[i].driver == null) {
                data.pending[i].status = {};
                data.pending[i].status.flow = CONSTANT.UNASSIGNED_STATUS;
                unAssignedShipmentArr.push(data.pending[i]);
                date = new Date(data.pending[i].shipment.createdDate);
                data.pending[i].shipment.createdTime = date.getHours() + ":" + date.getMinutes();
            }
        }
        return unAssignedShipmentArr;
    };
}]);