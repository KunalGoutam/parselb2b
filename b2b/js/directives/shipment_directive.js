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

directives.directive('shipmentlist', function() {
    
    return {
        restrict: 'EA',
        templateUrl: 'partials/shipment_segments/shipments_segment.html',
        scope: {
            list: "=",
            currentview: "=",
            constant: "=",
            shipmenttime: "=",
            viewlocation:"&",
            deleteshipment:"&"
        },
    };
});

directives.directive('shipmentlistpbb3', function() {
    
    return {
        restrict: 'EA',
        templateUrl: 'partials/shipment_segments/pbb3_shipment_segments.html',
        scope: {
            list: "=",
            currentview: "=",
            constant: "=",
            shipmenttime: "=",
            viewlocation:"&",
            deleteshipment:"&",
            viewdetails:"&"
        },
    };
});

directives.directive('otshipmentlist', function() {
    
    return {
        restrict: 'EA',
        templateUrl: 'partials/shipment_segments/onetouch_shipments_segment.html',
        scope: {
            list: "=",
            currentview: "=",
            constant: "=",
            shipmenttime: "=",
            viewlocation:"&",
            deleteshipment:"&"
        },
    };
});

directives.directive('reportslist', function() {
    
    return {
        restrict: 'EA',
        templateUrl: 'partials/reports-view/reports-table.html',
        scope: {
            list: "=",
            currentview: "=",
            constant: "=",
            carriername: "=",
            viewlocation:"&",
            deleteshipment:"&",
            viewdetails:"&"
        },
    };
});