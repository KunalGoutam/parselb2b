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

myApp.factory('ValidationService',['$rootScope', function($rootScope) {

    return {
        validateShipmentInput: function(createShipmentArr) {
            var isValid = true;
            if ($("#txtPickUpPoint").val() == '') {
                $("#txtPickUpPoint").addClass("validation-error");
                isValid = false;
            }
            for (var m = 0; m < createShipmentArr.length; m++) {

                if ($("#" + createShipmentArr[m].dropId).val() == '' && $("#" + createShipmentArr[m].customerNameId).val() == '' &&
                    $("#" + createShipmentArr[m].customerPhoneId).val() == '' && $("#" + createShipmentArr[m].codId).val() == '' &&
                    $("#" + createShipmentArr[m].vendorPhoneId).val() == '' && $("#" + createShipmentArr[m].orderNumberId).val() == '') {

                } else {
                    if ($("#" + createShipmentArr[m].dropId).val() == '') {
                        $("#" + createShipmentArr[m].dropId).addClass("validation-error");
                        isValid = false;
                    }
                    if ($("#" + createShipmentArr[m].customerNameId).val() == '') {
                        $("#" + createShipmentArr[m].customerNameId).addClass("validation-error");
                        isValid = false;
                    }
                    if ($("#" + createShipmentArr[m].customerPhoneId).val() == '') {
                        $("#" + createShipmentArr[m].customerPhoneId).addClass("validation-error");
                        isValid = false;
                    }
                    if ($("#" + createShipmentArr[m].codId).val() == '') {
                        $("#" + createShipmentArr[m].codId).addClass("validation-error");
                        isValid = false;
                    }
                    if ($("#" + createShipmentArr[m].orderNumberId).val() == '') {
                        $("#" + createShipmentArr[m].orderNumberId).addClass("validation-error");
                        isValid = false;
                    }
                    if ($("#" + createShipmentArr[m].vendorPhoneId).val() == '') {
                        $("#" + createShipmentArr[m].vendorPhoneId).addClass("validation-error");
                        isValid = false;
                    }
                }
            }
            return isValid;
        },

        removeValidationError: function(id) {
            var value = $("#" + id).val();
            if (value != '') {
                $("#" + id).removeClass("validation-error");
            } else {
                $("#" + id).addClass("validation-error");
            }
        },

        validateSlotDuration: function(slotDuration) {
            var isValid = true;
            if (slotDuration == undefined || slotDuration == null) {
                $rootScope.showalert("Please enter slot duration.", "alert-danger");
                var isValid = false;
            }
            if (slotDuration < 60) {
                $rootScope.showalert("Slot duration cannot be less than 1 hr.", "alert-danger");
                var isValid = false;
            }
            return isValid;
        }
    };
}]);