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

myApp.factory('AlertService',['CONSTANT', function(CONSTANT) {

    return {
        showAlert: function(view, shipmentArr) {
            if (view == CONSTANT.ONGOING_VIEW) {
                if (shipmentArr.length > 0) {
                    showAlert("On-going shipments retrieved successfully.", "success");
                } else {
                    showAlert("No on going shipments found.", "success");
                }
            } else if (view == CONSTANT.PENDING_VIEW) {
                if (shipmentArr.length > 0) {
                    showAlert("Pending shipments retrieved successfully", "success");
                } else {
                    showAlert("No pending shipments found", "success");
                }
            } else if (view == CONSTANT.COMPLETED_VIEW) {
                if (shipmentArr.length > 0) {
                    showAlert("Completed shipments retrieved successfully.", "success");
                } else {
                    showAlert("No completed shipments found.", "success");
                }
            } else if (view == CONSTANT.TURNAWAY_VIEW) {
                if (shipmentArr.length > 0) {
                    showAlert("Turn away shipments retrieved successfully.", "success");
                } else {
                    showAlert("No turn away shipments found.", "success");
                }
            } else if (view == CONSTANT.UNASSIGNED_VIEW) {
                if (shipmentArr.length > 0) {
                    showAlert("Unassigned shipments retrieved successfully.", "success");
                } else {
                    showAlert("No unassigned shipments found.", "success");
                }
            }
        }
    };
}]);