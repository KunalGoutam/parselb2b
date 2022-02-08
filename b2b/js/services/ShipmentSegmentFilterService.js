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

/*
myApp.factory('ShipmentSegmentFilterService', function() {

    return {
        getSegmentedShipments: function(shipmentArr, selectedDate) {
            var shipment = {};
            shipment.segment_00_06_segment = [];
            shipment.segment_06_12_segment = [];
            shipment.segment_12_18_segment = [];
            shipment.segment_18_24_segment = [];
            for (var m = 0; m < shipmentArr.length; m++) {
                var currentDateTime = new Date(shipmentArr[m].shipment.createdDate).getTime();
                var date_00 = new Date(selectedDate);
                date_00.setHours(0, 0, 0);
                var date_06 = new Date(selectedDate);
                date_06.setHours(6, 0, 0);
                var date_12 = new Date(selectedDate);
                date_12.setHours(12, 0, 0);
                var date_18 = new Date(selectedDate);
                date_18.setHours(18, 0, 0);
                var date_24 = new Date(selectedDate);
                date_24.setHours(23, 59, 59);
                if (currentDateTime > date_00.getTime() && currentDateTime < date_06.getTime()) {
                    shipment.segment_00_06_segment.push(shipmentArr[m]);
                } else if (currentDateTime > date_06.getTime() && currentDateTime < date_12.getTime()) {
                    shipment.segment_06_12_segment.push(shipmentArr[m]);
                } else if (currentDateTime > date_12.getTime() && currentDateTime < date_18.getTime()) {
                    shipment.segment_12_18_segment.push(shipmentArr[m]);
                } else if (currentDateTime > date_18.getTime() && currentDateTime < date_24.getTime()) {
                    shipment.segment_18_24_segment.push(shipmentArr[m]);
                }
            }
            return shipment;
        }
    };
});*/

myApp.factory('ShipmentSegmentFilterService', function() {

    return {
        getSegmentedShipments: function(shipmentArr, selectedDate) {
            var shipment = {};
            shipment.segment_00_06_segment = [];
            shipment.segment_06_12_segment = [];
            shipment.segment_12_18_segment = [];
            shipment.segment_18_24_segment = [];
            for (var m = 0; m < shipmentArr.length; m++) {
                var currentDateTime = new Date(shipmentArr[m].shipment.createdDate).getTime();
                var date_00 = new Date(selectedDate);
                date_00.setHours(0, 0, 0);
                var date_06 = new Date(selectedDate);
                date_06.setHours(6, 0, 0);
                var date_12 = new Date(selectedDate);
                date_12.setHours(12, 0, 0);
                var date_18 = new Date(selectedDate);
                date_18.setHours(18, 0, 0);
                var date_24 = new Date(selectedDate);
                date_24.setHours(23, 59, 59);
                if (currentDateTime > date_00.getTime() && currentDateTime < date_06.getTime()) {
                    shipment.segment_00_06_segment.push(shipmentArr[m]);
                } else if (currentDateTime > date_06.getTime() && currentDateTime < date_12.getTime()) {
                    shipment.segment_06_12_segment.push(shipmentArr[m]);
                } else if (currentDateTime > date_12.getTime() && currentDateTime < date_18.getTime()) {
                    shipment.segment_12_18_segment.push(shipmentArr[m]);
                } else if (currentDateTime > date_18.getTime() && currentDateTime < date_24.getTime()) {
                    shipment.segment_18_24_segment.push(shipmentArr[m]);
                }
            }
            shipment.segment_00_06_segment.sort(function(a, b) {
                return parseInt(b.shipment.createdDate) - parseInt(a.shipment.createdDate);
            });
            shipment.segment_06_12_segment.sort(function(a, b) {
                return parseInt(b.shipment.createdDate) - parseInt(a.shipment.createdDate);
            });
            shipment.segment_12_18_segment.sort(function(a, b) {
                return parseInt(b.shipment.createdDate) - parseInt(a.shipment.createdDate);
            });
            shipment.segment_18_24_segment.sort(function(a, b) {
                return parseInt(b.shipment.createdDate) - parseInt(a.shipment.createdDate);
            });
            return shipment;
        },
        
        getSegmentedShipmentsByUser: function(shipmentArr) {
            var shipment = {};
            shipment["keys"] = [];
            for (var k = 0; k < shipmentArr.length; k++) {
                var userObj = null;
                if (shipmentArr[k].shipment.carrier != null) {
                    userObj = shipmentArr[k].shipment.carrier;
                } else if (shipmentArr[k].shipment.user != null) {
                    userObj = shipmentArr[k].shipment.user;
                } else {
                    //Deleted User
                }
                if (userObj != null) {
                    if (userObj.userId in shipment) {
                    shipment[userObj.userId].push(shipmentArr[k]);
                    } else {
                        var newShipmentArr = [];
                        shipment[userObj.userId] = newShipmentArr;
                        shipment[userObj.userId].push(shipmentArr[k]);
                        shipment.keys.push(userObj.userId);
                    }
                } 
            }
            return shipment;
        }
    };
});